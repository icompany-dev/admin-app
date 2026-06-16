import { CompanyMeetingAcknowledgement } from "~/scripts/models/CompanyMeetingAcknowledgement"
import { Shareholder } from "~/scripts/models/Shareholder"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { User } from "~/scripts/models/User"
import { StringUtil } from "~/scripts/utils/String"

export class AcknowledgeSpecialNoticeController {
  meetingId: Ref<string> = ref<string>("")

  companyId: Ref<string> = ref<string>("")
  user: Ref<User> = ref<User>(new User())
  shareholder: Ref<Shareholder> = ref<Shareholder>(new Shareholder())

  application: Ref<CompanyMeetingAcknowledgement> = ref<CompanyMeetingAcknowledgement>(
    new CompanyMeetingAcknowledgement()
  )

  emitEvents: any | null = null

  documentRef: any | null = null

  signatureFile: Ref<string> = ref<string>("")

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(meetingId: string, companyId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.meetingId.value = meetingId
    this.companyId.value = companyId

    this.init()
  }

  async init(): Promise<void> {
    await this.fetchShareholders()
  }

  setMeetingId(meetingId: string): void {
    this.meetingId.value = meetingId
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    await this.fetchShareholders()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async fetchShareholders(): Promise<void> {
    let repository = useShareholderStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)
    if (repository.error !== null) {
      throw repository.error
    }

    let shareholders = response.map((d: any) => {
      return new Shareholder(d)
    })

    let matchedShareholder = shareholders.find((s: Shareholder) => {
      return s.email === this.user.value.email
    })

    this.shareholder.value = new Shareholder(matchedShareholder)
  }

  async onSigned(signatureFile: string): Promise<void> {
    this.signatureFile.value = signatureFile

    await this.onSubmit()
  }

  async submitSignature(): Promise<void> {
    if (!this.isAShareholder || StringUtil.isNullOrEmpty(this.signatureFile.value)) {
      return
    }

    let dayjs = useDayjs()
    let signatureDate = dayjs().format("YYYY-MM-DD")
    let signatureGroup = new SignatureGroup()
    let file = await signatureGroup.uploadSignatureFile(this.signatureFile.value, useFileStore(), signatureDate)

    this.application.value.signatureId = file.id
  }

  async onSubmit(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    let applicationData = this.documentRef.getApplication()
    this.application.value = new CompanyMeetingAcknowledgement(applicationData)

    this.emitEvents("isUpdating")

    await this.submitSignature()
    await this.onCreate()

    if (this.application.value.isAppointingAProxy && !this.application.value.isForThisMeetingOnly) {
      // must make payment
    }

    this.emitEvents("isUpdated")
    this.emitEvents("back")
  }

  async onCreate(): Promise<void> {
    await this.application.value.create(useCompanyMeetingAcknowledgementStore())
  }

  get isAShareholder(): boolean {
    return StringUtil.isNullOrEmpty(this.shareholder.value.id)
  }
}
