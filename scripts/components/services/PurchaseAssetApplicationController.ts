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
import { CompanyAssetPurchase } from "~/scripts/models/CompanyAssetPurchase"
import { Bank } from "~/scripts/models/Bank"
import { Filter } from "~/scripts/library/Filter"
import { PaymentOrderItem } from "~/scripts/models/PaymentOrderItem"
import type { PaymentOrderItemMandatory } from "~/scripts/models/PaymentOrderItemMandatory"
import type { PaymentOrderItemOptional } from "~/scripts/models/PaymentOrderItemOptional"
import type { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { DeliveryConstants } from "~/scripts/constants/Payment"

export class PurchaseAssetApplicationController extends ApplicationController<CompanyAssetPurchase> {
  resolutionsRef: any | null = null

  banks: Ref<Bank[]> = ref<Bank[]>([])

  isShowResolutions: Ref<boolean> = ref<boolean>(false)
  isShowCompleted: Ref<boolean> = ref<boolean>(false)

  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(
      props.companyId,
      useCompanyAssetPurchaseStore(),
      CompanyAssetPurchase,
      CompanyConstants.TARGET_PURCHASE_ASSET,
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
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_RECEIPT)
  }

  onApplicationDetailsClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = true
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_PURCHASE_ASSET_RESOLUTIONS)
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

  //getters
  get serviceName(): string {
    return this.language.isMalay() ? "Pembelian Asset" : "Purchase of Asset"
  }

  get paymentApplicationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(!this.hasPaid, this.hasPaid, this.isShowReceipt.value)
  }

  get applicationDetailsNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.hasPaid, this.isShipped, this.isShowResolutions.value)
  }

  get applicationDetailsLabel(): string {
    return this.language.isMalay() ? "Butiran Permohonan" : "Application Details"
  }

  get applicationDetailsSublabel(): string {
    return this.language.isMalay() ? "Kategori Aset & Butiran" : "Asset Category & Description"
  }

  get assetCategoryLabel(): string {
    return "Asset Category"
  }

  get assetCategory(): string {
    return this.application.value?.assetCategory ?? "-"
  }

  // get branchLabel(): string {
  //   return this.language.isMalay() ? "Cawangan" : "Branch"
  // }

  // get branchName(): string {
  //   return this.application.value?.bankBranch.name ?? "-"
  // }

  // get branchAddress(): string {
  //   return this.application.value?.bankBranch.address ?? "-"
  // }

  get isDeliveryRequired(): boolean {
    if (!this.application.value) {
      return false
    }

    let orderItem = this.paymentOrder.value.items.find((poi: PaymentOrderItem) => {
      return poi.targetType === CompanyConstants.TARGET_PURCHASE_ASSET && poi.targetId === this.application.value?.id
    })

    if (!orderItem) {
      return false
    }

    return orderItem.isDeliveryRequired
  }

  get deliveryViaLabel(): string {
    return this.language.isMalay() ? "Penghantaran melalui" : "Delivery via"
  }

  get deliveryMethod(): string {
    if (!this.application.value) {
      return "-"
    }

    let orderItem = this.paymentOrder.value.items.find((poi: PaymentOrderItem) => {
      return poi.targetType === CompanyConstants.TARGET_PURCHASE_ASSET && poi.targetId === this.application.value?.id
    })

    if (!orderItem) {
      return "-"
    }

    return orderItem.deliveryType ?? "-"
  }

  get isPhysicalDeliveryRequired(): boolean {
    if (!this.application.value) {
      return false
    }

    let orderItem = this.paymentOrder.value.items.find((poi: PaymentOrderItem) => {
      return poi.targetType === CompanyConstants.TARGET_PURCHASE_ASSET && poi.targetId === this.application.value?.id
    })

    if (!orderItem) {
      return false
    }

    return (
      orderItem.deliveryType !== null &&
      orderItem.deliveryType !== DeliveryConstants.DELIVERY_EMAIL &&
      orderItem.deliveryType !== DeliveryConstants.DELIVERY_WHATSAPP
    )
  }

  get deliverToLabel(): string {
    return this.language.isMalay() ? "Hantar ke" : "Deliver to"
  }

  get deliveryAddress(): string {
    if (!this.application.value) {
      return "-"
    }

    if (!this.isPhysicalDeliveryRequired) {
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

  get deliveryAddressToCopy(): string {
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

  get completedNodeProps(): PropsServiceApplicationNode {
    let props = new PropsServiceApplicationNode(this.isShipped, this.isCompleted, this.isShowCompleted.value)

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
