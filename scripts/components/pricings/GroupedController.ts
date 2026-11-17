import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { Toast } from "~/scripts/library/Toast"
import { Label } from "~/scripts/models/Label"
import { LabelItem } from "~/scripts/models/LabelItem"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import type { PropsGroupedServicePricing } from "~/scripts/props/PropsGroupedServicePricing"
import { PropsPricing } from "~/scripts/props/PropsPricing"
import { SelectOption } from "~/scripts/types/SelectOption"
import { NumberUtil } from "~/scripts/utils/Number"
import { ObjectUtil } from "~/scripts/utils/Object"
import { StringUtil } from "~/scripts/utils/String"

export class GroupedController {
  label: Ref<Label> = ref<Label>(new Label())
  existingLabelItems: Ref<LabelItem[]> = ref<LabelItem[]>([])
  // servicePricings: Ref<ServicePricing[]> = ref<ServicePricing[]>([])
  allServicePricings: Ref<ServicePricing[]> = ref<ServicePricing[]>([])

  isAddingItemsToLabel: Ref<boolean> = ref<boolean>(false)
  labelItems: Ref<LabelItem[]> = ref<LabelItem[]>([])
  isSubmittingNewItemsToLabel: Ref<boolean> = ref<boolean>(false)

  labelItemToRemove: Ref<LabelItem> = ref<LabelItem>(new LabelItem())

  emitEvents: any | null = null
  confirmToDeleteRef: any | null = null

  language = useLanguage()

  isShowing: Ref<boolean> = ref<boolean>(false)
  isFetchingPricings: Ref<boolean> = ref<boolean>(false)

  searchTexts: Ref<string[]> = ref<string[]>([])

  constructor(props: PropsGroupedServicePricing, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)

