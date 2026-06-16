import { PaperOrientation } from "~/scripts/constants/Paper"
import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { CompanyMeetingAcknowledgement } from "~/scripts/models/CompanyMeetingAcknowledgement"
import { Shareholder } from "~/scripts/models/Shareholder"
import { User } from "~/scripts/models/User"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { StringUtil } from "~/scripts/utils/String"

export class SpecialNoticeEgmAcknowledgementController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())

  meetingId: Ref<string> = ref<string>("")
  applicationId: Ref<string> = ref<string>("")
  application: Ref<CompanyMeetingAcknowledgement> = ref<CompanyMeetingAcknowledgement>(
    new CompanyMeetingAcknowledgement()
  )

  currentUser: Ref<User> = ref<User>(new User())
  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])

  emitEvents: any | null = null

  addititionalClassCss: string = "special-notice-acknowledgement"
  paperOrientation: string = PaperOrientation.Portrait

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, meetingId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.companyId.value = companyId
    this.meetingId.value = meetingId
    this.init()
  }

  async init(): Promise<void> {
    try {
      this.isLoading.value = true

      this.currentUser.value = await CurrentUser.get()
      await Promise.all([this.fetchCompany(), this.fetchShareholders()])

      await this.fetchApplication()
      if (StringUtil.isNullOrEmpty(this.application.value.id)) {
        this.setApplication()
      }
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    try {
      this.isLoading.value = true

      await Promise.all([this.fetchCompany(), this.fetchShareholders()])

      await this.fetchApplication()
      if (StringUtil.isNullOrEmpty(this.application.value.id)) {
        this.setApplication()
      }
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForFetch()
        error.handle()
      }
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
    if (repository.error !== null) {
      throw repository.error
    }

    this.company.value = new Company(response)
  }

  async fetchShareholders(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useShareholderStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)
    if (repository.error) {
      throw repository.error
    }

    this.shareholders.value = response.map((s: Shareholder) => {
      return new Shareholder(s)
    })
  }

  async setMeetingId(meetingId: string): Promise<void> {
    this.meetingId.value = meetingId

    if (StringUtil.isNullOrEmpty(this.meetingId.value)) {
      this.setApplication()
    } else {
      await this.fetchApplication()
      if (StringUtil.isNullOrEmpty(this.application.value.id)) {
        this.setApplication()
      }
    }
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.meetingId.value)) {
      return
    }

    let repository = useCompanyMeetingAcknowledgementStore()
    let response = await repository.fetchByMeetingIdShareholderId(this.meetingId.value, this.shareholder.id)
    if (repository.error !== null) {
      throw repository.error
    }

    this.application.value = new CompanyMeetingAcknowledgement(response)
  }

  setApplication(): void {
    this.application.value = new CompanyMeetingAcknowledgement()
    this.application.value.companyMeetingId = this.meetingId.value
    this.application.value.shareholderId = this.shareholder.id
    this.application.value.nameOfShareholder = this.nameOfShareholder
  }

  onIsAcknowledingOnlyClicked(): void {
    this.application.value.isAcknowledgingOnly = true
    this.application.value.isAttendingInPerson = false
    this.application.value.isAppointingAProxy = false
  }

  onIsAttendingInPersonClicked(): void {
    this.application.value.isAcknowledgingOnly = false
    this.application.value.isAttendingInPerson = true
    this.application.value.isAppointingAProxy = false
  }

  onIsAppointingAProxyClicked(): void {
    this.application.value.isAcknowledgingOnly = false
    this.application.value.isAttendingInPerson = false
    this.application.value.isAppointingAProxy = true
  }

  onAttendPersonally(): void {
    this.application.value.isAttendingAsCorporateRep = false
  }

  onAttendByCorporateRepresentative(): void {
    this.application.value.isAttendingAsCorporateRep = true
  }

  onIsForThisMeetingOnlyClicked(): void {
    this.application.value.isForThisMeetingOnly = true
  }

  onIsSaveForFutureClicked(): void {
    this.application.value.isForThisMeetingOnly = false
  }

  onIsUnderConstitutionClicked(): void {
    this.application.value.isUnderConstitution = true
  }

  onIsUnanimousAgreementClicked(): void {
    this.application.value.isUnderConstitution = false
  }

  getApplication(): CompanyMeetingAcknowledgement {
    return this.application.value
  }

  get totalPages(): number {
    if (this.isLoading.value) {
      return 1
    }

    return this.application.value.isAppointingAProxy ? 2 : 1
  }

  get loaderLabel(): string {
    return "Preparing Your"
  }

  get loaderSublabel(): string {
    return "Acknowledgement"
  }

  get shareholder(): Shareholder {
    if (this.shareholders.value.length <= 0) {
      return new Shareholder()
    }

    let matchedShareholder = this.shareholders.value.find((s: Shareholder) => {
      return s.email === this.currentUser.value.email
    })

    if (matchedShareholder) {
      return matchedShareholder
    }

    return this.shareholders.value[0]
  }

  get isDocumentEditable(): boolean {
    return StringUtil.isNullOrEmpty(this.application.value.signatureId)
  }

  get iOrWe(): string {
    return this.shareholder.isCorporateRepresentative() ? "we" : "I"
  }

  get nameOfShareholder(): string {
    return this.shareholder.fullName()
  }

  get amOrAre(): string {
    return this.shareholder.isCorporateRepresentative() ? "are" : "am"
  }

  get myOrOur(): string {
    return this.shareholder.isCorporateRepresentative() ? "our" : "my"
  }

  get isAnyOptionSelected(): boolean {
    return (
      this.application.value.isAcknowledgingOnly ||
      this.application.value.isAttendingInPerson ||
      this.application.value.isAppointingAProxy
    )
  }

  get hasSigned(): boolean {
    return this.application.value.signatureFile !== null
  }

  get signatureDate(): string {
    if (!this.application.value.signatureFile) {
      return "Date when you affix your signature"
    }

    let time = useLocalTime()

    return time.formatDateOnlyFull(this.application.value.signatureFile.createdAt ?? "")
  }

  get isSignatureEditable(): boolean {
    if (!this.isDocumentEditable) {
      return false
    }

    if (!this.isAnyOptionSelected) {
      return false
    }

    let isSignatureEditable =
      this.application.value.signatureFile === null &&
      this.isDocumentEditable &&
      this.shareholder.email === this.currentUser.value.email

    return isSignatureEditable
  }

  get signatureItem(): SignatureItem {
    return new SignatureItem(
      this.application.value.signatureFile?.url ?? null,
      this.application.value.signatureFile !== null,
      this.isSignatureEditable,
      false,
      "",
      "",
      "",
      false
    )
  }
}
