import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import type { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { BankDocumentsController } from "./BankDocumentsController"
import { BankConstants } from "~/scripts/constants/Banks"
import type { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import { CimbBankApplicationDetails } from "~/scripts/types/banks/CimbBankApplicationDetails"
import { DownloadFileData } from "~/scripts/types/DownloadFileData"
import { PDFDocument } from "pdf-lib"

export class CimbBankDocumentsController extends BankDocumentsController {
  bankId: string = BankConstants.CIMB_DETAIL.id

  applicationRef: any | null = null
  omnibusRef: any | null = null
  bankResolutionRef: any | null = null

  // Readonly document data supplied by the parent.
  application = ref<CompanyBankAccountOpening>(new CompanyBankAccountOpening())

  typeOfApplicationSelected: Ref<string | null> = ref<string | null>(null)
  overlayPage: Ref<number> = ref<number>(1)

  private omnibusDetails: CimbBankApplicationDetails | null = null
  private omnibusApplicationId: string | null = null
  private omnibusSignatoryType: string | null = null

  constructor(props: any, emitEvents: any) {
    super(props.companyId, emitEvents)
  }

  setApplicationRef(applicationRef: any): void {
    this.applicationRef = applicationRef
  }

  setBankResolutionRef(bankResolutionRef: any): void {
    this.bankResolutionRef = bankResolutionRef
    this.setDcrRef(bankResolutionRef)
  }

  setOmnibusRef(omnibusRef: any): void {
    this.omnibusRef = omnibusRef
  }

  setResolutionDocument(application: CompanyBankAccountOpening | null): void {
    const previousId = this.application.value?.id ?? ""
    const nextId = application?.id ?? ""
    if (!application || previousId !== nextId) {
      this.clearOmnibusDetails()
      this.overlayPage.value = 1
    }

    this.application.value = application ?? new CompanyBankAccountOpening()
    this.typeOfApplicationSelected.value = application?.cimbBankApplicationDetails?.typeOfApplication ?? null
  }

  getDocumentApplication(): CompanyBankAccountOpening | null {
    return (
      this.applicationRef?.getApplication?.() ??
      this.bankResolutionRef?.getApplication?.() ??
      this.application.value ??
      null
    )
  }

  private hasCurrentOmnibusDetails(): boolean {
    return this.omnibusDetails !== null && this.omnibusApplicationId === (this.getDocumentApplication()?.id ?? "")
  }

  getApplication(): CompanyBankAccountOpening | null {
    const application = this.getDocumentApplication()
    if (application) {
      application.cimbBankApplicationDetails = this.getOtherDetails()
      application.signatoryType = this.getSignatoryType()
    }
    return application
  }

  clearOmnibusDetails(): void {
    this.omnibusDetails = null
    this.omnibusApplicationId = null
    this.omnibusSignatoryType = null
  }

  onOmnibusUpdated(): void {
    const details = this.omnibusRef?.getOtherDetails?.()
    if (details) {
      this.omnibusDetails = new CimbBankApplicationDetails(details)
      this.omnibusApplicationId = this.omnibusRef?.getApplication?.()?.id ?? this.getDocumentApplication()?.id ?? ""
      this.omnibusSignatoryType = this.omnibusRef?.getSignatoryType?.() ?? null
    }
    this.emitEvents("updated")
  }

  override getBranchId(): string {
    return (
      this.applicationRef?.getBranchId?.() ??
      this.bankResolutionRef?.getBranchId?.() ??
      this.application.value.bankBranchId ??
      ""
    )
  }

  override getSignatories(): CompanyBankSignatory[] {
    return (
      this.applicationRef?.getSignatories?.() ??
      this.bankResolutionRef?.getSignatories?.() ??
      this.application.value.signatories ??
      []
    )
  }

  override getSignatoryType(): string {
    // An empty string is also an update: it means the selection was cleared.
    if (this.hasCurrentOmnibusDetails() && this.omnibusSignatoryType !== null) {
      return this.omnibusSignatoryType
    }
    return (
      this.applicationRef?.getSignatoryType?.() ??
      this.bankResolutionRef?.getSignatoryType?.() ??
      this.application.value.signatoryType ??
      ""
    )
  }

  override getAuthorisedPersonsForOnlineBanking(): OnlineBanking[] {
    return (
      this.applicationRef?.getAuthorisedPersonsForOnlineBanking?.() ??
      this.bankResolutionRef?.getAuthorisedPersonsForOnlineBanking?.() ??
      this.application.value.onlineBanking ??
      []
    )
  }

  override getOtherDetails(): CimbBankApplicationDetails {
    const applicationDetails =
      this.applicationRef?.getOtherDetails?.() ?? this.getDocumentApplication()?.cimbBankApplicationDetails
    const details = applicationDetails
      ? new CimbBankApplicationDetails(applicationDetails)
      : new CimbBankApplicationDetails()

    if (this.hasCurrentOmnibusDetails() && this.omnibusDetails) {
      const omnibus = this.omnibusDetails
      details.generalOperationAuthorisedPersons = omnibus.generalOperationAuthorisedPersons
      details.omnibusAuthorisedCount = omnibus.omnibusAuthorisedCount
      details.generalOperationSigningCondition = omnibus.generalOperationSigningCondition
      details.generalOperationSigningCount = omnibus.generalOperationSigningCount
      details.boardResolutionDate = omnibus.boardResolutionDate
      details.extractPassedDate = omnibus.extractPassedDate
      details.extractCertificationDate = omnibus.extractCertificationDate
      details.omnibusCertifiers = omnibus.omnibusCertifiers
    }

    details.typeOfApplication = this.typeOfApplicationSelected.value
    return details
  }

  override async getPdfPages(): Promise<HTMLElement[]> {
    await nextTick()

    const pages: HTMLElement[] = []

    if (this.applicationRef) {
      const applicationPages = await this.applicationRef.getPdfPages()
      pages.push(...applicationPages)
    }

    if (this.omnibusRef) {
      const omnibusPages = await this.omnibusRef.getPdfPages()
      pages.push(...omnibusPages)
    }

    const resolutionPages = await super.getPdfPages()
    pages.push(...resolutionPages)

    return pages
  }

  onClickTypeOfApplicationOption(optionValue: string): void {
    this.typeOfApplicationSelected.value = this.typeOfApplicationSelected.value === optionValue ? null : optionValue
  }

  onOverlayNextClick(): void {
    this.overlayPage.value = 2
  }

  onOverlayBackClick(): void {
    this.overlayPage.value = 1
  }

  onOverlaySubmitClick(): void {
    if (!this.typeOfApplicationSelected.value) return
    this.emitEvents("updated")
  }

  get isShowOverlay(): boolean {
    return (
      this.application.value.status === "paid" && !this.application.value.cimbBankApplicationDetails?.typeOfApplication
    )
  }

  get isShowCimbApplication(): boolean {
    return this.application.value.cimbBankApplicationDetails?.typeOfApplication === "prefilled-information"
  }

  async getPrefilledApplicationPdf(): Promise<Blob> {
    const pdfUrl =
      "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/banks/document/CIMB+APPLICATION+FORM.pdf"

    const response = await fetch(pdfUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch CIMB application form: ${response.status}`)
    }
    const pdfBytes = await response.arrayBuffer()

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()

    const application = this.getApplication()
    const details = application?.cimbBankApplicationDetails

    if (application && details) {
      const companyName = this.company.value.getFullName().toUpperCase()
      const registrationNumber = this.company.value.registrationNumberNew ?? ""

      // Page 1 - Business Information
      form.getTextField("Text15").setText(companyName)
      form.getTextField("Text17").setText(registrationNumber)

      // Signature Form
      form.getTextField("Text125").setText(companyName)

      // Omnibus Board Resolution
      form.getTextField("Text249").setText(companyName)
      form.getTextField("Text250").setText(registrationNumber)

      // Extract Omnibus Board Resolution
      form.getTextField("Text249ab").setText(companyName)
      form.getTextField("Text250ab").setText(registrationNumber)
    }

    const output = await pdfDoc.save()

    const arrayBuffer = output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength) as ArrayBuffer

    return new Blob([arrayBuffer], {
      type: "application/pdf",
    })
  }

  async logCimbPdfFields(): Promise<void> {
    const pdfUrl =
      "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/banks/document/CIMB+APPLICATION+FORM.pdf"

    const response = await fetch(pdfUrl)
    const pdfBytes = await response.arrayBuffer()

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()

    form.getFields().forEach((field) => {
      console.log(field.getName(), field.constructor.name)
    })
  }

  override async getAdditionalDownloadFiles(): Promise<DownloadFileData[]> {
    const applicationPdf = await this.getPrefilledApplicationPdf()

    return [new DownloadFileData(URL.createObjectURL(applicationPdf), "CIMB Application Form.pdf")]
  }
}
