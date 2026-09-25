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

export class TransferOfShareApplicationController extends ApplicationController<CompanyShareholderTransfer> {
  resolutionsRef: any | null = null

  banks: Ref<Bank[]> = ref<Bank[]>([])

  isShowResolutions: Ref<boolean> = ref<boolean>(false)
  isShowVouchers: Ref<boolean> = ref<boolean>(false)
  isShowShipped: Ref<boolean> = ref<boolean>(false)
  isShowCompleted: Ref<boolean> = ref<boolean>(false)

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

    this.fetchBanks()
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

    await Promise.allSettled(promises)

    if (StringUtil.isNullOrEmpty(this.uploadedDocumentChecker.value.companyId)) {
      this.uploadedDocumentChecker.value.companyId = this.application.value.companyId
      await this.uploadedDocumentChecker.value.fetchDocuments()
    }
  }

  async fetchBanks(): Promise<void> {
    try {
      let repository = useBankStore()
      let filter = new Filter()
      filter.takeAll = true
      let response = await repository.fetchAll(filter)

      this.banks.value = response.data.map((d: any) => {
        return new Bank(d)
      })
    } catch (e) {
      console.error(e)
    }
  }

  onPaymentStepClicked(): void {
    this.isShowReceipt.value = true
    this.isShowResolutions.value = false
    this.isShowVouchers.value = false
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_RECEIPT)
  }

  onApplicationDetailsClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = true
    this.isShowVouchers.value = false
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_SECTION105)
  }

  onVouchersDetailsClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowVouchers.value = true
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_DIVIDEND_DECLARATION_VOUCHERS)
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

  async onPrintClicked(): Promise<void> {
    //
  }

  async onShippedClicked(): Promise<void> {
    if (this.shipApplicationRef) {
      this.shipApplicationRef.show()
    }
  }

  async onCompleteClicked(): Promise<void> {
    //
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
    return new PropsServiceApplicationNode(this.hasPaid, this.isStamped, this.isShowResolutions.value)
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
      return this.language.isMalay() ? "Disetem" : "Stamped"
    }

    return this.language.isMalay() ? "Penyeteman" : "Stamping"
  }

  get isStamped(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING &&
      this.application.value.status !== StatusConstants.PAID
    )
  }

  get voucherNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.hasPaid, this.isShipped, this.isShowVouchers.value)
  }

  get voucherLabel(): string {
    return this.language.isMalay() ? "Baucar Dividen" : "Dividend Vouchers"
  }

  get voucherSublabel(): string {
    return this.language.isMalay()
      ? "Jana Baucar bagi Dividen yang Diisytihar"
      : "Generate Vouchers for the Dividend Declared"
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
    return new PropsServiceApplicationNode(this.isApproved, this.isShipped, this.isShowShipped.value)
  }

  get completedNodeProps(): PropsServiceApplicationNode {
    let isPreviousStepCompleted = this.isDeliveryRequired ? this.isShipped : this.isApproved

    let props = new PropsServiceApplicationNode(isPreviousStepCompleted, this.isCompleted, this.isShowCompleted.value)

    props.isLastNode = true

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
    return this.language.isMalay() ? "Dokumen Dihantar" : "Documents Delivered"
  }

  get completedSublabel(): string {
    return this.language.isMalay() ? "(Status Penghantaran Dokumen)" : "(Document Delivery Status)"
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
}
