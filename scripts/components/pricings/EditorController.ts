import { Filter } from "~/scripts/library/Filter"
import { Toast } from "~/scripts/library/Toast"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { ServicePricingBreakdown } from "~/scripts/models/ServicePricingBreakdown"
import { ServicePricingMandatory } from "~/scripts/models/ServicePricingMandatory"
import { ServicePricingOptional } from "~/scripts/models/ServicePricingOptional"
import { SelectOption } from "~/scripts/types/SelectOption"
import { NumberUtil } from "~/scripts/utils/Number"
import { ObjectUtil } from "~/scripts/utils/Object"
import { StringUtil } from "~/scripts/utils/String"

export class EditorController {
  servicePricing: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())

  language = useLanguage()

  isShowing: Ref<boolean> = ref<boolean>(false)
  isFetchingPricings: Ref<boolean> = ref<boolean>(false)
  isSubmitting: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  servicePricings: Ref<ServicePricing[]> = ref<ServicePricing[]>([])

  mandatorySearchTexts: Ref<string[]> = ref<string[]>([])
  optionalSearchTexts: Ref<string[]> = ref<string[]>([])

  constructor(servicePricing: ServicePricing, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setServicePricing(servicePricing)

    this.fetchServicePricings()
  }

  setServicePricing(servicePricing: ServicePricing): void {
    this.servicePricing.value = new ServicePricing(servicePricing)

    if (this.servicePricing.value.breakdowns.length <= 0) {
      this.servicePricing.value.breakdowns.push(new ServicePricingBreakdown())
    }
  }

  async fetchServicePricings(): Promise<void> {
    if (this.isFetchingPricings.value) {
      return
    }

    this.servicePricings.value = []

    try {
      this.isFetchingPricings.value = true

      let repository = useServicePricingStore()
      let filter = new Filter()
      filter.takeAll = true

      let response = await repository.fetchAll(filter)

      let unorderedData = response.data.map((d: any) => {
        return new ServicePricing(d)
      })

      this.servicePricings.value = ObjectUtil.sort<ServicePricing>(unorderedData, "serviceName", "asc")
    } catch (e) {
      //
    } finally {
      this.isFetchingPricings.value = false
    }
  }

  show(): void {
    this.isShowing.value = true
  }

  hide(): void {
    this.isShowing.value = false
  }

  onBreakdownPriceChanged(index: number): void {
    let breakdown = this.servicePricing.value.breakdowns[index] ?? ""
    if (breakdown.price < 0) {
      breakdown.price = 0
    }
  }

  addMandatory(): void {
    this.servicePricing.value.mandatoryServices.push(new ServicePricingMandatory())
    this.mandatorySearchTexts.value.push("")
  }

  async removeMandatory(mandatoryPricing: ServicePricingMandatory, index: number): Promise<void> {
    this.servicePricing.value.mandatoryServices.splice(index, 1)
    this.mandatorySearchTexts.value.splice(index, 1)

    if (!StringUtil.isNullOrEmpty(mandatoryPricing.id)) {
      let repository = useServicePricingStore()
      repository.removeMandatory(mandatoryPricing.id)
    }
  }

  onSeearchMandatory(searchText: string, index: number): void {
    this.mandatorySearchTexts.value[index] = searchText
  }

  getMandatoryPricingOptions(index: number): SelectOption[] {
    if (this.isFetchingPricings.value) {
      return [new SelectOption("", "", "Loading...", false)]
    }

    let searchText = this.mandatorySearchTexts.value[index] ?? ""

    return this.servicePricings.value
      .filter((sp: ServicePricing) => {
        if (StringUtil.isNullOrEmpty(searchText)) {
          return true
        }

        return StringUtil.contains(sp.serviceName, searchText)
      })
      .map((sp: ServicePricing) => {
        let total = Number(sp.baseGrandTotal) + Number(sp.config.handlingFees)

        return new SelectOption(sp.id, sp.id, `${sp.serviceName} (RM ${NumberUtil.currency(total)})`)
      })
  }

  getSelectedMandatoryItemName(mandatoryPricing: ServicePricingMandatory): string {
    return mandatoryPricing.mandatoryServicePrice.serviceName
  }

  onMandatoryPricingSelected(pricingId: string, index: number): void {
    let servicePricing = this.servicePricings.value.find((sp: ServicePricing) => {
      return sp.id === pricingId
    })

    if (!this.servicePricing.value.mandatoryServices[index] || !servicePricing) {
      return
    }

    this.servicePricing.value.mandatoryServices[index].mandatoryServiceId = pricingId
    this.servicePricing.value.mandatoryServices[index].mandatoryServicePrice = new ServicePricing(servicePricing)
    this.servicePricing.value.mandatoryServices[index].basePrice =
      Number(servicePricing.baseGrandTotal) + Number(servicePricing.config.handlingFees)
  }

  addOptional(): void {
    this.servicePricing.value.optionals.push(new ServicePricingOptional())
  }

  async removeOptional(optional: ServicePricingOptional, index: number): Promise<void> {
    this.servicePricing.value.optionals.splice(index, 1)

    if (!StringUtil.isNullOrEmpty(optional.id)) {
      let repository = useServicePricingStore()
      repository.removeOptional(optional.id)
    }
  }

  onSeearchOptional(searchText: string, index: number): void {
    this.optionalSearchTexts.value[index] = searchText
  }

  getOptionalPricingOptions(index: number): SelectOption[] {
    if (this.isFetchingPricings.value) {
      return [new SelectOption("", "", "Loading...", false)]
    }

    let searchText = this.optionalSearchTexts.value[index] ?? ""

    return this.servicePricings.value
      .filter((sp: ServicePricing) => {
        if (StringUtil.isNullOrEmpty(searchText)) {
          return true
        }

        return StringUtil.contains(sp.serviceName, searchText)
      })
      .map((sp: ServicePricing) => {
        let total = Number(sp.baseGrandTotal) + Number(sp.config.handlingFees)

        return new SelectOption(sp.id, sp.id, `${sp.serviceName} (RM ${NumberUtil.currency(total)})`)
      })
  }

  getSelectedOptionalItemName(optionalPricing: ServicePricingOptional): string {
    return optionalPricing.optionalServicePrice.serviceName
  }

  onOptionalPricingSelected(pricingId: string, index: number): void {
    let servicePricing = this.servicePricings.value.find((sp: ServicePricing) => {
      return sp.id === pricingId
    })

    if (!this.servicePricing.value.optionals[index] || !servicePricing) {
      return
    }

    this.servicePricing.value.optionals[index].optionalServiceId = pricingId
    this.servicePricing.value.optionals[index].optionalServicePrice = new ServicePricing(servicePricing)
  }

  getOptionalBasePrice(optional: ServicePricingOptional): string {
    let price =
      Number(optional.optionalServicePrice.baseGrandTotal) + Number(optional.optionalServicePrice.config.handlingFees)

    return NumberUtil.currency(price)
  }

  onCosecServiceFeeChanged(): void {
    this.servicePricing.value.config.cosecServiceFee = Number(this.servicePricing.value.config.cosecServiceFee)
    if (this.servicePricing.value.config.cosecServiceFee < 0) {
      this.servicePricing.value.config.cosecServiceFee = 0
    }
    this.servicePricing.value.config.isCosecServiceFeeMandatory = this.servicePricing.value.config.cosecServiceFee > 0
  }

  onDigitalServiceFeeChanged(): void {
    this.servicePricing.value.config.digitalServiceFee = Number(this.servicePricing.value.config.digitalServiceFee)
    if (this.servicePricing.value.config.digitalServiceFee < 0) {
      this.servicePricing.value.config.digitalServiceFee = 0
    }
    this.servicePricing.value.config.isDsfMandatory = this.servicePricing.value.config.digitalServiceFee > 0
  }

  onHandlingFeesChanged(): void {
    this.servicePricing.value.config.handlingFees = Number(this.servicePricing.value.config.handlingFees)
    if (this.servicePricing.value.config.handlingFees < 0) {
      this.servicePricing.value.config.handlingFees = 0
    }
    this.servicePricing.value.config.isDsfMandatory = this.servicePricing.value.config.handlingFees > 0
  }

  onCancelClicked(): void {
    this.servicePricing.value = new ServicePricing()
    this.hide()
  }

  async onSubmitClicked(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      this.servicePricing.value.baseGrandTotal = this.baseGrandTotal

      let toastTitle = this.language.isMalay() ? "Harga baharu telah ditambah." : "New Pricing is added."
      if (StringUtil.isNullOrEmpty(this.servicePricing.value.id)) {
        await this.servicePricing.value.create(useServicePricingStore())
      } else {
        await this.servicePricing.value.update(useServicePricingStore())
        toastTitle = this.language.isMalay() ? "Maklumat telah dikemaskini." : "Your changes have been recorded."
      }

      this.emitEvents("updated", this.servicePricing.value)

      let toast = new Toast(toastTitle, "")
      toast.success()

      this.hide()
    } catch (e) {
      //
    } finally {
      this.isSubmitting.value = false
    }
  }

  get heading(): string {
    let action = StringUtil.isNullOrEmpty(this.servicePricing.value.id)
      ? this.language.isMalay()
        ? "Tambah"
        : "Add"
      : this.language.isMalay()
        ? "Kemas Kini"
        : "Edit"

    return this.language.isMalay() ? `${action} Harga` : `${action} Pricing`
  }

  get proceedLabel(): string {
    return this.language.isMalay() ? "Teruskan" : "Proceed"
  }

  get cancelLabel(): string {
    return this.language.isMalay() ? "Batal" : "Cancel"
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get canProceed(): boolean {
    return this.servicePricing.value.canSubmit()
  }

  get baseGrandTotal(): number {
    let totalBreakdowns = this.servicePricing.value.breakdowns.reduce((a, b) => {
      return a + Number(b.price)
    }, 0)
    let totalMandatories = this.servicePricing.value.mandatoryServices.reduce((a, b) => {
      return a + Number(b.basePrice)
    }, 0)
    let baseGrandTotal =
      totalBreakdowns +
      totalMandatories +
      Number(this.servicePricing.value.config.cosecServiceFee) +
      Number(this.servicePricing.value.config.digitalServiceFee)

    return baseGrandTotal
  }

  get pricingTotal(): string {
    let total = this.baseGrandTotal + Number(this.servicePricing.value.config.handlingFees)

    return NumberUtil.currency(total)
  }
}