    this.init()
  }

  async init(): Promise<void> {
    if (this.isFetchingPricings.value) {
      return
    }

    this.allServicePricings.value = []
    this.isFetchingPricings.value = true

    try {
      let repository = useServicePricingStore()
      let filter = new Filter()
      filter.takeAll = true

      let response = await repository.fetchAll(filter)
      let unorderedPricings = response.data
        .map((d: any) => {
          return new ServicePricing(d)
        })
        .filter((sp: ServicePricing) => {
          return sp.mandatoryServices.length > 0
        })

      this.allServicePricings.value = ObjectUtil.sort<ServicePricing>(unorderedPricings, "serviceName", "asc")
    } catch (e) {
      //
    } finally {
      this.isFetchingPricings.value = false
    }
  }

  setDataFromProps(props: PropsGroupedServicePricing): void {
    this.label.value = new Label(props.label)
    this.existingLabelItems.value = props.labelItems.map((li: LabelItem) => {
      return new LabelItem(li)
    })
  }

  setConfirmToDeleteRef(confirmToDeleteRef: any): void {
    this.confirmToDeleteRef = confirmToDeleteRef
  }

  show(): void {
    this.labelItems.value = []
    this.isAddingItemsToLabel.value = false
    this.isSubmittingNewItemsToLabel.value = false
    this.searchTexts.value = []

    this.isShowing.value = true
  }

  hide(): void {
    this.labelItems.value = []
    this.isAddingItemsToLabel.value = false
    this.isSubmittingNewItemsToLabel.value = false

    this.isShowing.value = false

    this.emitEvents("hide")
  }

  onAddNew(): void {
    this.hide()
    this.emitEvents("add-pricing")
  }

  onCancelClicked(): void {
    this.hide()
  }

  async onProceedClicked(): Promise<void> {
    if (this.isSubmittingNewItemsToLabel.value) {
      return
    }

    try {
      this.isSubmittingNewItemsToLabel.value = true

      let promises = this.labelItems.value.map((li: LabelItem) => {
        return li.addItem(useLabelStore())
      })

      if (promises.length > 0) {
        await Promise.all(promises)
      }

      let toastTitle = ""
      let toastMessage = ""
      if (this.labelItems.value.length > 0) {
        let itemsString = this.labelItems.value.length > 1 ? "Applications are" : "Application is"
        toastTitle = this.language.isMalay() ? "Item ditambah ke Tema." : `The ${itemsString} added to the Module.`
        toastMessage = this.language.isMalay() ? "" : ""
      } else {
        toastTitle = this.language.isMalay() ? "Maklumat telah dikemaskini." : "Your changes is recorded."
      }

      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      this.emitEvents("applicationsAdded", this.labelItems.value)

      this.hide()
    } catch (e) {
      console.error(e)
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isSubmittingNewItemsToLabel.value = false
    }
  }

  onAddPricingClicked(): void {
    let newItem = new LabelItem()
    newItem.label = new Label(this.label.value)
    newItem.labelId = this.label.value.id
    newItem.targetType = "service_pricing"
    this.labelItems.value.push(newItem)
    this.searchTexts.value.push("")
  }

  onRemoveFromAddToTheme(index: number): void {
    this.labelItems.value.splice(index, 1)
    this.searchTexts.value.splice(index, 1)
  }

  getPricingOptions(index: number): SelectOption[] {
    let searchText = this.searchTexts.value[index] ?? ""

    return this.servicePricingOptions.filter((option: SelectOption) => {
      if (StringUtil.isNullOrEmpty(searchText)) {
        return true
      }

      return StringUtil.contains(option.label, searchText)
    })
  }

  onSearch(searchText: string, index: number): void {
    // if (!this.searchTexts.value[index]) {
    //   return
    // }

    this.searchTexts.value[index] = searchText
  }

  onSelectedPricingId(pricingId: string, index: number): void {
    let labelItem = this.labelItems.value[index] ?? null
    if (!labelItem) {
      return
    }

    labelItem.targetId = pricingId
  }

  getSelectedServicePricingName(index: number): string {
    if (this.isFetchingPricings.value) {
      return "Loading..."
    }

    let labelItem = this.labelItems.value[index] ?? null
    if (!labelItem || StringUtil.isNullOrEmpty(labelItem.targetId)) {
      return "Select One"
    }

    let servicePricing = this.allServicePricings.value.find((sp: ServicePricing) => {
      return sp.id === labelItem.targetId
    })

    return servicePricing?.serviceName ?? "Select One"
  }

  getSelectedServicePricingPrice(index: number): string {
    let labelItem = this.labelItems.value[index] ?? null
    if (!labelItem || StringUtil.isNullOrEmpty(labelItem.targetId)) {
      return "0.00"
    }

    let servicePricing = this.allServicePricings.value.find((sp: ServicePricing) => {
      return sp.id === labelItem.targetId
    })

    if (!servicePricing) {
      return "0.00"
    }

    return NumberUtil.currency(Number(servicePricing.baseGrandTotal) + Number(servicePricing.config.handlingFees))
  }

  getSelectedPricingFor(index: number): ServicePricing | null {
    let labelItem = this.labelItems.value[index] ?? null
    if (!labelItem || StringUtil.isNullOrEmpty(labelItem.targetId)) {
      return null
    }

    let servicePricing =
      this.allServicePricings.value.find((sp: ServicePricing) => {
        return sp.id === labelItem.targetId
      }) ?? null

    return servicePricing
  }

  getPropsPricingFor(index: number): PropsPricing {
    let servicePricing = this.getSelectedPricingFor(index)

    return new PropsPricing(servicePricing ?? new ServicePricing(), false)
  }

  onRemoveLabelItem(labelItem: LabelItem): void {
    this.labelItemToRemove.value = new LabelItem(labelItem)

    if (this.confirmToDeleteRef) {
      this.confirmToDeleteRef.show()
    }
  }

  getServicePricing(labelItem: LabelItem): ServicePricing {
    let servicePricing = this.allServicePricings.value.find((sp: ServicePricing) => {
      return sp.id === labelItem.targetId
    })

    return servicePricing ?? new ServicePricing()
  }

  getServicePricingName(labelItem: LabelItem): string {
    return this.getServicePricing(labelItem).serviceName
  }

  getServicePricingPrice(labelItem: LabelItem): string {
    let servicePricing = this.getServicePricing(labelItem)
    if (StringUtil.isNullOrEmpty(servicePricing.id)) {
      return ""
    }

    return NumberUtil.currency(Number(servicePricing.baseGrandTotal) + Number(servicePricing.config.handlingFees))
  }

  async onProceedToRemoveLabelItem(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.labelItemToRemove.value.id)) {
      return
    }

    try {
      this.existingLabelItems.value = this.existingLabelItems.value.filter((li: LabelItem) => {
        return li.id !== this.labelItemToRemove.value.id
      })

      this.emitEvents("applicationRemoved", this.labelItemToRemove.value.id)

      await this.labelItemToRemove.value.deleteItem(useLabelStore())

      let toastTitle = this.language.isMalay()
        ? "Aplikasi telah dikeluarkan dari Modul."
        : "Application is removed from the Module."
      let toast = new Toast(toastTitle, "")
      toast.success()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    }
  }

  get canProceed(): boolean {
    if (this.labelItems.value.length <= 0) {
      return true
    }

    return this.labelItems.value.every((li: LabelItem) => {
      return li.canSubmit()
    })
  }

  get itemRemoveName(): string {
    return "Item"
  }

  get servicePricingOptions(): SelectOption[] {
    return this.allServicePricings.value.map((sp: ServicePricing) => {
      return new SelectOption(sp.id, sp.id, sp.serviceName)
    })
  }

  get heading(): string {
    return this.language.isMalay()
      ? `Aplikasi bawah ${this.label.value.name}`
      : `Applications for ${this.label.value.name}`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get cancelLabel(): string {
    return this.language.isMalay() ? "Batal" : "Cancel"
  }

  get proceedLabel(): string {
    return this.language.isMalay() ? "Teruskan" : "Proceed"
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Populating the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Aplikasi" : "Applications"
  }
}
