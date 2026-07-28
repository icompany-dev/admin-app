import { DocumentTargets } from "~/scripts/constants/DocumentTargets"
import { StatusConstants } from "~/scripts/constants/Status"
import { Application } from "~/scripts/models/Application"
import type { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import type { IPropsServiceApplication } from "~/scripts/props/PropsServiceApplication"
import { PropsServiceApplicationNode } from "~/scripts/props/PropsServiceApplicationNode"

export class ServiceApplicationController {
  isCollapsed: Ref<boolean> = ref<boolean>(false)

  serviceName: Ref<string> = ref<string>("")
  hasApplication: Ref<boolean> = ref<boolean>(false)
  application = ref<Application | ApplicationIncorporate | null>(null)

  emitEvents: any | null = null

  language = useLanguage()

  isShowReceipt: Ref<boolean> = ref<boolean>(true)
  isDownloadingReceipt: Ref<boolean> = ref<boolean>(false)

  constructor(props: IPropsServiceApplication, emitEvents: any) {
    this.serviceName.value = props.serviceName
    this.hasApplication.value = props.hasApplication
    this.application.value = props.application
    this.isShowReceipt.value = props.isShowPaymentStep
    this.emitEvents = emitEvents
  }

  setServiceName(serviceName: string): void {
    this.serviceName.value = serviceName
  }

  setHasApplication(hasApplication: boolean): void {
    this.hasApplication.value = hasApplication
  }

  setApplication(application: Application | ApplicationIncorporate | null): void {
    this.application.value = application
  }

  setIsShowReceipt(isShowReceipt: boolean): void {
    this.isShowReceipt.value = isShowReceipt
  }

  onPanelClicked(): void {
    this.isCollapsed.value = !this.isCollapsed.value
    this.emitEvents(this.isCollapsed.value ? "hide" : "show")
  }

  expand(): void {
    this.isCollapsed.value = false
    this.emitEvents("show")
  }

  collapse(): void {
    this.isCollapsed.value = true
    this.emitEvents("hide")
  }

  onPaymentNodeClicked(): void {
    this.isShowReceipt.value = true
    this.emitEvents("paymentNodeSelected", true)
    this.emitEvents("documentSelected", DocumentTargets.TARGET_RECEIPT)
  }

  async onDownloaReceiptClicked(): Promise<void> {
    // do
  }

  get canDownloadReceipt(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING
    )
  }

  get hasPaid(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING
    )
  }

  get receiptApplicationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(!this.hasPaid, this.hasPaid, this.isShowReceipt.value)
  }

  get paymentLabel(): string {
    if (!this.hasPaid) {
      return this.language.isMalay() ? "Tiada Bayaran Diterima" : "No Payment Received"
    }

    return this.language.isMalay() ? "Bayaran Diterima" : "Payment Received"
  }

  get paymentSublabel(): string {
    if (!this.hasPaid) {
      return ""
    }

    let time = useLocalTime()

    let date = time.formatDateOnlyShort(this.application.value?.paidAt ?? "")

    return this.language.isMalay() ? `Terima pada ${date}` : `Received at ${date}`
  }

  get downloadLabel(): string {
    return this.language.isMalay() ? "Muat Turun" : "Download"
  }
}
