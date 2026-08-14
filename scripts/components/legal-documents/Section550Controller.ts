import { Company } from "~/scripts/models/Company"
import { CompanyStrikingOffResolution } from "~/scripts/models/CompanyStrikingOffResolution"
import { Location } from "~/scripts/models/Location"
import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import { useUserStore } from "~/stores/Users"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { StringUtil } from "~/scripts/utils/String"
import { Director } from "~/scripts/models/Director"
import { Shareholder } from "~/scripts/models/Shareholder"
import { CompanyStrikingOffApplication } from "~/scripts/models/CompanyStrikingOffApplication"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { File } from "~/scripts/models/File"
import { StatusConstants } from "~/scripts/constants/Status"

export class Section550Controller {
  companyId: Ref<string> = ref<string>("")
  company = ref(new Company())
  application = ref(new CompanyStrikingOffApplication())

  isLoading: Ref<boolean> = ref<boolean>(false)

  selectedSecretaryName = ref(SecretaryInformation.SECRETARY_NAME_LIST[0]?.name || "")

  shareholders = ref<Shareholder[]>([])
  directors = ref<Director[]>([])

  applicantSignatureItem = ref<SignatureItem>(new SignatureItem(null, false, true, false, "", "", "", false))

  emitEvents: any = null

  currentUser = ref<User>(new User())

  paperOrientation: string = PaperOrientation.Portrait

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
      await Promise.all([this.fetchCompany(), this.fetchApplication(), this.fetchDirectors(), this.fetchShareholders()])

      this.setApplicantRole()
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
      await this.fetchApplicantResidentialAddress()
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

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useDirectorStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)
    this.directors.value = response.map((d: any) => {
      return new Director(d)
    })
  }

  async fetchShareholders(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useShareholderStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)
    this.shareholders.value = response.map((d: any) => {
      return new Shareholder(d)
    })
  }

  async fetchApplicantResidentialAddress() {
    if (StringUtil.isNullOrEmpty(this.application.value.applicant.id)) {
      this.application.value.applicantResidentialAddress = ""
      return
    }

    let repository = useUserStore()
    const userResponse = await repository.fetch(this.application.value.applicant.id)
    if (userResponse && userResponse.detail && userResponse.detail.location) {
      let addressLocation = new Location(userResponse.detail.location)
      this.application.value.applicantResidentialAddress = addressLocation.getOnelineAddress()
    }
  }

  setApplicantRole() {
    const isDirector = this.directors.value.some((d) => {
      return d.email === this.application.value.applicant.email
    })
    const isShareholder = this.shareholders.value.some((s) => {
      return s.email === this.application.value.applicant.email
    })

    if (isDirector && isShareholder) {
      this.application.value.applicantRole = "director-shareholder"
    } else if (isDirector) {
      this.application.value.applicantRole = "director"
    } else if (isShareholder) {
      this.application.value.applicantRole = "shareholder"
    } else {
      this.application.value.applicantRole = ""
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

  signatureDate(): string {
    let time = useLocalTime()

    if (!this.application.value.signature) {
      return `Date of Signature`
    }

    return time.formatDateOnlyFull(this.application.value.signature.createdAt ?? "")
  }

  async refreshData(): Promise<void> {
    await this.fetchApplication()
    this.setSignatureItem()
  }

  getApplicationData(): CompanyStrikingOffApplication {
    return new CompanyStrikingOffApplication(this.application.value)
  }

  isDocumentEditable(): boolean {
    return StringUtil.isNullOrEmpty(this.application.value.signatureId) && this.hasPaid
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
    return "Section 550"
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
