import { Application } from "~/scripts/models/Application"
import { BasePopupController } from "./BasePopupController"
import type { IRepositoryStore } from "~/scripts/models/IRepositoryStore"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import type { PropsShipApplication } from "~/scripts/props/PropsShipApplication"

export class ShipApplicationController extends BasePopupController {
  application = ref<Application | null>(null)
  target: Ref<string> = ref<string>("")
  repository = ref<IRepositoryStore | null>(null)

  trackingNumber: Ref<string> = ref<string>("")
  trackingUrl: Ref<string> = ref<string>("")

  isUpdating: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsShipApplication, emitEvents: any) {
    super(emitEvents)

    this.application.value = props.application
    this.target.value = props.target
    this.repository.value = props.repository
  }

  async onPropsChanged(props: PropsShipApplication): Promise<void> {
    this.application.value = props.application
    this.target.value = props.target
    this.repository.value = props.repository
  }

  async onProceedClicked(): Promise<void> {
    if (!this.application.value || !this.repository.value || StringUtil.isNullOrEmpty(this.target.value)) {
      let error = new Error()
      error.setForCUD()
      error.handle()
      return
    }

    if (this.isUpdating.value) {
      return
    }

    try {
      this.isUpdating.value = true

      if (!this.canProceed) {
        let error = new Error()
        error.setForIncompleteData()
        throw error
      }

      this.application.value.trackingNumber = this.trackingNumber.value
      this.application.value.trackingUrl = this.trackingUrl.value

      let paymentOrderRepository = usePaymentOrderStore()

      await Promise.all([
        this.application.value.ship(this.repository.value),
        paymentOrderRepository.shipItem(
          this.target.value,
          this.application.value.id,
          this.application.value.trackingNumber ?? "",
          this.application.value.trackingUrl ?? ""
        ),
      ])
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdating.value = false
    }
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? "Hantar Dokumen" : "Ship Documents"
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get instructions(): string {
    if (this.language.isMalay()) {
      return `Lengkapkan butiran dibawah:`
    }

    return `Complete the tracking details below:`
  }

  get trackingNumberLabel(): string {
    return this.language.isMalay() ? "Nombor Kesan" : "Tracking Number"
  }

  get trackingUrlLabel(): string {
    return this.language.isMalay() ? "URL Kesan" : "Tracking URL"
  }

  get canProceed(): boolean {
    return !StringUtil.isNullOrEmpty(this.trackingNumber.value) && !StringUtil.isNullOrEmpty(this.trackingUrl.value)
  }
}
