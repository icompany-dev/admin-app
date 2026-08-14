import { Company } from "~/scripts/models/Company"
import { CompanyStrikingOffResolution } from "~/scripts/models/CompanyStrikingOffResolution"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyStrikingOffApplication } from "~/scripts/models/CompanyStrikingOffApplication"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import SsmInformation from "~/scripts/constants/SsmInformation"
import { CompanyStrikingOffRequirement } from "~/scripts/models/CompanyStrikingOffRequirement"
import { ObjectUtil } from "~/scripts/utils/Object"
import { StatusConstants } from "~/scripts/constants/Status"
import type { RefSymbol } from "@vue/reactivity"

export class StrikingOffSupportingLetterController {
  companyId: Ref<string> = ref<string>("")
  company = ref(new Company())
  application = ref(new CompanyStrikingOffApplication())
  requirement = ref<CompanyStrikingOffRequirement>(new CompanyStrikingOffRequirement())
  // checklist = ref(new CompanyStrikingOffChecklist())

  isLoading: Ref<boolean> = ref<boolean>(false)

  content: Ref<number[]> = ref<number[]>([])

  applicantSignatureItem = ref<SignatureItem>(new SignatureItem(null, false, true, false, "", "", "", false))

  emitEvents: any = null

  currentUser = ref<User>(new User())

  selectedSSMBranchId: Ref<string> = ref<string>("")
  ssmAddressList: any[] = SsmInformation.ADDRESS_LIST

  ssmName: string = "SURUHANJAYA SYARIKAT MALAYSIA"
  ssmAddress: any = SsmInformation.ADDRESS_LIST[0]

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
      await Promise.all([this.fetchCompany(), this.fetchApplication(), this.fetchRequirement()])

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
      this.application.value = new CompanyStrikingOffApplication(resolution.application)
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
      this.application.value = new CompanyStrikingOffApplication()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
    }
  }

  async fetchRequirement(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useCompanyStrikingOffRequirementStore()
    let response = await repository.ongoing(this.companyId.value)
    //Note: Backend returns this as array
    if (response && Array.isArray(response) && response.length > 0) {
      let formatted: CompanyStrikingOffRequirement[] = response.map((d: any) => {
        return new CompanyStrikingOffRequirement(d)
      })
      let sorted = ObjectUtil.sort<CompanyStrikingOffRequirement>(formatted, "createdAt", "desc")
      this.requirement.value = new CompanyStrikingOffRequirement(sorted[0])
    } else {
      this.requirement.value = new CompanyStrikingOffRequirement()
      this.requirement.value.companyId = this.companyId.value
    }
  }

  setSignatureItem() {
    const applicantName = this.application.value.applicant.name ?? "Applicant"

    const applicantEmail = this.application.value.applicant.email ?? ""

    const signatureUrl = this.application.value.signature?.url || null

    this.applicantSignatureItem.value = new SignatureItem(
      signatureUrl,
      signatureUrl !== null,
      !signatureUrl && applicantEmail === this.currentUser.value.email,
      false,
      applicantName,
      applicantEmail,
      "Applicant",
      false
    )
  }

  onClickNoOutstandingAssetsLiabilities(): void {
    this.requirement.value.hasNoAssetsLiabilities = !this.requirement.value.hasNoAssetsLiabilities
    this.requirement.value.noOutstandingCharges = !this.requirement.value.noOutstandingCharges
    this.requirement.value.noOutstandingAnnualCompliance = !this.requirement.value.noOutstandingAnnualCompliance
    this.requirement.value.noOutstandingCompound = !this.requirement.value.noOutstandingCompound
    this.requirement.value.noOutstandingTax = !this.requirement.value.noOutstandingTax
  }

  hasOutstandingAssetsLiabilities(): boolean {
    return (
      !this.requirement.value.hasNoAssetsLiabilities &&
      !this.requirement.value.noOutstandingCharges &&
      !this.requirement.value.noOutstandingAnnualCompliance &&
      !this.requirement.value.noOutstandingCompound &&
      !this.requirement.value.noOutstandingTax
    )
  }

  getApplicationData(): CompanyStrikingOffRequirement {
    return new CompanyStrikingOffRequirement(this.requirement.value)
  }

  async refreshData(): Promise<void> {
    await this.fetchApplication()
    this.setSignatureItem()
  }

  signatureDate(): string {
    let time = useLocalTime()

    if (!this.application.value.signature) {
      return `Date of Signature`
    }

    return time.formatDateOnlyFull(this.application.value.signature.createdAt ?? "")
  }

  lastOperationDate(): string {
    if (!this.requirement.value.isNotOperating) {
      return "last date of operation"
    }

    let time = useLocalTime()

    if (!this.requirement.value.lastDateOfOperation) {
      return "last date of operation"
    }

    return time.formatDateOnlyFull(this.requirement.value.lastDateOfOperation)
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
    return "Supporting Letter"
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
