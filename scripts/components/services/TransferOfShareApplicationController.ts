import { ApplicationController } from "./ApplicationController"
import type { IPropsApplication } from "~/scripts/props/PropsApplication"
import { PropsServiceApplicationNode } from "~/scripts/props/PropsServiceApplicationNode"
import { Error } from "~/scripts/library/Error"
import { StatusConstants } from "~/scripts/constants/Status"
import { Toast } from "~/scripts/library/Toast"
import { DocumentTargets } from "~/scripts/constants/DocumentTargets"
import { StringUtil } from "~/scripts/utils/String"
import { ObjectUtil } from "~/scripts/utils/Object"
import { File } from "~/scripts/models/File"
import { PropsUploadDocument } from "~/scripts/props/PropsUploadDocument"
import { CompanyConstants } from "~/scripts/constants/Company"
import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { Bank } from "~/scripts/models/Bank"
import { Filter } from "~/scripts/library/Filter"
import { PaymentOrderItem } from "~/scripts/models/PaymentOrderItem"
import type { PaymentOrderItemMandatory } from "~/scripts/models/PaymentOrderItemMandatory"
import type { PaymentOrderItemOptional } from "~/scripts/models/PaymentOrderItemOptional"
import { NumberUtil } from "~/scripts/utils/Number"
import type { CompanyShareTransferDetail } from "~/scripts/models/CompanyShareTransferDetail"
import { User } from "~/scripts/models/User"
import { PropsUserDetail } from "~/scripts/props/PropsUserDetail"
import { UserDetail } from "~/scripts/models/UserDetail"
import type { CompanyDocument } from "~/scripts/types/CompanyDocument"
import { CompanyPostShareTransfer } from "~/scripts/models/CompanyPostShareTransfer"
import { RegisterOfTransferType } from "~/scripts/constants/Shareholder"

export class TransferOfShareApplicationController extends ApplicationController<CompanyShareholderTransfer> {
  resolutionsRef: any | null = null

  postShareTransferApplication = ref<CompanyPostShareTransfer>(new CompanyPostShareTransfer())

  isShowResolutions: Ref<boolean> = ref<boolean>(false)
  isShowStamping: Ref<boolean> = ref<boolean>(false)
  isShowRegister: Ref<boolean> = ref<boolean>(false)
  isShowShipped: Ref<boolean> = ref<boolean>(false)
  isShowCompleted: Ref<boolean> = ref<boolean>(false)

  isDownloadingSection51: Ref<boolean> = ref<boolean>(false)
  isSubmitting: Ref<boolean> = ref<boolean>(false)
  isCompleting: Ref<boolean> = ref<boolean>(false)

  isStamping: Ref<boolean> = ref<boolean>(false)

  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(
      props.companyId,
      useCompanyShareholderTransferStore(),
      CompanyShareholderTransfer,
      CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES,
      emitEvents,
      props.applicationId
    )

