import { BasePopupController } from "./BasePopupController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { Filter } from "~/scripts/library/Filter"
import { ObjectUtil } from "~/scripts/utils/Object"
import { SelectOption } from "~/scripts/types/SelectOption"
import { PaymentNotice } from "~/scripts/models/PaymentNotice"
import { PaymentCartItem } from "~/scripts/models/PaymentCartItem"
import { PaymentCart } from "~/scripts/models/PaymentCart"
import { BillingInfo } from "~/scripts/models/BillingInfo"
import { DeliveryInfo } from "~/scripts/models/DeliveryInfo"
import { Toast } from "~/scripts/library/Toast"
import type { PropsSendPaymentNotice } from "~/scripts/props/PropsSendPaymentNotice"

export class SendPaymentNoticeController extends BasePopupController {
  entityType: Ref<string> = ref<string>("")
  entityId: Ref<string> = ref<string>("")
  target: Ref<string> = ref<string>("")
  targetId: Ref<string> = ref<string>("")
  billingInfo: Ref<BillingInfo> = ref<BillingInfo>(new BillingInfo())
  deliveryInfo: Ref<DeliveryInfo> = ref<DeliveryInfo>(new DeliveryInfo())

  isFetchingServicePricings: Ref<boolean> = ref<boolean>(false)
  selectedPricingId: Ref<string> = ref<string>("")
  selectedServicePricing: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())
  servicePricings: Ref<ServicePricing[]> = ref<ServicePricing[]>([])

  isNotify: Ref<boolean> = ref<boolean>(false)
  isSubmitting: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsSendPaymentNotice, emitEvents: any) {
    super(emitEvents)

    this.setDataFromProps(props)

    this.fetchServicePricings()
  }

  setDataFromProps(props: PropsSendPaymentNotice): void {
    this.entityType.value = props.entityType || ""
    this.entityId.value = props.entityId || ""
    this.target.value = props.target || ""
    this.targetId.value = props.targetId || ""
    this.billingInfo.value = props.billingInfo
    this.deliveryInfo.value = props.deliveryInfo
  }

  async fetchServicePricings(): Promise<void> {
    if (this.isFetchingServicePricings.value) {
      return
    }

    try {
      this.isFetchingServicePricings.value = true
      let repository = useServicePricingStore()
      let filter = new Filter()
      filter.takeAll = true
      let response = await repository.fetchAll(filter)

      let unorderedPricings = response.data.map((d: any) => {
        return new ServicePricing(d)
      })

      this.servicePricings.value = ObjectUtil.sort<ServicePricing>(unorderedPricings, "serviceName", "asc")
    } catch (e) {
      //
    } finally {
      this.isFetchingServicePricings.value = false
    }
  }

  onServicePricingSelected(): void {
    let selectedPricing = this.servicePricings.value.find(
      (pricing: ServicePricing) => pricing.id === this.selectedPricingId.value
    )
    if (selectedPricing) {
      this.selectedServicePricing.value = selectedPricing
    }
  }

  async onProceedClicked(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      // 1. Create payment cart
      let cart = this.paymentCart
      await cart.create(usePaymentCartStore())

      let notice = this.paymentNotice
      await notice.create(usePaymentNoticeStore())

      if (this.isNotify.value) {
        await notice.notify(usePaymentNoticeStore())
      }

      let toastTitle = this.language.isMalay() ? "Arahan Bayaran telah dibuat." : "Payment Order is Created."
      let toastMessage = ""
      if (this.isNotify.value) {
        toastMessage = this.language.isMalay()
          ? "Penerima telah dimaklumkan melalui e-mel dan WhatsApp."
          : "Recipient has been notified via email and WhatsApp."
      }
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? "Buat Arahan Bayaran" : "Create Payment Order"
  }

  get pricingLabel(): string {
    return this.language.isMalay() ? "Pilih Pilihan Harga" : "Select Pricing Option"
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get pricingOptions(): SelectOption[] {
    if (this.isFetchingServicePricings.value) {
      return [new SelectOption("", "", "Loading...", true, false)]
    }

    return this.servicePricings.value.map((pricing: ServicePricing) => {
      let price = Number(pricing.baseGrandTotal ?? 0) + Number(pricing.config.handlingFees ?? 0)
      return new SelectOption(pricing.id, pricing.id, `${pricing.serviceName} - RM${price.toFixed(2)}`, false, false)
    })
  }

  get paymentNotice(): PaymentNotice {
    let notice = new PaymentNotice()
    notice.entityType = this.entityType.value
    notice.entityId = this.entityId.value
    notice.servicePricingId = this.selectedPricingId.value
    notice.target = this.target.value
    notice.targetId = this.targetId.value
    notice.servicePricingId = this.selectedPricingId.value

    return notice
  }

  get paymentCartItem(): PaymentCartItem {
    let item = new PaymentCartItem()
    item.targetType = this.target.value
    item.targetId = this.targetId.value
    item.servicePricingId = this.selectedPricingId.value
    item.servicePricing = this.selectedServicePricing.value

    item.setSubtotal()
    return item
  }

  get cartTotal(): number {
    let item = this.paymentCartItem
    return Number(item.subtotal ?? 0)
  }

  get paymentCart(): PaymentCart {
    let cart = new PaymentCart()
    cart.entityType = this.entityType.value
    cart.entityId = this.entityId.value
    cart.billingInfo = this.billingInfo.value
    cart.deliveryInfo = this.deliveryInfo.value
    cart.items = [this.paymentCartItem]
    cart.total = this.cartTotal

    return cart
  }

  get canProceed(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.selectedPricingId.value) &&
      !this.isFetchingServicePricings.value &&
      !this.isSubmitting.value &&
      this.paymentCart.canSubmit() &&
      this.paymentNotice.canSubmit()
    )
  }
}
