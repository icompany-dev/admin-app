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
import { CompanyDocumentRequest } from "~/scripts/models/CompanyDocumentRequest"
import { Bank } from "~/scripts/models/Bank"
import { Filter } from "~/scripts/library/Filter"
import { PaymentOrderItem } from "~/scripts/models/PaymentOrderItem"
import type { PaymentOrderItemMandatory } from "~/scripts/models/PaymentOrderItemMandatory"
import type { PaymentOrderItemOptional } from "~/scripts/models/PaymentOrderItemOptional"
import type { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { DeliveryConstants } from "~/scripts/constants/Payment"
import type { CompanyDocumentRequestItem } from "~/scripts/models/CompanyDocumentRequestItem"
import { DownloadFileData } from "~/scripts/types/DownloadFileData"
import { FileZipper } from "~/scripts/utils/FileZipper"

export class DocumentRequestApplicationController extends ApplicationController<CompanyDocumentRequest> {
  resolutionsRef: any | null = null

  banks: Ref<Bank[]> = ref<Bank[]>([])

  isDownloading: Ref<boolean> = ref<boolean>(false)

  isShowResolutions: Ref<boolean> = ref<boolean>(false)
  isShowCompleted: Ref<boolean> = ref<boolean>(false)

  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(
      props.companyId,
      useCompanyDocumentRequestStore(),
      CompanyDocumentRequest,
      CompanyConstants.TARGET_DOCUMENT_REQUEST,
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
    if (this.isDownloading.value || !this.application.value) {
      return
    }
    // download all

    this.isDownloading.value = true

    try {
      let promises: any[] = []
      let files: DownloadFileData[] = []
      let documentsToDownload = this.application.value.items.filter((d: CompanyDocumentRequestItem) => {
        return !StringUtil.isNullOrEmpty(d.iCompanyFile?.url ?? "")
      })

      documentsToDownload.forEach((item: CompanyDocumentRequestItem) => {
        if (!item.iCompanyFile) {
          return
        }

        promises.push(
          fetch(item.iCompanyFile.url).then(async (response: any) => {
            if (!response.ok) {
              return
            }

            let blob = await response.blob()
            files.push(new DownloadFileData(URL.createObjectURL(blob), item.documentName))
          })
        )
      })

      await Promise.allSettled(promises)

      await FileZipper.zipAndDownload(files, "Documents Requested.zip")
    } catch (e) {
      console.error(e)
    } finally {
      this.isDownloading.value = false
    }
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

  onDocumentClicked(item: CompanyDocumentRequestItem): void {
    if (!this.canShowDocument(item)) {
      return
    }

    this.emitEvents("show", item.iCompanyFile?.url)
  }

  canShowDocument(item: CompanyDocumentRequestItem): boolean {
    return item.iCompanyFile?.url !== null
  }

  //getters
  get serviceName(): string {
    return this.language.isMalay() ? "Permintaan Dokumen" : "Document Requests"
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
    return this.language.isMalay()
      ? "Butiran Dokumen yang Diminta dan Keperluan"
      : "Documents Requested and Requirements"
  }

  get documentsRequestLabel(): string {
    return this.language.isMalay() ? "Senarai Dokumen" : "Documents List"
  }

  get ctcRequiredLabel(): string {
    return this.language.isMalay() ? "Pengesahan Salinan Sah" : "Certify True Copy"
  }

  get ctcType(): string {
    if (!this.application.value) {
      return "-"
    }

    if (!this.application.value.isCtcRequired && this.application.value.isSsmCtcRequired) {
      return this.language.isMalay() ? "Tidak Diperlukan" : "Not Required"
    }

    if (this.application.value.isSsmCtcRequired) {
      return this.language.isMalay() ? "oleh SSM" : "By SSM"
    }

    return this.language.isMalay() ? "oleh Setiausaha Syarikat" : "By Cosec"
  }

  get purchaseFrom(): string {
    return this.language.isMalay() ? "" : ""
  }

  get deliveryViaLabel(): string {
    return this.language.isMalay() ? "Penghantaran melalui" : "Delivery via"
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

  get documents(): CompanyDocumentRequestItem[] {
    return this.application.value?.items ?? []
  }
}