    this.minimumMajorityRequired.value = 0
    this.selectedApprovalType.value = "director" // this is fixed for this service
  }

  setResolutionsRef(resolutionsRef: any): void {
    this.resolutionsRef = resolutionsRef
  }

  override async fetchApplication(): Promise<void> {
    if (!this.applicationId.value || StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let response = await this.repository.fetch(this.applicationId.value)
    if (this.repository.error !== null) {
      throw this.repository.error
    }

    this.application.value = new this.applicationClassType(response)

    let promises = this.application.value.transferDetails
      .filter((td: CompanyShareTransferDetail) => {
        return this.isTransferToNew(td)
      })
      .map((td: CompanyShareTransferDetail) => {
        return td.transferToInvitation?.setUser(useUserStore())
      })

    let postShareTransferRepository = useCompanyPostShareTransferStore()
    let postShareTransferResponse = await postShareTransferRepository.fetchForTransfer(this.applicationId.value)
    if (postShareTransferResponse) {
      this.postShareTransferApplication.value = new CompanyPostShareTransfer(postShareTransferResponse)
    }

    await Promise.allSettled(promises)

    if (StringUtil.isNullOrEmpty(this.uploadedDocumentChecker.value.companyId)) {
      this.uploadedDocumentChecker.value.companyId = this.application.value.companyId
      await this.uploadedDocumentChecker.value.fetchDocuments()
    }
  }

  onPaymentStepClicked(): void {
    this.isShowReceipt.value = true
    this.isShowResolutions.value = false
    this.isShowStamping.value = false
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_RECEIPT)
  }

  onApplicationDetailsClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = true
    this.isShowStamping.value = false
    this.isShowRegister.value = false
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_SECTION105)
  }

  onStampingDetailsClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowStamping.value = true
    this.isShowRegister.value = false
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_SECTION105)
  }

  onRegisterDetailsClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowStamping.value = false
    this.isShowRegister.value = true
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER)
  }

  onCompletedDetailsClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowStamping.value = false
    this.isShowRegister.value = false
    this.isShowCompleted.value = true

    this.emitEvents("documentSelected", DocumentTargets.TARGET_SECTION105)
  }

  async onStampingClicked(): Promise<void> {
    if (!this.application.value || this.isStamping.value) {
      return
    }

    try {
      this.isStamping.value = true

      let repository = useCompanyShareholderTransferStore()
      let response = await repository.notifyStamping(this.application.value.id)

      if (repository.error !== null || !response) {
        let error = new Error()
        error.setForCUD()
        throw error
      }

      this.application.value.status = "stamping" //

      await this.fetchApplication()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isStamping.value = false
    }
  }

  async onDownloadClicked(): Promise<void> {
    await nextTick()
    this.emitEvents("download")
  }

  async onUploadClicked(): Promise<void> {
    if (this.uploadDocumentRef) {
      this.uploadDocumentRef.show()
    }
  }

  async onSubmitClicked(): Promise<void> {
    if (this.isSubmitting.value || !this.application.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      let repository = useCompanyShareholderTransferStore()
      await repository.submit(this.application.value.id)

      this.application.value.status = StatusConstants.SUBMITTED
      await this.fetchApplication()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async onShippedClicked(): Promise<void> {
    if (this.shipApplicationRef) {
      this.shipApplicationRef.show()
    }
  }

  async onDownloadSection51Clicked(): Promise<void> {
    if (!this.isSection51Uploaded || this.isDownloadingSection51.value) {
      return
    }

    try {
      let companyDocument = this.uplaodedSection51

      if (!companyDocument || !companyDocument.fileUrl || StringUtil.isNullOrEmpty(companyDocument.fileUrl)) {
        throw "new file"
      }

      this.isDownloadingSection51.value = true
      let url = companyDocument.fileUrl

      const response = await fetch(url)
      if (!response.ok) {
        throw "Unable to fetch PDF document from source."
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.setAttribute("download", companyDocument.documentName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (e) {
      let error = new Error()
      error.setForFetch()
      error.handle()
    } finally {
      this.isDownloadingSection51.value = false
    }
  }

  async onCompleteClicked(): Promise<void> {
    if (!this.application.value) {
      return
    }
    try {
      let repository = useCompanyStore()
      await repository.postService(this.target.value, this.application.value.id)

      if (repository.error !== null) {
        throw repository.error
      }

      let toastTitle = this.language.isMalay()
        ? "Permohonan telah Selesai. Maklumat Saham Syarikat telah dikemaskini."
        : "Application is Completed. The Company Shares has been updated."
      let toastMessage = this.language.isMalay()
        ? "Anda akan dibawa ke muka Sdn Bhd."
        : "You will be redirected to the Sdn Bhd page."

      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      let router = useRouter()
      router.push({ path: `/sdnbhds/${this.application.value.companyId}` })
    } catch (e) {
      let error = new Error()
      error.setForCUD()
      error.handle()
    } finally {
      this.isCompleting.value = false
    }
  }

  async onProceedPostUpload(): Promise<void> {
    await this.uploadedDocumentChecker.value.fetchDocuments()
  }

  getTransferorDetail(transferDetail: CompanyShareTransferDetail): User {
    return new User(transferDetail.transferFrom.user)
  }

  isTransferToNew(transferDetail: CompanyShareTransferDetail): boolean {
    return StringUtil.isNullOrEmpty(transferDetail.transferToId)
  }

  getTransfereeDetail(transferDetail: CompanyShareTransferDetail): User {
    if (this.isTransferToNew(transferDetail)) {
      return new User(transferDetail.transferToInvitation?.user)
    }

    return new User(transferDetail.transferTo?.user)
  }

  getTransferorPropsUserDetail(transferDetail: CompanyShareTransferDetail): PropsUserDetail {
    return new PropsUserDetail(
      new User(transferDetail.transferFrom.user),
      new UserDetail(transferDetail.transferFrom.user?.detail)
    )
  }

  getTransfereePropsUserDetail(transferDetail: CompanyShareTransferDetail): PropsUserDetail {
    let user = this.getTransfereeDetail(transferDetail)

    return new PropsUserDetail(new User(user), new UserDetail(user.detail))
  }

  //getters
  get serviceName(): string {
    return this.language.isMalay() ? "Pemindahan Saham" : "Transfer of Shares"
  }

  get paymentApplicationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(!this.hasPaid, this.hasPaid, this.isShowReceipt.value)
  }

  get applicationDetailsNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.hasPaid, this.isStampingInProgress, this.isShowResolutions.value)
  }

  get applicationDetailsLabel(): string {
    return this.language.isMalay() ? "Butiran Permohonan" : "Application Details"
  }

  get applicationDetailsSublabel(): string {
    return this.language.isMalay() ? "Butiran Pengisytiharan" : "Declaration Details"
  }

  get amountToTransferLabel(): string {
    return this.language.isMalay() ? "Saham untuk Dipindah" : "Shares to Transfer"
  }

  get itemsToPrepareLabel(): string {
    return this.language.isMalay() ? "Perkara perlu disediakan" : "Items to Prepare"
  }

  get itemsToPrepare(): string[] {
    let paymentOrderItem = this.paymentOrder.value.items.find((poi: PaymentOrderItem) => {
      return poi.targetType === this.target.value && poi.targetId === this.applicationId.value
    })

    if (!paymentOrderItem) {
      return []
    }

    let items: string[] = []

    paymentOrderItem.optionals.forEach((poio: PaymentOrderItemOptional) => {
      if (!StringUtil.contains(poio.serviceName, "printed")) {
        items.push(StringUtil.capitalize(poio.serviceName))
      }
    })

    return items
  }

  get submittedStampingLabel(): string {
    if (this.isStamped) {
      return this.language.isMalay() ? "Telah Disetem" : "Stamped"
    }

    if (this.isStampingInProgress) {
      return this.language.isMalay() ? "Sedang disetem" : "Stamping in Progress"
    }

    return this.language.isMalay() ? "Penyeteman" : "Stamping"
  }

  get isStampingInProgress(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING &&
      this.application.value.status !== StatusConstants.PAID
    )
  }

  get isStamped(): boolean {
    return this.isStampingInProgress && this.isSijilSetemUploaded
  }

  get stampingProgressNode(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.isStampingInProgress, this.isStamped, this.isShowStamping.value)
  }

  get stampingLabel(): string {
    return this.language.isMalay() ? "Progress Penyetemen" : "Stamping Progress"
  }

  get stampingSublabel(): string {
    return this.language.isMalay()
      ? "(Muat naik Sijil Setem dari LHDN untuk kemaskini status)"
      : "(Upload Sijil Setem from LHDN to update status)"
  }

  get registerNode(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.isStamped, this.isApproved, this.isShowRegister.value)
  }

  get registerLabel(): string {
    return this.language.isMalay()
      ? "Seksyen 106 - Daftar Pemindahan Saham"
      : "Section 106 - Register Transfer of Shares"
  }

  get registerSublabel(): string {
    return this.language.isMalay()
      ? "(Pilihan Pengarah bawah Seksyen 106 Akta Syarikat 2016)"
      : "(Directors' Options Under Section 106 of Companies Act 2016)"
  }

  get registerButtonLabel(): string {
    return this.language.isMalay() ? "Hantar ke SSM" : "Submit to SSM"
  }

  get registerDetails(): string {
    let decision = ""
    switch (this.postShareTransferApplication.value.delayType) {
      case RegisterOfTransferType.Approval:
        decision = this.language.isMalay() ? "Diluluskan" : "Approved"
        break
      case RegisterOfTransferType.Delay:
        decision = this.language.isMalay() ? "Lewatkan" : "Delay"
        break
      case RegisterOfTransferType.Refusal:
        decision = this.language.isMalay() ? "Ditolak" : "Refused"
        break
    }

    let isNotApproved = this.postShareTransferApplication.value.delayType !== RegisterOfTransferType.Approval

    if (this.language.isMalay()) {
      let details = `<b>Keputusan:</b> ${decision}`
      if (isNotApproved) {
        details = `${details}<br><b>Sebab-sebab:</b> ${this.postShareTransferApplication.value.reason}`
      }

      return details
    }

    let details = `<b>Decision:</b> ${decision}`
    if (isNotApproved) {
      details = `${details}<br><b>Reason:</b> ${this.postShareTransferApplication.value.reason}`
    }

    return details
  }

  override get deliveryAddress(): string {
    if (!this.application.value) {
      return "-"
    }

    if (!this.application.value.company?.hasBusinessAddress) {
      let addressFragments: string[] = [`<b>${this.paymentOrder.value.billingInfo.name}</b>`]
      addressFragments.push(this.paymentOrder.value.billingInfo.addressLine1 ?? "")
      addressFragments.push(this.paymentOrder.value.billingInfo.addressLine2 ?? "")
      addressFragments.push(
        `${this.paymentOrder.value.billingInfo.addressPostcode} ${this.paymentOrder.value.billingInfo.addressCity}`
      )
      addressFragments.push(
        `${this.paymentOrder.value.billingInfo.addressState} ${this.paymentOrder.value.billingInfo.addressCountry}`
      )

      return addressFragments
        .filter((s: string) => {
          return !StringUtil.isNullOrEmpty(s)
        })
        .join("<br>")
    }

    return `
      <b>${this.paymentOrder.value.billingInfo.name}</b><br>
      ${this.application.value.company?.businessAddressLocation?.getMultilineAddress()}
    `
  }

  override get deliveryAddressToCopy(): string {
    if (!this.application.value) {
      return "-"
    }

    if (!this.application.value.company?.hasBusinessAddress) {
      let addressFragments: string[] = []
      addressFragments.push(this.paymentOrder.value.billingInfo.addressLine1 ?? "")
      addressFragments.push(this.paymentOrder.value.billingInfo.addressLine2 ?? "")
      addressFragments.push(
        `${this.paymentOrder.value.billingInfo.addressPostcode} ${this.paymentOrder.value.billingInfo.addressCity}`
      )
      addressFragments.push(
        `${this.paymentOrder.value.billingInfo.addressState} ${this.paymentOrder.value.billingInfo.addressCountry}`
      )

      return addressFragments
        .filter((s: string) => {
          return !StringUtil.isNullOrEmpty(s)
        })
        .join(", ")
    }

    return this.application.value.company?.businessAddressLocation?.getOnelineAddress() ?? ""
  }

  get downloadLabel(): string {
    return this.language.isMalay() ? "Muat Turun" : "Download"
  }

  get isApproved(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status === StatusConstants.SUBMITTED ||
      this.application.value.status === StatusConstants.APPROVED ||
      this.application.value.status === StatusConstants.SHIPPED ||
      this.application.value.status === StatusConstants.DELIVERED ||
      this.application.value.status === StatusConstants.CONVERTED ||
      this.application.value.status === StatusConstants.COMPLETED
    )
  }

  get shipLabel(): string {
    return this.language.isMalay() ? "Hantar" : "Shipped"
  }

  get isShipped(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status === StatusConstants.SHIPPED ||
      this.application.value.status === StatusConstants.DELIVERED ||
      this.application.value.status === StatusConstants.CONVERTED ||
      this.application.value.status === StatusConstants.COMPLETED
    )
  }

  get deliveryNodeProps(): PropsServiceApplicationNode {
    let props = new PropsServiceApplicationNode(this.isApproved, this.isShipped, this.isShowShipped.value)
    props.isLastNode = true

    return props
  }

  get completedNodeProps(): PropsServiceApplicationNode {
    let props = new PropsServiceApplicationNode(this.isStamped, this.isCompleted, this.isShowCompleted.value)

    props.isLastNode = this.isDeliveryRequired

    return props
  }

  get isCompleted(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status === StatusConstants.CONVERTED ||
      this.application.value.status === StatusConstants.COMPLETED
    )
  }

  get applicationCompletedLabel(): string {
    return this.language.isMalay() ? "Section 51 - Register of Members" : "Section 51 - Register of Members"
  }

  get completedSublabel(): string {
    return this.language.isMalay()
      ? "(Muat naik Seksyen 51 terkini dan lengkapkan permohonan ini.)"
      : "(Upload latest Section 51 and complete this application.)"
  }

  get completedStatus(): string {
    if (!this.isCompleted) {
      return this.language.isMalay() ? "Menunggu pengesahan dari klien" : "Pending confirmation from client"
    }

    let time = useLocalTime()

    let completedAt = time.formatDateOnlyFull(this.application.value?.completedAt ?? "")

    return this.language.isMalay() ? `Disahkan pada ${completedAt}` : `Confirmed on ${completedAt}`
  }

  get markCompletedLabel(): string {
    return this.language.isMalay() ? "Tanda Lengkap" : "Mark Completed"
  }

  get uploadSijilLabel(): string {
    if (this.isSijilSetemUploaded) {
      return this.language.isMalay() ? "Muat Naik Semula" : "Upload Again"
    }

    return this.language.isMalay() ? "Muat Naik" : "Upload"
  }

  get uploadLabel(): string {
    if (this.isSection51Uploaded) {
      return this.language.isMalay() ? "Muat Naik Semula" : "Upload Again"
    }

    return this.language.isMalay() ? "Muat Naik" : "Upload"
  }

  // Documents
  get isSijilSetemUploaded(): boolean {
    return this.uploadedDocumentChecker.value.isDocumentUploaded(
      DocumentTargets.TARGET_SHAREHOLDER_PROPOSE_TRANSFER,
      this.application.value?.paidAt ?? ""
    )
  }

  get uplaodedSijilSetem(): string {
    if (!this.isSijilSetemUploaded) {
      return ""
    }

    let companyDocument = this.uploadedDocumentChecker.value.latestDocument(
      DocumentTargets.TARGET_SHAREHOLDER_PROPOSE_TRANSFER,
      this.application.value?.paidAt ?? ""
    )

    return companyDocument?.fileUrl ?? ""
  }

  get sijilSetemLabel(): string {
    return this.language.isMalay() ? "Sijil Setem" : "Sijil Setem"
  }

  get isSection51Uploaded(): boolean {
    return this.uploadedDocumentChecker.value.isDocumentUploaded(
      DocumentTargets.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER,
      this.application.value?.paidAt ?? ""
    )
  }

  get uplaodedSection51(): CompanyDocument | null {
    if (!this.isSijilSetemUploaded) {
      return null
    }

    let companyDocument = this.uploadedDocumentChecker.value.latestDocument(
      DocumentTargets.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER,
      this.application.value?.paidAt ?? ""
    )

    return companyDocument ?? null
  }

  get section51Label(): string {
    return this.language.isMalay() ? "Seksyen 51" : "Section 51"
  }
}
