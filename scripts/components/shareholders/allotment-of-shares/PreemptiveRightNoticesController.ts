import { CompanyShareIssuance } from "~/scripts/models/CompanyShareIssuance"
import { User } from "~/scripts/models/User"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { Shareholder } from "~/scripts/models/Shareholder"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { CompanyShareIssuanceResponse } from "~/scripts/models/CompanyShareIssuanceResponse"
import { Director } from "~/scripts/models/Director"
import { File } from "~/scripts/models/File"
import { Toast } from "~/scripts/library/Toast"

export class PreemptiveRightNoticesController {
  companyId: Ref<string> = ref<string>("")
  applicationId: Ref<string> = ref<string>("")
  application = ref<CompanyShareIssuance>(new CompanyShareIssuance())

  initiatorSignatureFile: Ref<string> = ref<string>("")
  signatureFile: Ref<string> = ref<string>("")

  user = ref<User>(new User())

  language = useLanguage()

  shareholders = ref<Shareholder[]>([])
  directors = ref<Director[]>([])

  isADirector = ref<boolean>(false)
  isAShareholder = ref<boolean>(false)

  isLoading: Ref<boolean> = ref<boolean>(true)

  isInitiatorADirector = ref<boolean>(false)
  isInitiatorAShareholder = ref<boolean>(false)

  initiatorSignatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", true))
  signatureItems = ref<SignatureItem[]>([])

  noticeResponses = ref<CompanyShareIssuanceResponse[]>([])

  emitEvents: any | null = null

  currentPage: Ref<number> = ref<number>(1)

  signatureItemInFocus = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", true))
  noticeResponseInFocus = ref<CompanyShareIssuanceResponse>(new CompanyShareIssuanceResponse())

