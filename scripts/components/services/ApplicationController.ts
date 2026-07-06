import { StatusConstants } from "~/scripts/constants/Status"
import { Error } from "~/scripts/library/Error"
import { UploadedDocumentChecker } from "~/scripts/library/UploadedDocumentChecker"
import { Application } from "~/scripts/models/Application"
import { Director } from "~/scripts/models/Director"
import type { IRepositoryStore } from "~/scripts/models/IRepositoryStore"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { Shareholder } from "~/scripts/models/Shareholder"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { PropsServiceApplication } from "~/scripts/props/PropsServiceApplication"
import { PropsShipApplication } from "~/scripts/props/PropsShipApplication"
import { ObjectUtil } from "~/scripts/utils/Object"
import { StringUtil } from "~/scripts/utils/String"

export abstract class ApplicationController<Application> {
  companyId: Ref<string> = ref<string>("")

  applications = ref<Application[]>([])
  application = ref<Application | null>(null)

  paymentOrderId: Ref<string> = ref<string>("")
  paymentOrder: Ref<PaymentOrder> = ref<PaymentOrder>(new PaymentOrder())

  directors: Ref<Director[]> = ref<Director[]>([])
  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])

  isShowReceipt: Ref<boolean> = ref<boolean>(true)

  isShowApprovalTypeOptions: Ref<boolean> = ref<boolean>(false)
  selectedApprovalType: Ref<string> = ref<string>("director-member")

  uploadedDocumentChecker = ref<UploadedDocumentChecker>(new UploadedDocumentChecker(""))

  minimumMajorityRequired: Ref<number> = ref<number>(0.5)

  repository: IRepositoryStore

  applicationClassType: new (data: any) => Application

  language = useLanguage()
  dayjs = useDayjs()
  time = useLocalTime()

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  target: Ref<string> = ref<string>("")

  shipApplicationRef: any | null = null

  constructor(
    companyId: string,
    repository: IRepositoryStore,
    applicationClassType: new (data: any) => Application,
    target: string,
    emitEvents: any | null
  ) {
    this.repository = repository
    this.applicationClassType = applicationClassType
    this.companyId.value = companyId

    this.application.value = new this.applicationClassType(null)

    this.target.value = target

    this.emitEvents = emitEvents

    this.init()
  }

  async init(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      this.uploadedDocumentChecker.value.companyId = this.companyId.value

      await Promise.all([
        this.fetchOngoing(),
        this.fetchDirectors(),
        this.fetchShareholders(),
        this.uploadedDocumentChecker.value.fetchDocuments(),
      ])

      await this.fetchPaymentOrder()

      this.emitEvents("applicationId", this.application.value.id)
      this.emitEvents("paymentOrderId", this.paymentOrderId.value)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    this.uploadedDocumentChecker.value.companyId = this.companyId.value

    await Promise.all([
      this.fetchOngoing(),
      this.fetchDirectors(),
      this.fetchShareholders(),
      this.uploadedDocumentChecker.value.fetchDocuments(),
    ])

    await this.fetchPaymentOrder()

    this.emitEvents("applicationId", this.application.value.id)
    this.emitEvents("paymentOrderId", this.paymentOrderId.value)
  }

  setShipApplicationRef(shipApplicationRef: any): void {
    this.shipApplicationRef = shipApplicationRef
  }

  async fetchOngoing(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      this.application.value = new this.applicationClassType(null)
      return
    }

    let response = await this.repository.latestApplication(this.companyId.value)
    if (this.repository.error !== null) {
      throw this.repository.error
    }

    this.application.value = new this.applicationClassType(response)
  }

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      this.directors.value = []
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
      this.shareholders.value = []
      return
    }

    let repository = useShareholderStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)

    this.shareholders.value = response.map((d: any) => {
      return new Shareholder(d)
    })
  }

  async fetchPaymentOrder(): Promise<void> {
    if (!this.hasApplication) {
      this.paymentOrderId.value = ""
      return
    }

    let repository = usePaymentOrderStore()
    let response = await repository.fetchByTarget(this.target.value, this.application?.value.id)

    if (!response || repository.error !== null) {
      this.paymentOrderId.value = ""
      return
    }

    this.paymentOrder.value = new PaymentOrder(response)
    this.paymentOrderId.value = this.paymentOrder.value.id

    this.emitEvents("paymentOrder", this.paymentOrder.value)
  }

  onApprovalTypeClicked(): void {
    this.isShowApprovalTypeOptions.value = !this.isShowApprovalTypeOptions.value
  }

  onApprovalTypeSelected(type: string): void {
    this.selectedApprovalType.value = type
    this.isShowApprovalTypeOptions.value = false
  }

  async onProceedShipped(): Promise<void> {
    await this.fetchOngoing()
  }

  // getters
  abstract get serviceName(): string

  get hasApplication(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.application.value.id) &&
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING
    )
  }

  get serviceApplicationProps(): PropsServiceApplication {
    let props = new PropsServiceApplication(this.serviceName, this.hasApplication, this.isShowReceipt.value)

    props.application = this.application.value

    return props
  }

  get hasPaid(): boolean {
    return (
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING
    )
  }

  get isSigned(): boolean {
    return this.application.value !== null && this.application.value.signatureGroups.length > 0
  }

  get lastSignatureDate(): string {
    if (!this.application.value || !this.isSigned) {
      return this.language.isMalay() ? "Tiada Tandatangan" : "No Signature Received"
    }

    let orderedSignatureGroups = ObjectUtil.sort<SignatureGroup>(
      this.application.value.signatureGroups,
      "createdAt",
      "desc"
    )

    let firstSignature = orderedSignatureGroups[0]

    return this.time.formatDateOnlyFull(firstSignature.createdAt ?? "")
  }

  get firstSignatureDate(): string {
    if (!this.application.value || !this.isSigned) {
      return this.language.isMalay() ? "Tiada Tandatangan" : "No Signature Received"
    }

    let orderedSignatureGroups = ObjectUtil.sort<SignatureGroup>(
      this.application.value.signatureGroups,
      "createdAt",
      "asc"
    )

    let firstSignature = orderedSignatureGroups[0]

    return this.time.formatDateOnlyFull(firstSignature.createdAt ?? "")
  }

  get directorSignatures(): SignatureGroup[] {
    return this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "director" || sg.group?.target === "director_invitation"
    })
  }

  get firstDirectorSignatureDate(): string {
    if (!this.application.value || !this.isSigned) {
      return this.language.isMalay() ? "Tiada Tandatangan" : "No Signature Received"
    }

    if (this.directorSignatures.length <= 0) {
      return this.language.isMalay() ? "Tiada Tandatangan" : "No Signature Received"
    }

    let orderedSignatureGroups = ObjectUtil.sort<SignatureGroup>(this.directorSignatures, "createdAt", "asc")

    let firstSignature = orderedSignatureGroups[0]

    return this.time.formatDateOnlyFull(firstSignature.createdAt ?? "")
  }

  get lastDirectorSignatureDate(): string {
    if (!this.application.value || !this.isSigned) {
      return this.language.isMalay() ? "Tiada Tandatangan" : "No Signature Received"
    }

    if (this.directorSignatures.length <= 0) {
      return this.language.isMalay() ? "Tiada Tandatangan" : "No Signature Received"
    }

    let orderedSignatureGroups = ObjectUtil.sort<SignatureGroup>(this.directorSignatures, "createdAt", "desc")

    let firstSignature = orderedSignatureGroups[0]

    return this.time.formatDateOnlyFull(firstSignature.createdAt ?? "")
  }

  get isDirectorSignatureCompleted(): boolean {
    let numberOfSignatures = this.directorSignatures.length

    return numberOfSignatures > this.minimumMajorityRequired.value * this.directors.value.length
  }

  get shareholderSignatures(): SignatureGroup[] {
    return this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "shareholder" || sg.group?.target === "shareholder_invitation"
    })
  }

  get firstshareholderSignatureDate(): string {
    if (!this.application.value || !this.isSigned) {
      return this.language.isMalay() ? "Tiada Tandatangan" : "No Signature Received"
    }

    if (this.shareholderSignatures.length <= 0) {
      return this.language.isMalay() ? "Tiada Tandatangan" : "No Signature Received"
    }

    let orderedSignatureGroups = ObjectUtil.sort<SignatureGroup>(this.shareholderSignatures, "createdAt", "asc")

    let firstSignature = orderedSignatureGroups[0]

    return this.time.formatDateOnlyFull(firstSignature.createdAt ?? "")
  }

  get lastshareholderSignatureDate(): string {
    if (!this.application.value || !this.isSigned) {
      return this.language.isMalay() ? "Tiada Tandatangan" : "No Signature Received"
    }

    if (this.shareholderSignatures.length <= 0) {
      return this.language.isMalay() ? "Tiada Tandatangan" : "No Signature Received"
    }

    let orderedSignatureGroups = ObjectUtil.sort<SignatureGroup>(this.shareholderSignatures, "createdAt", "desc")

    let firstSignature = orderedSignatureGroups[0]

    return this.time.formatDateOnlyFull(firstSignature.createdAt ?? "")
  }

  get isShareholderSignatureCompleted(): boolean {
    return this.totalSignedShares > this.minimumMajorityRequired.value * this.totalShares
  }

  get totalSignedShares(): number {
    return this.shareholders.value
      .filter((s: Shareholder) => {
        if (!this.application.value) {
          return false
        }

        return this.shareholderSignatures.some((sg: SignatureGroup) => {
          return sg.email === s.email
        })
      })
      .map((s: Shareholder) => {
        return Number(s.ordinaryShares) + Number(s.preferenceShares)
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)
  }

  get totalShares(): number {
    return this.shareholders.value
      .map((s: Shareholder) => {
        return Number(s.ordinaryShares) + Number(s.preferenceShares)
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)
  }

  get isApprovalReceived(): boolean {
    if (this.selectedApprovalType.value === "director") {
      return this.isDirectorSignatureCompleted
    }

    if (this.selectedApprovalType.value === "member") {
      return this.isShareholderSignatureCompleted
    }

    return this.isShareholderSignatureCompleted
  }

  get approvalDate(): string {
    if (!this.isApprovalReceived) {
      return this.language.isMalay() ? "Menunggu Persetujuan" : "Pending Approval"
    }

    if (this.selectedApprovalType.value === "director") {
      return this.lastDirectorSignatureDate
    }

    if (this.selectedApprovalType.value === "member") {
      return this.lastshareholderSignatureDate
    }

    return this.lastshareholderSignatureDate
  }

  get completedLabel(): string {
    return this.language.isMalay() ? "Selesai" : "Completed"
  }

  get latestSignatureLabel(): string {
    return this.language.isMalay() ? "Tarikh Tandatangan Terakhir" : "Last Signature Received"
  }

  get pendingApproval(): string {
    return this.language.isMalay() ? "Menunggu Persetujuan" : "Pending Approval"
  }

  get concluded(): string {
    return this.language.isMalay() ? "Selesai" : "Concluded"
  }

  get reject(): string {
    return this.language.isMalay() ? "Tolak" : "Reject"
  }

  get paid(): string {
    return this.language.isMalay() ? "Telah Dibayar" : "Paid"
  }

  get shipApplicationProps(): PropsShipApplication {
    return new PropsShipApplication(this.application.value, this.target.value, this.repository)
  }
}
