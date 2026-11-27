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
import { AdminEmail } from "~/scripts/models/AdminEmail"

export class SendPaymentNoticeController extends BasePopupController {
  entityType: Ref<string> = ref<string>("")
  entityId: Ref<string> = ref<string>("")
  entityName: Ref<string> = ref<string>("")
  target: Ref<string> = ref<string>("")
  targetId: Ref<string> = ref<string>("")
  targetIds: Ref<string[]> = ref<string[]>([])
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

  discountAmount: Ref<number> = ref<number>(0)

  selectedPricings: Ref<ServicePricing[]> = ref<ServicePricing[]>([])
  indexOfPricingInEdit: Ref<number | null> = ref<number | null>(null)

  searchTextFromProps: Ref<string> = ref<string>("")

  emailRecipients: Ref<string[]> = ref<string[]>([])

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

    if (this.selectedPricings.value.length <= 0) {
      this.selectedPricings.value = [new ServicePricing()]
      this.searchTexts.value.push("")
    }
  }

  override hide(): void {
    this.isShowDrawer.value = false
    this.newServicePricing.value = new ServicePricing()
    this.selectedPricings.value = []
  }

  setDataFromProps(props: PropsSendPaymentNotice): void {
    this.entityType.value = props.entityType || ""
    this.entityId.value = props.entityId || ""
    this.entityName.value = props.entityName || ""
    this.target.value = props.target || ""
    this.targetId.value = props.targetId || ""
    this.targetIds.value = props.targetIds || []
    this.billingInfo.value = props.billingInfo
    this.deliveryInfo.value = props.deliveryInfo
    this.emailRecipients.value = props.emailRecipients
    this.searchTextFromProps.value = props.servicePricingFilter

    if (props.selectedServicePricings.length > 0) {
      this.selectedPricings.value = props.selectedServicePricings.map((sp: ServicePricing) => {
        return new ServicePricing(sp)
      })
    }

    if (this.targetIds.value.length > 0) {
      this.targetIds.value.forEach((s: string, index: number) => {
        let existingPricing = this.selectedPricings.value[index] ?? null
        if (existingPricing) {
          return
        }

        this.selectedPricings.value.push(new ServicePricing())
      })
    }

    this.selectedPricings.value.forEach((sp: ServicePricing) => {
      this.searchTexts.value.push("")
    })
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

  onAddPricing(): void {
    this.selectedPricings.value.push(new ServicePricing())
  }

  onRemovePricing(index: number): void {
    if (this.indexOfPricingInEdit.value === index) {
      this.indexOfPricingInEdit.value = null
    }

    this.selectedPricings.value.splice(index, 1)
  }

  onSelectedPricingId(selectedId: string, index: number): void {
    let pricing = this.selectedPricings.value[index] ?? null
    if (!pricing) {
      return
    }

    let selectedPricing =
      this.servicePricings.value.find((sp: ServicePricing) => {
        return sp.id === selectedId
      }) ?? null
    if (!selectedPricing) {
      return
    }

    this.selectedPricings.value[index] = new ServicePricing(selectedPricing)
  }

  onEditSelectedPricingClicked(index: number): void {
    if (this.indexOfPricingInEdit.value !== null) {
      this.selectedPricings.value[this.indexOfPricingInEdit.value] = new ServicePricing(this.newServicePricing.value)

      if (this.indexOfPricingInEdit.value === index) {
        this.indexOfPricingInEdit.value = null
        return
      }
    }

    let pricingToEdit = this.selectedPricings.value[index]
    if (!pricingToEdit) {
      return
    }

    this.selectedPricingId.value = pricingToEdit.id
    this.selectedServicePricing.value = new ServicePricing(pricingToEdit)
    this.onEditPricingClicked()

    this.indexOfPricingInEdit.value = index
  }

  onCancelEditClicked(index: number): void {
    this.indexOfPricingInEdit.value = null
  }

  onSaveEditClicked(index: number): void {
    if (this.indexOfPricingInEdit.value !== index) {
      return
    }

    this.selectedPricings.value[this.indexOfPricingInEdit.value] = new ServicePricing(this.newServicePricing.value)
    this.indexOfPricingInEdit.value = null
  }

  isPricingEditable(index: number): boolean {
    return this.indexOfPricingInEdit.value !== null && this.indexOfPricingInEdit.value === index
  }

  isEditingPricing(index: number): boolean {
    return this.indexOfPricingInEdit.value !== null && this.indexOfPricingInEdit.value === index
  }

  getSelectedPricingName(pricing: ServicePricing): string {
    if (this.isFetchingServicePricings.value) {
      return "Loading..."
    }

    if (StringUtil.isNullOrEmpty(pricing.serviceName)) {
      return "Select One"
    }

    return pricing.serviceName
  }

  getSelectedBreakdowns(pricing: ServicePricing): ServicePricingBreakdown[] {
    return pricing.breakdowns.filter((breakdown: ServicePricingBreakdown) => {
      return breakdown.price > 0
    })
  }

  getSelectedMandatories(pricing: ServicePricing): ServicePricingMandatory[] {
    return pricing.mandatoryServices
  }

  getEditLabel(index: number): string {
    if (this.isEditingPricing(index)) {
      return this.language.isMalay() ? "Batal" : "Cancel"
    }

    return this.language.isMalay() ? "Tukar" : "Edit"
  }

  getSubtotal(pricing: ServicePricing): string {
    let total = Number(pricing.baseGrandTotal) + Number(pricing.config.handlingFees)

    return NumberUtil.currency(total)
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

  onEditPricingClicked(): void {
    this.isCustomPricing.value = !this.isCustomPricing.value

    if (!StringUtil.isNullOrEmpty(this.selectedPricingId.value)) {
      this.newServicePricing.value = new ServicePricing(this.selectedServicePricing.value)
      this.newServicePricing.value.isCustom = true
      this.newServicePricing.value.isDefault = false
      this.newServicePricing.value.serviceTarget = ""

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

      // find the ones that need to create first
      let promises = this.selectedPricings.value
        .filter((sp: ServicePricing) => {
          return StringUtil.isNullOrEmpty(sp.id)
        })
        .map((sp: ServicePricing) => {
          sp.isCustom = true
          return sp.create(useServicePricingStore())
        })

      if (promises.length > 0) {
        await Promise.all(promises)
      }

      // create notices
      let notices = this.paymentNotices
      let promiseNotices = notices.map((pn: PaymentNotice) => {
        return pn.create(usePaymentNoticeStore())
      })

      await Promise.all(promiseNotices)

      // let notice = this.paymentNotice
      // await notice.create(usePaymentNoticeStore())

      let cart = this.paymentCart
      cart.items.forEach((pci) => {
        let notice = notices.find((pn: PaymentNotice) => {
          return pn.servicePricingId === pci.servicePricingId
        })

        if (!notice) {
          return
        }

        pci.targetType = "payment_notice"
        pci.targetId = notice.id
      })

      // Remove the ones without targetId
      cart.items = cart.items.filter((pci: PaymentCartItem) => {
        return pci.targetId !== ""
      })

      await cart.create(usePaymentCartStore())

      if (this.isNotify.value) {
        // Create custom notice using admin Email
        let adminEmail = new AdminEmail()
        adminEmail.subject = this.emailTitle
        adminEmail.content = this.emailContent
        adminEmail.recipients = this.emailRecipients.value

        await adminEmail.sendEmail(useAdminEmailStore())
      }

      let toastTitle = this.language.isMalay() ? "Arahan Bayaran telah dibuat." : "Payment Order is Created."
      let toastMessage = ""
      if (this.isNotify.value) {
        toastMessage = this.language.isMalay()
          ? "Penerima telah dimaklumkan melalui e-mel."
          : "Recipients is notified via email."
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
        if (
          StringUtil.isNullOrEmpty(this.searchText.value) &&
          StringUtil.isNullOrEmpty(this.searchTextFromProps.value)
        ) {
          return pricing.mandatoryServices.length > 0
        }

        if (!StringUtil.isNullOrEmpty(this.searchTextFromProps.value)) {
          return (
            StringUtil.contains(pricing.serviceName, this.searchText.value) &&
            StringUtil.contains(pricing.serviceName, this.searchTextFromProps.value) &&
            pricing.mandatoryServices.length > 0
          )
        }

        return StringUtil.contains(pricing.serviceName, this.searchText.value) && pricing.mandatoryServices.length > 0
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

  get paymentNotices(): PaymentNotice[] {
    if (this.targetIds.value.length > 0) {
      let paymentNotices = this.targetIds.value.map((s: string, index: number) => {
        let pricing = this.selectedPricings.value[index] ?? null

        if (!pricing) {
          return null
        }

        let notice = new PaymentNotice()
        notice.entityType = this.entityType.value
        notice.entityId = this.entityId.value
        notice.target = this.target.value
        notice.targetId = s

        notice.servicePricingId = pricing.id

        return notice
      })

      if (paymentNotices.length < this.selectedPricings.value.length) {
        let startIndex = paymentNotices.length
        let otherPricings = this.selectedPricings.value.slice(startIndex)
        let otherPaymentNotices = otherPricings.map((sp: ServicePricing) => {
          let notice = new PaymentNotice()
          notice.entityType = this.entityType.value
          notice.entityId = this.entityId.value
          notice.target = this.target.value
          notice.targetId = this.targetId.value

          notice.servicePricingId = sp.id

          return notice
        })

        paymentNotices = paymentNotices.concat(otherPaymentNotices)
      }

      return paymentNotices
        .filter((pn: PaymentNotice | null) => {
          return pn !== null
        })
        .map((pn: PaymentNotice | null) => {
          return new PaymentNotice(pn)
        })
    }

    return this.selectedPricings.value.map((sp: ServicePricing) => {
      let notice = new PaymentNotice()
      notice.entityType = this.entityType.value
      notice.entityId = this.entityId.value
      notice.target = this.target.value
      notice.targetId = this.targetId.value

      notice.servicePricingId = sp.id

      return notice
    })
  }

  get paymentCartItems(): PaymentCartItem[] {
    if (this.targetIds.value.length > 0) {
      let paymentCartItems = this.targetIds.value.map((s: string, index: number) => {
        let pricing = this.selectedPricings.value[index]

        if (!pricing) {
          return null
        }

        let item = new PaymentCartItem()
        item.targetType = this.target.value
        item.targetId = s
        item.discountAmount = this.discountAmount.value

        item.servicePricingId = pricing.id
        item.servicePricing = pricing

        item.setSubtotal()

        return item
      })

      if (paymentCartItems.length < this.selectedPricings.value.length) {
        let startIndex = paymentCartItems.length
        let otherPricings = this.selectedPricings.value.slice(startIndex)
        let otherPaymentCartItems = otherPricings.map((sp: ServicePricing) => {
          let item = new PaymentCartItem()
          item.targetType = this.target.value
          item.targetId = this.targetId.value
          item.discountAmount = this.discountAmount.value

          item.servicePricingId = sp.id
          item.servicePricing = sp

          item.setSubtotal()

          return item
        })

        paymentCartItems = paymentCartItems.concat(otherPaymentCartItems)
      }

      return paymentCartItems
        .filter((pci: PaymentCartItem | null) => {
          return pci !== null
        })
        .map((pci: PaymentCartItem | null) => {
          return new PaymentCartItem(pci)
        })
    }

    return this.selectedPricings.value.map((sp: ServicePricing) => {
      let item = new PaymentCartItem()
      item.targetType = this.target.value
      item.targetId = this.targetId.value
      item.discountAmount = this.discountAmount.value

      item.servicePricingId = sp.id
      item.servicePricing = sp

      item.setSubtotal()

      return item
    })
  }

  get paymentCartItem(): PaymentCartItem {
    let item = new PaymentCartItem()
    item.targetType = this.target.value
    item.targetId = this.targetId.value
    item.discountAmount = this.discountAmount.value

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
    return this.paymentCartItems.reduce((a: number, b: PaymentCartItem) => {
      return a + Number(b.subtotal)
    }, 0)
  }

  get paymentCart(): PaymentCart {
    let cart = new PaymentCart()
    cart.entityType = this.entityType.value
    cart.entityId = this.entityId.value
    cart.billingInfo = this.billingInfo.value
    cart.deliveryInfo = this.deliveryInfo.value
    cart.items = this.paymentCartItems
    cart.total = this.cartTotal

    return cart
  }

  get canProceed(): boolean {
    let areSelectedPricingValid = this.selectedPricings.value.every((sp: ServicePricing) => {
      // if custom
      if (StringUtil.isNullOrEmpty(sp.id)) {
        return sp.canSubmit()
      }

      return !StringUtil.isNullOrEmpty(sp.id)
    })

    let arePaymentNoticesValid = this.paymentNotices.every((pn: PaymentNotice) => {
      return pn.canSubmit()
    })

    return (
      !this.isFetchingServicePricings.value &&
      !this.isSubmitting.value &&
      this.selectedPricings.value.length > 0 &&
      areSelectedPricingValid &&
      this.paymentCart.canSubmit() &&
      arePaymentNoticesValid
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

  get grandTotal(): string {
    let totalPricings = this.selectedPricings.value.reduce((a: number, b: ServicePricing) => {
      return a + (Number(b.baseGrandTotal) + Number(b.config.handlingFees))
    }, 0)

    let finalPrice = totalPricings - this.discountAmount.value

    return NumberUtil.currency(finalPrice)
  }

  get editLabel(): string {
    if (this.language.isMalay()) {
      return this.isCustomPricing.value ? "Batal" : "Kemas Kini"
    }

    return this.isCustomPricing.value ? "Cancel Edit" : "Edit"
  }

  get canRemove(): boolean {
    return this.selectedPricings.value.length > 1 && this.indexOfPricingInEdit.value === null
  }

  get emailTitle(): string {
    return `[NOTICE] - Payment Order for ${this.entityName.value}`
  }

  get emailContent(): string {
    let greetings = this.emailRecipients.value.length > 1 ? "Directors" : "Director"

    return `
      <p>Dear ${greetings},</p>
      <p>Payment Order is ready for your settlement for the following:</p>
      <table>
        <tr>
          <td style="vertical-align: top;"><b>Application/Services</b></td>
          <td>:</td>
          <td>${this.paymentFor}</td>
        </tr>
        <tr>
          <td><b>Company Name</b></td>
          <td>:</td>
          <td>${this.entityName.value}</td>
        </tr>
        <tr>
          <td><b>Grand Total</b></td>
          <td>:</td>
          <td>${this.grandTotal}</td>
        </tr>
      </table>
      <p>Please <a target="_blank" style="font-weight: bold; text-decoration: none;" href="https://cosec.icompany.my">Login</a> to view the Payment Order in details and make payment.</p>
      <p>Thank You.</p>
    `
  }

  get paymentFor(): string {
    let names = this.selectedPricings.value.map((sp: ServicePricing) => {
      return sp.serviceName
    })

    return StringUtil.oxfordJoin("&", names)
  }

  get canNotify(): boolean {
    return this.emailRecipients.value.length > 0
  }
}