  isInPreviewMode: Ref<boolean> = ref<boolean>(false)
  isSubmitting: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, applicationId: string, isInPreviewMode: boolean, emitEvents: any | null) {
    this.emitEvents = emitEvents
    this.setIsInPreviewMode(isInPreviewMode)
    this.init(companyId, applicationId)
  }

  async init(companyId: string, applicationId: string): Promise<void> {
    this.user.value = await CurrentUser.get()
    await this.setCompanyId(companyId)
    await this.setApplicationId(applicationId)
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    await Promise.all([this.fetchShareholders(), this.fetchDirectors()])

    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      this.application.value.companyId = this.companyId.value
    }

    this.setInitiatorValues()
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId.value = applicationId
    await this.fetchApplication()
    this.setInitiatorValues()
    this.setResponseSignatureItems()
  }

  async refreshData(): Promise<void> {
    await this.fetchApplication()
    this.setInitiatorValues()
    this.setResponseSignatureItems()
  }

  setInitiatorValues(): void {
    if (StringUtil.isNullOrEmpty(this.application.value.initiator.id)) {
      return
    }

    let initiatorEmail = this.application.value.initiator.email
    this.isInitiatorADirector.value = this.directors.value.some((d: Director) => {
      return d.email === initiatorEmail
    })

    this.isInitiatorAShareholder.value = this.shareholders.value.some((s: Shareholder) => {
      return s.email === initiatorEmail
    })
  }

  setIsInPreviewMode(isInPreviewMode: boolean): void {
    this.isInPreviewMode.value = isInPreviewMode

    this.setResponseSignatureItems()
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      this.application.value = new CompanyShareIssuance()
      this.application.value.companyId = this.companyId.value
      return
    }

    this.isLoading.value = true
    try {
      let repository = useCompanyShareIssuanceStore()
      let response = await repository.fetch(this.applicationId.value)
      if (repository.error !== null) {
        throw repository.error
      }

      this.application.value = new CompanyShareIssuance(response)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchShareholders(): Promise<void> {
    try {
      this.shareholders.value = []

      let repository = useShareholderStore()
      let response = await repository.fetchAllForCompany(this.companyId.value)
      if (repository.error !== null) {
        throw repository.error
      }

      this.shareholders.value = response.map((s: any) => {
        return new Shareholder(s)
      })

      this.isAShareholder.value = this.shareholders.value.some((s: Shareholder) => {
        return s.email === this.user.value.email
      })
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    }
  }

  async fetchDirectors(): Promise<void> {
    try {
      this.directors.value = []

      let repository = useDirectorStore()
      let response = await repository.fetchAllForCompany(this.companyId.value)
      if (repository.error !== null) {
        throw repository.error
      }

      this.directors.value = response.map((s: any) => {
        return new Director(s)
      })

      this.isADirector.value = this.directors.value.some((s: Director) => {
        return s.email === this.user.value.email
      })
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    }
  }

  setResponseSignatureItems(): void {
    if (StringUtil.isNullOrEmpty(this.application.value.initiator.id)) {
      let roles = []
      if (this.isADirector.value) {
        roles.push("Director")
      }

      if (this.isAShareholder.value) {
        roles.push("Member")
      }

      let role = roles.join(" & ")
      if (role.length <= 0) {
        role = "Officer"
      }

      this.initiatorSignatureItem.value = new SignatureItem(
        null,
        false,
        true,
        false,
        this.user.value.name,
        this.user.value.email,
        role,
        false
      )
    } else {
      let initiatorSignature =
        this.application.value.signatureGroups.length > 0
          ? (this.application.value.signatureGroups.find((sg: SignatureGroup) => {
              return sg.email === this.application.value.initiator.email
            }) ?? null)
          : null
      let signatureUrl = initiatorSignature?.signature?.url ?? null

      let roles = []
      if (this.isInitiatorADirector.value) {
        roles.push("Director")
      }

      if (this.isInitiatorAShareholder.value) {
        roles.push("Member")
      }

      let role = roles.join(" & ")
      if (role.length <= 0) {
        role = "Officer"
      }

      let isSignatureEditable =
        signatureUrl === null && this.application.value.initiator.email === this.user.value.email

      this.initiatorSignatureItem.value = new SignatureItem(
        signatureUrl,
        signatureUrl !== null,
        isSignatureEditable,
        false,
        this.application.value.initiator.name,
        this.application.value.initiator.email,
        role,
        false
      )
    }

    if (this.isInPreviewMode.value) {
      this.initiatorSignatureItem.value.isSignatureEditable = false
    }

    this.signatureItems.value = []
    this.noticeResponses.value = []
    if (this.application.value.responses.length <= 0) {
      this.shareholders.value.forEach((shareholder: Shareholder) => {
        let signatureItem = new SignatureItem(
          null,
          false,
          shareholder.email === this.user.value.email && !this.isInPreviewMode.value,
          shareholder.email !== this.user.value.email,
          shareholder.name,
          shareholder.email,
          "Member",
          false
        )

        this.signatureItems.value.push(signatureItem)

        let noticeResponse = new CompanyShareIssuanceResponse()
        noticeResponse.shareholder = new Shareholder(shareholder)
        this.noticeResponses.value.push(noticeResponse)
      })
    } else {
      this.application.value.responses.forEach((noticeResponse: CompanyShareIssuanceResponse) => {
        let shareholder = noticeResponse.shareholder

        let isSignatureEditable =
          (noticeResponse.responseFile?.url === null || noticeResponse.responseFile?.url === undefined) &&
          shareholder.user?.email === this.user.value.email &&
          !this.isInPreviewMode.value &&
          !this.hasNoticeExpired()

        let signatureItem = new SignatureItem(
          noticeResponse.responseFile?.url ?? null,
          noticeResponse.responseFile !== null,
          isSignatureEditable,
          shareholder.user?.email !== this.user.value.email,
          shareholder.user?.name ?? "",
          shareholder.user?.email ?? "",
          "Member",
          false
        )

        this.signatureItems.value.push(signatureItem)
        this.noticeResponses.value.push(noticeResponse)
      })
    }

    if (this.isAShareholder.value) {
      let signatureItem = this.signatureItems.value.find((si: SignatureItem) => {
        return si.email === this.user.value.email
      })

      this.signatureItemInFocus.value = signatureItem ?? new SignatureItem(null, false, false, false, "", "", "", true)

      let noticeResponse = this.noticeResponses.value.find((nr: CompanyShareIssuanceResponse) => {
        let email = nr.shareholder.user?.email ?? nr.shareholder.email
        return email === this.user.value.email
      })

      this.noticeResponseInFocus.value = noticeResponse ?? new CompanyShareIssuanceResponse()
    } else {
      this.signatureItemInFocus.value =
        this.signatureItems.value[0] ?? new SignatureItem(null, false, false, false, "", "", "", true)
      this.noticeResponseInFocus.value = this.noticeResponses.value[0] ?? new CompanyShareIssuanceResponse()
    }
  }

  hasNoticeExpired(): boolean {
    let dayjs = useDayjs()
    let expiryDate = dayjs(this.application.value.startDate)
      .add(this.application.value.noticePeriod, "days")
      .endOf("day")

    return dayjs().isAfter(expiryDate)
  }

  totalPages(): number {
    return this.noticeResponses.value.length
  }

  goToPage(page: number): void {
    if (page > this.totalPages()) {
      this.currentPage.value = this.totalPages()
      return
    }

    if (page <= 0) {
      this.currentPage.value = 1
      return
    }

    this.currentPage.value = page
  }

  notificationDate(): string {
    return this.application.value.createdAt
  }

  expiryDate(): string {
    let dayjs = useDayjs()

    return dayjs(this.application.value.createdAt).add(this.application.value.noticePeriod, "day").format("YYYY-MM-DD")
  }

  onResponded(noticeResponse: CompanyShareIssuanceResponse): void {
    this.noticeResponseInFocus.value.clone(noticeResponse)
  }

  onInitiatorSigned(signatureFile: string): void {
    this.initiatorSignatureItem.value.signatureUrl = signatureFile
    this.emitEvents("signed", signatureFile)
  }

  async onResponseSigned(signatureFile: string): Promise<void> {
    this.isSubmitting.value = true
    this.signatureItemInFocus.value.signatureUrl = signatureFile

    // Update response
    let signature = new SignatureGroup()
    let dayjs = useDayjs()
    let uploadedFile = await signature.uploadSignatureFile(
      signatureFile,
      useFileStore(),
      dayjs().format("D MMM YYYY - HH:MM:SS")
    )
    this.noticeResponseInFocus.value.responseFile = new File(uploadedFile)
    if (!this.noticeResponseInFocus.value.isWaived) {
      this.noticeResponseInFocus.value.isWaived = false // default to subscribe
    }

    try {
      await this.noticeResponseInFocus.value.respond(useCompanyShareIssuanceStore())
      this.emitEvents("responded")

      let title = this.language.isMalay()
        ? "Terima Kasih! Kami telah terima maklum balas anda."
        : "Thank You! We have received your response."
      let message = this.language.isMalay()
        ? "Permohonan ini akan diteruskan selepas semua Pemegang Saham telah memberi maklum balas atau Notis ini tamat tempoh."
        : "The Application will proceed after all Shareholders have responded or the Notice expires."
      let toast = new Toast(title, message)
      toast.success()
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForCUD()
        errorMessage.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  get loaderLabel(): string {
    return "Preparing Your"
  }

  get loaderSublabel(): string {
    return "Notices"
  }

  get submittingDocumentLabel(): string {
    return this.language.isMalay() ? "Sedang Mengesahkan" : "Confirming"
  }

  get submittingDocumentSublabel(): string {
    return this.language.isMalay() ? "Butiran dan Tandatangan" : "Details and Signatures"
  }
}
