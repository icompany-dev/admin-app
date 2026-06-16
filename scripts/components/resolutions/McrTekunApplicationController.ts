import { CompanyTekunApplication } from "~/scripts/models/CompanyTekunApplication"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { ConstitutionAmendmentTypes } from "~/scripts/constants/AmendmentTypes"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { Shareholder } from "~/scripts/models/Shareholder"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { StatusConstants } from "~/scripts/constants/Status"

export class McrTekunApplicationController extends ResolutionController<CompanyTekunApplication> {
  companyTekunApplicationRepository = useCompanyLoanApplicationStore()
  companyRepository = useCompanyStore()

  time = useLocalTime()

  additionalClass: string = "tekun-application resolution"
  paperOrientation: PaperOrientation = PaperOrientation.Portrait

  authorisedPerson: Ref<string> = ref<string>("")
  isPaid: Ref<boolean> = ref<boolean>(false)

  shareholders = ref<Shareholder[]>([])
  signatures = ref<SignatureItem[]>([])

  constructor(props: IPropsResolutionDocument<CompanyTekunApplication>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyTekunApplication,
      props.isInPreviewMode,
      false,
      true,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 2
    this.maxSignatureOnFirstPage.value = 4
    this.maxSignatureOnOtherPages.value = 6
    this.isUsingTemplate.value = false
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyTekunApplicationRepository.fetch(id)
    if (!this.companyTekunApplicationRepository.error && response !== null) {
      this.application.value = new CompanyTekunApplication(response)
      this.isPaid.value = this.application.value.status !== StatusConstants.DRAFT
      this.authorisedPerson.value = this.application.value.applicationDetails.authorisedPerson
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    let response = await this.companyRepository.fetch(this.companyId.value)
    let company = new Company(response)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyTekunApplication()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.initializeData()
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  async otherDataInitiation(): Promise<void> {
    let response = await this.shareholderRepository.fetchAllForCompany(this.companyId.value)
    this.shareholders.value = response.map((s: any) => {
      return new Shareholder(s)
    })

    let promises = this.shareholders.value.map((s: Shareholder) => {
      return s.setRegisteredUser(useUserStore())
    })
    await Promise.all(promises)

    this.signatures.value = this.shareholders.value.map((s: Shareholder) => {
      let idType = s.user?.detail?.identificationType === "passport" ? "Passport" : "K.P."
      let role = `<b>No. ${idType}: ${s.user?.detail?.identification ?? ""}</b>`

      if (s.type === "representative" && s.company !== null) {
        let shareholderCompany = new Company(s.company)
        let companyDetails = shareholderCompany.getFullName()
        if (!StringUtil.isNullOrEmpty(shareholderCompany.registrationNumberOld)) {
          companyDetails = `${shareholderCompany.getFullName() ?? ""} (${shareholderCompany.registrationNumberOld})`
        }

        role = `Wakil Korporat<br><b>${companyDetails.toUpperCase()}</b><br>${role}`
      }

      return new SignatureItem(
        this.signatureFile(s.email),
        this.hasSigned(s.email),
        false,
        s.email !== this.currentUser.email,
        s.name,
        s.email,
        role
      )
    })
  }

  setContent(): void {
    // nothing
  }

  getContent(): string {
    return ""
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 1
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  onAuthorisedPersonChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.applicationDetails.authorisedPerson = this.authorisedPerson.value
  }

  handleEnlargedSignaturePad(isEnlarged: any): void {
    if (isEnlarged) {
      document.body.classList.add("no-scroll")
    } else {
      document.body.classList.remove("no-scroll")
    }
  }

  get documentDate(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return "TARIKH RESOLUSI"
    }

    if (StringUtil.isNullOrEmpty(this.application.value.applicationDetails.documentDate)) {
      let dayjs = useDayjs()
      let date = dayjs().format("YYYY-MM-DD")
      return StringUtil.fullDateInBm(date)
    }

    return StringUtil.fullDateInBm(this.application.value.applicationDetails.documentDate)
  }

  get companyAddress(): string {
    if (!this.application.value?.company) {
      return ""
    }

    return this.application.value.company.getOnelineAddress()
  }

  get authorisedPersonName(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return "ORANG DIBERI KUASA"
    }

    return this.application.value.applicationDetails.authorisedPerson
  }

  get cosecCertification(): SignatureItem {
    return new SignatureItem(null, false, false, false, "Pengesahan Setiausaha Syarikat", "", "")
  }
}
