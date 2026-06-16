import { Company } from "~/scripts/models/Company"
import { CompanyStrikingOffChecklist } from "~/scripts/models/CompanyStrikingOffChecklist"
import { CompanyStrikingOffResolution } from "~/scripts/models/CompanyStrikingOffResolution"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { StringUtil } from "~/scripts/utils/String"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { StatusConstants } from "~/scripts/constants/Status"

export class StrikingOffChecklistController {
  companyId: Ref<string> = ref<string>("")
  company = ref<Company>(new Company())
  application = ref<CompanyStrikingOffChecklist>(new CompanyStrikingOffChecklist())

  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, true, false, "", "", "", false))

  currentUser = ref<User>(new User())

  isLoading: Ref<boolean> = ref<boolean>(false)

  emitEvents: any = null

  constructor(companyId: string, emitEvents: any = null) {
    this.emitEvents = emitEvents
    this.init(companyId)
  }

  async init(companyId: string): Promise<void> {
    await Promise.all([this.setUser(), this.setCompanyId(companyId)])
  }

  async setUser(): Promise<void> {
    this.currentUser.value = await CurrentUser.get()
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true
      await Promise.all([this.fetchCompany(), this.fetchApplication()])

      this.setSignatureItem()
    } catch (e) {
      // do what?
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchCompany(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useCompanyStore()
    let response = await repository.fetch(this.companyId.value)
    this.company.value = new Company(response)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useCompanyStrikingOffResolutionStore()
    let response = await repository.ongoing(this.companyId.value)

    if (response) {
      let resolution = new CompanyStrikingOffResolution(response)
      this.application.value = new CompanyStrikingOffChecklist(resolution.checklist)
    } else {
      await this.setApplication()
    }
  }

  async setApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useCompanyStore()
    let response = await repository.fetch(this.companyId.value)
    if (response) {
      this.application.value = new CompanyStrikingOffChecklist()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
    }
  }

  setSignatureItem() {
    const list = this.application.value
    const signatureUrl = list.signature?.url ?? null
    const applicantName = list.applicantName || "Applicant"
    const applicantEmail = list.applicant?.email || ""

    this.signatureItem.value = new SignatureItem(
      signatureUrl,
      signatureUrl !== null,
      signatureUrl === null && applicantEmail === this.currentUser.value.email,
      false,
      applicantName,
      applicantEmail,
      "Applicant",
      false
    )
  }

  onSigned(signatureFile: string) {
    this.signatureItem.value.signatureUrl = signatureFile
    this.signatureItem.value.hasSigned = true

    if (this.emitEvents) {
      this.emitEvents("signed", { type: "checklist", file: signatureFile })
    }
  }

  signatureDate(): string {
    if (!this.application.value.signature) {
      return "Date of Signature"
    }

    let time = useLocalTime()

    return time.formatDateOnlyFull(this.application.value.signature.createdAt ?? "")
  }

  async refreshData(): Promise<void> {
    await this.fetchApplication()
    this.setSignatureItem()
  }

  registrationNumberNew(): string {
    return this.company.value.registrationNumberNew ?? ""
  }

  registrationNumberOld(): string {
    return this.company.value.registrationNumberOld ?? ""
  }

  companyName(): string {
    return this.company.value.getFullName() ?? ""
  }

  loaderLabel(): string {
    return "Preparing Your"
  }

  loaderSublabel(): string {
    return "Checklist"
  }

  getApplicationData(): CompanyStrikingOffChecklist {
    return new CompanyStrikingOffChecklist(this.application.value)
  }

  isDocumentEditable(): boolean {
    return StringUtil.isNullOrEmpty(this.application.value.signatureId) && this.hasPaid
  }

  get hasPaid(): boolean {
    return (
      this.application.value.status !== null &&
      this.application.value.status !== undefined &&
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING
    )
  }

  get showWatermark(): boolean {
    return !this.isDocumentEditable()
  }

  get watermarkText(): string {
    if (!this.showWatermark) {
      return ""
    }

    return this.hasPaid ? "DRAFT" : "PREVIEW"
  }
}
