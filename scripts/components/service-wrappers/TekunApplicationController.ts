import { CompanyTekunApplication } from "~/scripts/models/CompanyTekunApplication"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyLoanApplicationStore } from "~/stores/CompanyLoanApplications"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { PdfRenderer } from "~/scripts/library/PdfRenderer"
import { DocumentsAndForms } from "~/scripts/library/DocumentsAndForms"
import type { Form } from "~/scripts/models/Form"
import { CompanyDocumentNames } from "~/scripts/constants/CompanyDocuments"

export class TekunApplicationController
  extends ServiceController
  implements IServiceController<CompanyTekunApplication, ReturnType<typeof useCompanyLoanApplicationStore>>
{
  application: CompanyTekunApplication = new CompanyTekunApplication()
  applicationRef = ref<CompanyTekunApplication>(new CompanyTekunApplication())
  applicationId: string | null = null
  repository = useCompanyLoanApplicationStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  coiFileUrl: Ref<string> = ref<string>("")
  corporateProfileFileUrl: Ref<string> = ref<string>("")
  applicationFormFileUrl: string =
    "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/documents/samples/borang-permohonan-tekun.pdf"

  pdfRendererForApplicationForm = ref<PdfRenderer>(new PdfRenderer(""))
  pdfRendererForCorporateProfile = ref<PdfRenderer>(new PdfRenderer(""))
  pdfRendererForCOI = ref<PdfRenderer>(new PdfRenderer(""))

  numberOfPagesForApplicationForm: Ref<number> = ref<number>(4)
  numberOfPagesForCorporateProfile: Ref<number> = ref<number>(1)
  numberOfPagesForCOI: Ref<number> = ref<number>(1)

  tekunApplication = ref<CompanyTekunApplication>(new CompanyTekunApplication())

  pageCanvasesApplicationForm: Record<number, HTMLCanvasElement | null> = {}
  pageCanvasesCorporateProfile: Record<number, HTMLCanvasElement | null> = {}
  pageCanvasesCOI: Record<number, HTMLCanvasElement | null> = {}

  documentsAndForms = ref<DocumentsAndForms>(new DocumentsAndForms(""))

  isLoading = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_LOAN_APPLICATION, companyId, emitEvents)

    this.init(applicationId ?? "")
  }

  async init(applicationId: string): Promise<void> {
    this.applicationId = applicationId

    let promises = [this.setData()]

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      promises.push(this.fetchApplication(applicationId ?? ""))
    }

    await Promise.all(promises)
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyTekunApplication(response)
      this.applicationRef.value = new CompanyTekunApplication(response)
      // this.applicationId = this.application.id
      this.targetId = this.applicationId
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyTekunApplication()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  async setData(): Promise<void> {
    this.documentsAndForms.value.companyId = this.companyId
    await this.documentsAndForms.value.fetchForms()

    let coi = this.documentsAndForms.value.getCertificateOfIncorporation("Certificate of Incorporation", false, false)
    this.coiFileUrl.value = coi.fileUrl ?? ""

    let corporateProfile =
      this.documentsAndForms.value.forms.find((cd: Form) => {
        if (!cd.file) {
          return false
        }

        return StringUtil.contains(cd.file.name, CompanyDocumentNames.CorporateProfile)
      }) ?? null
    this.corporateProfileFileUrl.value = corporateProfile?.file?.url ?? ""

    let promises = []

    this.pdfRendererForApplicationForm.value.pdfUrl = this.applicationFormFileUrl
    promises.push(this.pdfRendererForApplicationForm.value.renderPdf())

    if (this.isCoiAvailable) {
      this.pdfRendererForCOI.value.pdfUrl = this.coiFileUrl.value
      promises.push(this.pdfRendererForCOI.value.renderPdf())
    }

    if (this.isSsmCorporateProfileAvailable) {
      this.pdfRendererForCorporateProfile.value.pdfUrl = this.corporateProfileFileUrl.value
      promises.push(this.pdfRendererForCorporateProfile.value.renderPdf())
    }

    await Promise.all(promises)
  }

  setPageCanvasesForApplicationForm(pageNumber: number, canvas: HTMLCanvasElement | null): void {
    this.pdfRendererForApplicationForm.value.setPageCanvas(pageNumber, canvas)
  }

  setPageCanvasesForCorporateProfile(pageNumber: number, canvas: HTMLCanvasElement | null): void {
    this.pdfRendererForCorporateProfile.value.setPageCanvas(pageNumber, canvas)
  }

  setPageCanvasesForCOI(pageNumber: number, canvas: HTMLCanvasElement | null): void {
    this.pdfRendererForCOI.value.setPageCanvas(pageNumber, canvas)
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  async onApplicationUpdated(data: any): Promise<void> {
    this.application = new CompanyTekunApplication(data)
    this.emitEvents("back", this.application)
    await this.onUpdate()
  }

  async onSubmitClicked(): Promise<void> {
    if (this.isADirector.value) {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application = new CompanyTekunApplication(updatedData)
        this.application.id = this.applicationId ?? ""
      }
    } else if (this.isAShareholder.value) {
      if (this.mcrRef) {
        let updatedData = this.mcrRef.getApplication()
        this.application = new CompanyTekunApplication(updatedData)
        this.application.id = this.applicationId ?? ""
      }
    }

    try {
      this.emitEvents("back", this.application)

      await this.onUpdate()

      if (this.isADirector.value || this.isAShareholder.value) {
        await this.submitSignature()
      }

      this.emitEvents("applicationUpdated", this.application)
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async onCreate(): Promise<void> {
    await this.application.create(this.repository)
    this.applicationId = this.application.id
    this.targetId = this.application.id
  }

  async onUpdate(): Promise<void> {
    await this.application.update(this.repository)
  }

  async onRemove(): Promise<void> {
    if (this.applicationId === null) {
      this.emitEvents("back")
    }
    // TODO: update function
    // Must ask for confirmation before it proceeds to delete
    // await this.application.remove(this.repository)
    this.emitEvents("back")
  }

  helpTitle(): string {
    return this.language.isMalay()
      ? `Resolusi Pengarah & Pemegang Saham untuk Memperuntuk Saham Baharu`
      : "DCR & MCR to Allot New Shares"
  }

  helpDescription(): string {
    //Get more details for help
    return this.language.isMalay()
      ? `Resolusi ini memerlukan:
        <ul>
          <li>Sekurang-kurangnya satu (1) <b>Cadangan Nama</b>. Ketersediaan nama adalah tertakluk kepada SSM.</li>
          <li><b>Resolusi Khas</b> mesti mencapai majoriti sekurang-kurangnya <b>75%</b> daripada Pemegang Saham.</li>
        </ul>
        Anda boleh Beli & Muat Turun Profil Korporat SSM sebagai pengesahan perubahan (pilihan).
        `
      : `This resolution requires:
          <ul>
            <li>At least one (1) <b>Proposed Name</b>. The availability of name is subjected to SSM.</li>
            <li>The <b>Special Resolution</b> must reach a majority of at least <b>75%</b> of the Shareholders.</li>
          </ul>
          You can Purchase & Download SSM Corporate Profile as confirmation of the change (optional).
        `
  }

  isDraft(): boolean {
    return this.application.signatureGroups.length <= 0
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyTekunApplication>(
      this.companyId,
      this.applicationId,
      this.applicationRef.value as CompanyTekunApplication,
      this.isDraft(),
      "Draft",
      false,
      false
    )
  }

  get isCoiAvailable(): boolean {
    return !StringUtil.isNullOrEmpty(this.coiFileUrl.value)
  }

  get isSsmCorporateProfileAvailable(): boolean {
    return !StringUtil.isNullOrEmpty(this.corporateProfileFileUrl.value)
  }

  get ssmCorporateProfileNotAvailable(): string {
    return this.language.isMalay() ? "Profil Korporat SSM<br>Terkini" : "Latest<br>SSM Corporate Profile"
  }

  get coiNotAvailable(): string {
    return this.language.isMalay() ? "Sijil<br>Pemerbadanan" : "Certificate of<br>Incorporation"
  }

  get completeInWetInk(): string {
    return this.language.isMalay() ? "Lengkapkan<br>dengan Dakwat Basah" : "Complete<br>in Wet Ink"
  }
}
