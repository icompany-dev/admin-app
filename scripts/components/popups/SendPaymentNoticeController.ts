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
import { ServicePricingBreakdown } from "~/scripts/models/ServicePricingBreakdown"
import { ServicePricingMandatory } from "~/scripts/models/ServicePricingMandatory"
import { NumberUtil } from "~/scripts/utils/Number"

export class SendPaymentNoticeController extends BasePopupController {
  entityType: Ref<string> = ref<string>("")
  entityId: Ref<string> = ref<string>("")
  entityName: Ref<string> = ref<string>("")
  target: Ref<string> = ref<string>("")
  targetId: Ref<string> = ref<string>("")
  billingInfo: Ref<BillingInfo> = ref<BillingInfo>(new BillingInfo())
  deliveryInfo: Ref<DeliveryInfo> = ref<DeliveryInfo>(new DeliveryInfo())

  isFetchingServicePricings: Ref<boolean> = ref<boolean>(false)
  selectedPricingId: Ref<string> = ref<string>("")
  selectedServicePricing: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())
  servicePricings: Ref<ServicePricing[]> = ref<ServicePricing[]>([])

  isNotify: Ref<boolean> = ref<boolean>(false)
  isCustomPricing: Ref<boolean> = ref<boolean>(false)
  isSubmitting: Ref<boolean> = ref<boolean>(false)

  searchText: Ref<string> = ref<string>("")
  searchTexts: Ref<string[]> = ref<string[]>([])

  newServicePricing: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())

  isShowDrawer: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsSendPaymentNotice, emitEvents: any) {
    super(emitEvents)

    this.setDataFromProps(props)

    this.fetchServicePricings()
  }

  override show(): void {
    this.isShowDrawer.value = true
    this.newServicePricing.value = new ServicePricing()
    this.isCustomPricing.value = false
    this.isNotify.value = false
    this.selectedPricingId.value = ""
    this.selectedServicePricing.value = new ServicePricing()
    this.searchText.value = ""
    this.searchTexts.value = []
  }

  override hide(): void {
    this.isShowDrawer.value = false
    this.newServicePricing.value = new ServicePricing()
  }

  setDataFromProps(props: PropsSendPaymentNotice): void {
    this.entityType.value = props.entityType || ""
    this.entityId.value = props.entityId || ""
    this.entityName.value = props.entityName || ""
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

  onServicePricingSelected(selectedId: string): void {
    this.selectedPricingId.value = selectedId
    let selectedPricing = this.servicePricings.value.find(
      (pricing: ServicePricing) => pricing.id === this.selectedPricingId.value
    )
    if (selectedPricing) {
      this.selectedServicePricing.value = selectedPricing
    }
  }

  onSearchPrice(searchText: string): void {
    this.searchText.value = searchText
  }

  onSetCustomPricingChanged(): void {
    if (!StringUtil.isNullOrEmpty(this.selectedPricingId.value)) {
      this.newServicePricing.value = new ServicePricing(this.selectedServicePricing.value)

      if (this.newServicePricing.value.breakdowns.length === 0) {
        let newBreakdown = new ServicePricingBreakdown()
        newBreakdown.itemName = this.newServicePricing.value.serviceName
        this.newServicePricing.value.breakdowns.push(newBreakdown)
      }

      this.newServicePricing.value.breakdowns.forEach((spb: ServicePricingBreakdown) => {
        spb.id = ""
        spb.servicePricingId = ""
      })

      this.newServicePricing.value.mandatoryServices.forEach((spm: ServicePricingMandatory) => {
        spm.id = ""
        spm.servicePricingId = ""
      })

      this.newServicePricing.value.optionals = []

      return
    }

    this.newServicePricing.value = new ServicePricing()
    this.newServicePricing.value.breakdowns = [new ServicePricingBreakdown()]

    this.selectedPricingId.value = ""
    this.selectedServicePricing.value = new ServicePricing()
  }

  onAddBreakdown(): void {
    this.newServicePricing.value.breakdowns.push(new ServicePricingBreakdown())
  }

  onRemoveBreakdown(index: number): void {
    this.newServicePricing.value.breakdowns.splice(index, 1)
  }

  onAddMandatory(): void {
    this.newServicePricing.value.mandatoryServices.push(new ServicePricingMandatory())
    this.searchTexts.value.push("")
  }

  onRemoveMandatory(index: number): void {
    this.newServicePricing.value.mandatoryServices.splice(index, 1)
    this.searchTexts.value.splice(index, 1)
  }

  onSearchMandatory(searchText: string, index: number): void {
    this.searchTexts.value[index] = searchText
  }

  getMandatoryPricingOptions(index: number): SelectOption[] {
    let searchText = this.searchTexts.value[index]
    let options: SelectOption[] = []

    if (this.isFetchingServicePricings.value) {
      options.push(new SelectOption("", "", "Loading...", true, false))
      return options
    }

    options = this.servicePricings.value
      .filter((pricing: ServicePricing) => {
        if (StringUtil.isNullOrEmpty(searchText)) {
          return true
        }

        return StringUtil.contains(pricing.serviceName, searchText)
      })
      .map((pricing: ServicePricing) => {
        let price = Number(pricing.baseGrandTotal ?? 0) + Number(pricing.config.handlingFees ?? 0)
        return new SelectOption(pricing.id, pricing.id, `${pricing.serviceName} - RM${price.toFixed(2)}`, false, false)
      })

    return options
  }

  onMandatoryPricingSelected(selectedId: string, index: number): void {
    let selectedPricing = this.servicePricings.value.find((pricing: ServicePricing) => pricing.id === selectedId)
    if (selectedPricing) {
      this.newServicePricing.value.mandatoryServices[index].mandatoryServiceId = selectedPricing.id
      this.newServicePricing.value.mandatoryServices[index].mandatoryServicePrice = selectedPricing
      this.newServicePricing.value.mandatoryServices[index].basePrice =
        Number(selectedPricing.baseGrandTotal ?? 0) + Number(selectedPricing.config.handlingFees ?? 0)
    }
  }

  getMandatoryPricingName(index: number): string {
    if (this.isFetchingServicePricings.value) {
      return "Loading ..."
    }

    let mandatory = this.newServicePricing.value.mandatoryServices[index]
    if (!mandatory.mandatoryServicePrice || StringUtil.isNullOrEmpty(mandatory.mandatoryServicePrice.serviceName)) {
      return this.language.isMalay() ? "Pilih Harga" : "Select Pricing"
    }

    return mandatory.mandatoryServicePrice.serviceName
  }

  onPriceChange(price: string | number): void {
    if (typeof price == "string") {
      price = Number(price)
    }

    if (price < 0) {
      price = 0
    }
  }

  onCosecServiceFeeChanged(): void {
    this.newServicePricing.value.config.cosecServiceFee = Number(this.newServicePricing.value.config.cosecServiceFee)
    if (this.newServicePricing.value.config.cosecServiceFee < 0) {
      this.newServicePricing.value.config.cosecServiceFee = 0
    }
    this.newServicePricing.value.config.isCosecServiceFeeMandatory =
      this.newServicePricing.value.config.cosecServiceFee > 0
  }

  onDigitalServiceFeeChanged(): void {
    this.newServicePricing.value.config.digitalServiceFee = Number(
      this.newServicePricing.value.config.digitalServiceFee
    )
    if (this.newServicePricing.value.config.digitalServiceFee < 0) {
      this.newServicePricing.value.config.digitalServiceFee = 0
    }
    this.newServicePricing.value.config.isDsfMandatory = this.newServicePricing.value.config.digitalServiceFee > 0
  }

  onHandlingFeesChanged(): void {
    this.newServicePricing.value.config.handlingFees = Number(this.newServicePricing.value.config.handlingFees)
    if (this.newServicePricing.value.config.handlingFees < 0) {
      this.newServicePricing.value.config.handlingFees = 0
    }
    this.newServicePricing.value.config.isDsfMandatory = this.newServicePricing.value.config.handlingFees > 0
  }

  async onProceedClicked(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      if (this.isCustomPricing.value) {
        await this.newServicePricing.value.create(useServicePricingStore())
      }

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

      this.hide()
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

  get content(): string {
    if (this.language.isMalay()) {
      return `Sila pilih pilihan harga untuk<br><b>${this.entityName.value}</b><br>untuk buat arahan bayaran.`
    }

    return `Please select a pricing option for<br><b>${this.entityName.value}</b><br>to create a payment order.`
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

    return this.servicePricings.value
      .filter((pricing: ServicePricing) => {
        if (StringUtil.isNullOrEmpty(this.searchText.value)) {
          return true
        }

        return StringUtil.contains(pricing.serviceName, this.searchText.value)
      })
      .map((pricing: ServicePricing) => {
        let price = Number(pricing.baseGrandTotal ?? 0) + Number(pricing.config.handlingFees ?? 0)
        return new SelectOption(pricing.id, pricing.id, `${pricing.serviceName} - RM${price.toFixed(2)}`, false, false)
      })
  }

  get paymentNotice(): PaymentNotice {
    let notice = new PaymentNotice()
    notice.entityType = this.entityType.value
    notice.entityId = this.entityId.value
    notice.target = this.target.value
    notice.targetId = this.targetId.value

    if (this.isCustomPricing.value) {
      notice.servicePricingId = this.newServicePricing.value.id
    } else {
      notice.servicePricingId = this.selectedPricingId.value
    }

    return notice
  }

  get paymentCartItem(): PaymentCartItem {
    let item = new PaymentCartItem()
    item.targetType = this.target.value
    item.targetId = this.targetId.value

    if (this.isCustomPricing.value) {
      item.servicePricingId = this.newServicePricing.value.id
      item.servicePricing = this.newServicePricing.value
    } else {
      item.servicePricingId = this.selectedPricingId.value
      item.servicePricing = this.selectedServicePricing.value
    }

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
    if (this.isCustomPricing.value) {
      return (
        !this.isFetchingServicePricings.value && !this.isSubmitting.value && this.newServicePricing.value.canSubmit()
      )
    }

    return (
      !this.isFetchingServicePricings.value &&
      !this.isSubmitting.value &&
      !StringUtil.isNullOrEmpty(this.selectedPricingId.value) &&
      this.paymentCart.canSubmit() &&
      this.paymentNotice.canSubmit()
    )
  }

  get selectedPricingName(): string {
    let matching = this.pricingOptions.find((opt: SelectOption) => {
      return opt.value === this.selectedPricingId.value
    })

    if (!matching) {
      return this.language.isMalay() ? "Pilih Harga" : "Select Pricing"
    }

    return matching.label
  }

  get canCreateNewPricing(): boolean {
    return this.target.value === "Company" || this.target.value === "User"
  }

  get selectedServicePricingBreakdowns(): ServicePricingBreakdown[] {
    return this.selectedServicePricing.value.breakdowns.filter((breakdown: ServicePricingBreakdown) => {
      return breakdown.price > 0
    })
  }

  get selectedServicePricingMandatories(): ServicePricingMandatory[] {
    return this.selectedServicePricing.value.mandatoryServices
  }

  get paymentOrderTotal(): string {
    if (this.isCustomPricing.value) {
      let totalBreakdowns = this.newServicePricing.value.breakdowns.reduce((a, b) => {
        return a + Number(b.price)
      }, 0)
      let totalMandatories = this.newServicePricing.value.mandatoryServices.reduce((a, b) => {
        return a + Number(b.basePrice)
      }, 0)
      this.newServicePricing.value.baseGrandTotal =
        totalBreakdowns +
        totalMandatories +
        Number(this.newServicePricing.value.config.cosecServiceFee) +
        Number(this.newServicePricing.value.config.digitalServiceFee) +
        Number(this.newServicePricing.value.config.handlingFees)

      return NumberUtil.currency(this.newServicePricing.value.baseGrandTotal)
    }

    return NumberUtil.currency(this.cartTotal)
  }
}
