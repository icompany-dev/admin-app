import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { Toast } from "~/scripts/library/Toast"
import { Label } from "~/scripts/models/Label"
import { LabelItem } from "~/scripts/models/LabelItem"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import type { ServicePricingBreakdown } from "~/scripts/models/ServicePricingBreakdown"
import type { ServicePricingMandatory } from "~/scripts/models/ServicePricingMandatory"
import type { ServicePricingOptional } from "~/scripts/models/ServicePricingOptional"
import { PropsGroupedServicePricing } from "~/scripts/props/PropsGroupedServicePricing"
import { PropsServicePricingEditor } from "~/scripts/props/PropsServicePricingEditor"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { SelectOption } from "~/scripts/types/SelectOption"
import { PricingDetail } from "~/scripts/types/pricings/PricingDetail"
import { NumberUtil } from "~/scripts/utils/Number"
import { StringUtil } from "~/scripts/utils/String"

export class AllController {
  labels: Ref<Label[]> = ref<Label[]>([])
  labelAndItems: Ref<Record<string, LabelItem[]>> = ref<Record<string, LabelItem[]>>({})
  labelAndPricings: Ref<Record<string, LabelItem[]>> = ref<Record<string, LabelItem[]>>({})

  tableDataFetcher = ref<TableDataFetcher<ServicePricing>>(
    new TableDataFetcher(ServicePricing, useServicePricingStore())
  )

  emitEvents: any | null = null

  language = useLanguage()

  servicePricingForEditor: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())
  servicePricingIdToRemove: Ref<string> = ref<string>("")

  editorRef: any | null = null
  confirmToDeleteRef: any | null = null
  confirmToDeleteLabelRef: any | null = null
  groupedThemeRef: any | null = null

  isFetchingLabels: Ref<boolean> = ref<boolean>(false)
  isRemoving: Ref<boolean> = ref<boolean>(false)

  selectedLabelIdToExpand: Ref<string> = ref<string>("")

  isAddingNewLabel: Ref<boolean> = ref<boolean>(false)
  isSubmittingNewLabel: Ref<boolean> = ref<boolean>(false)
  newLabel: Ref<Label> = ref<Label>(new Label())
  labelToDelete: Ref<Label> = ref<Label>(new Label())

  //new label items
  labelToAddItemsTo: Ref<Label> = ref<Label>(new Label())
  isAddingItemsToLabel: Ref<boolean> = ref<boolean>(false)
  labelItems: Ref<LabelItem[]> = ref<LabelItem[]>([])
  isSubmittingNewItemsToLabel: Ref<boolean> = ref<boolean>(false)

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents

    this.tableDataFetcher.value.filter.take = 10
    this.tableDataFetcher.value.filter.takeAll = true
    this.tableDataFetcher.value.filter.orderBy = "service_name"
    this.tableDataFetcher.value.filter.sortOrder = "asc"
    this.tableDataFetcher.value.filter.includeTestAccount = true

    this.tableDataFetcher.value.fetchData()

    this.fetchLabels()
  }

  async setSearch(searchText: string): Promise<void> {
    this.tableDataFetcher.value.filter.searchText = searchText
    // await this.tableDataFetcher.value.fetchData()
  }

  async setSortOrder(sortOrder: string): Promise<void> {
    this.tableDataFetcher.value.filter.sortOrder = sortOrder
    // await this.tableDataFetcher.value.fetchData()
  }

  setEditorRef(editorRef: any): void {
    this.editorRef = editorRef
  }

  setConfirmToDeleteRef(confirmToDeleteRef: any): void {
    this.confirmToDeleteRef = confirmToDeleteRef
  }

  setConfirmToDeleteLabelRef(confirmToDeleteLabelRef: any): void {
    this.confirmToDeleteLabelRef = confirmToDeleteLabelRef
  }

  setGroupedThemeRef(groupedThemeRef: any): void {
    this.groupedThemeRef = groupedThemeRef
  }

  async fetchLabels(): Promise<void> {
    if (this.isFetchingLabels.value) {
      return
    }

    this.labels.value = []

    this.isFetchingLabels.value = true

    try {
      let repository = useLabelStore()
      let filter = new Filter()
      filter.takeAll = true
      let response = await repository.fetchAll(filter)

      let unclassifiedLabels = response.data.map((d: any) => {
        return new Label(d)
      })

      let promises = unclassifiedLabels.map((d: Label) => {
        return repository.fetchItemsForLabel(d.id).then((r) => {
          if (!r.data || r.data.length <= 0) {
            this.labels.value.push(d)
            this.labelAndPricings.value[d.id] = []
            return
          }

          let items = r.data
            .map((t: any) => {
              return new LabelItem(t)
            })
            .filter((item: LabelItem) => {
              return item.targetType === "service_pricing" || item.targetType === "ServicePricing"
            })

          if (items.length <= 0) {
            return
          }

          this.labelAndPricings.value[d.id] = items
        })
      })

      await Promise.all(promises)
    } catch (e) {
      //
    } finally {
      this.isFetchingLabels.value = false
    }
  }

  getPricingsUnderLabel(label: Label): ServicePricing[] {
    let labelItems = this.labelAndPricings.value[label.id] ?? []

    return this.tableDataFetcher.value.data.filter((sp: ServicePricing) => {
      return labelItems.some((li: LabelItem) => {
        return li.targetId === sp.id
      })
    })
  }

  getGrandTotal(servicePricing: ServicePricing): string {
    let total = Number(servicePricing.baseGrandTotal) + Number(servicePricing.config.handlingFees)
    return NumberUtil.currency(total)
  }

  getPricingDetails(servicePricing: ServicePricing): PricingDetail[] {
    let details: PricingDetail[] = []

    servicePricing.breakdowns.forEach((spb: ServicePricingBreakdown) => {
      details.push(new PricingDetail(spb.itemName, spb.price))
    })

    servicePricing.mandatoryServices.forEach((spm: ServicePricingMandatory) => {
      details.push(
        new PricingDetail(
          spm.mandatoryServicePrice.serviceName,
          spm.basePrice ?? spm.mandatoryServicePrice.baseGrandTotal
        )
      )
    })

    return details
  }

  getPricingOptionalDetails(servicePricing: ServicePricing): PricingDetail[] {
    let details: PricingDetail[] = []

    servicePricing.optionals.forEach((spo: ServicePricingOptional) => {
      details.push(new PricingDetail(spo.optionalServicePrice.serviceName, spo.optionalServicePrice.baseGrandTotal))
    })

    return details
  }

  getConfigurationDetails(servicePricing: ServicePricing): PricingDetail[] {
    let details: PricingDetail[] = [
      new PricingDetail("Cosec Service Fee", servicePricing.config.cosecServiceFee),
      new PricingDetail("Digital Service Fee", servicePricing.config.digitalServiceFee),
      new PricingDetail("Handling Fees", servicePricing.config.handlingFees),
    ]

    return details
  }

  hasPricingDetails(servicePricing: ServicePricing): boolean {
    return this.getPricingDetails(servicePricing).length > 0
  }

  hasPricingOptionalDetails(servicePricing: ServicePricing): boolean {
    return this.getPricingOptionalDetails(servicePricing).length > 0
  }

  hasPricingConfigurations(servicePricing: ServicePricing): boolean {
    return this.getConfigurationDetails(servicePricing).length > 0
  }

  hasPricingBreakdowns(servicePricing: ServicePricing): boolean {
    return (
      this.hasPricingDetails(servicePricing) ||
      this.hasPricingOptionalDetails(servicePricing) ||
      this.hasPricingConfigurations(servicePricing)
    )
  }

  onViewClicked(servicePricing: ServicePricing): void {
    this.servicePricingForEditor.value = new ServicePricing(servicePricing)

    if (this.editorRef) {
      this.editorRef.show()
    }
  }

  addNewPricing(): void {
    this.servicePricingForEditor.value = new ServicePricing()

    if (this.editorRef) {
      this.editorRef.show()
    }
  }

  async onPricingUpdated(): Promise<void> {
    await this.tableDataFetcher.value.fetchData()
  }

  onRemoveClicked(servicePricing: ServicePricing): void {
    this.servicePricingIdToRemove.value = servicePricing.id

    if (this.confirmToDeleteRef) {
      this.confirmToDeleteRef.show()
    }
  }

  async onProceedRemove(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.servicePricingIdToRemove.value) || this.isRemoving.value) {
      return
    }

    try {
      this.isRemoving.value = true

      let repository = useServicePricingStore()
      await repository.remove(this.servicePricingIdToRemove.value)

      let toastTitle = this.language.isMalay() ? "Harga telah dipadamkan." : "The Pricing is removed."
      let toastMessage = this.language.isMalay()
        ? "Sila tunggu sebentar sementara kami muat semula senarai ini."
        : "Please wait while we refresh the list."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      this.tableDataFetcher.value.fetchData()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.servicePricingIdToRemove.value = ""
      this.isRemoving.value = false
    }
  }

  onAddNewLabelClicked(): void {
    this.newLabel.value = new Label()
    this.isAddingNewLabel.value = true
  }

  onCancelAddNewLabel(): void {
    this.isAddingNewLabel.value = false
    this.newLabel.value = new Label()
  }

  async onProceedAddNewLabel(): Promise<void> {
    if (this.isSubmittingNewLabel.value) {
      return
    }

    this.isSubmittingNewLabel.value = true
    try {
      await this.newLabel.value.create(useLabelStore())

      this.labels.value.push(new Label(this.newLabel.value))
      this.labelAndPricings.value[this.newLabel.value.id] = []

      let toastTitle = this.language.isMalay() ? "Tema Baharu telah ditambah." : "The New Theme is added."
      let toastMessage = this.language.isMalay()
        ? "Anda boleh tambah item ke dalam Tema baharu."
        : "You can add items to the Theme."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      this.isAddingNewLabel.value = false
      this.newLabel.value = new Label()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isSubmittingNewLabel.value = false
    }
  }

  onRemoveLabel(label: Label): void {
    this.labelToDelete.value = new Label(label)

    if (this.confirmToDeleteLabelRef) {
      this.confirmToDeleteLabelRef.show()
    }
  }

  async onProceedRemoveLabel(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.labelToDelete.value.id)) {
      return
    }

    try {
      this.labels.value = this.labels.value.filter((l: Label) => {
        return l.id !== this.labelToDelete.value.id
      })

      await this.labelToDelete.value.remove(useLabelStore())

      let toastTitle = this.language.isMalay() ? "Tema telah dipadamkan." : "The Theme is removed."
      let toastMessage = this.language.isMalay() ? "" : ""
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {}
  }

  onLabelClicked(label: Label): void {
    if (this.isLabelExpanded(label)) {
      this.selectedLabelIdToExpand.value = ""
      return
    }

    this.selectedLabelIdToExpand.value = label.id
  }

  isLabelExpanded(label: Label): boolean {
    return this.selectedLabelIdToExpand.value === label.id
  }

  isAddingPricing(label: Label): boolean {
    return this.labelToAddItemsTo.value.id === label.id
  }

  onAddPricingClicked(label: Label): void {
    this.labelToAddItemsTo.value = new Label(label)

    if (this.groupedThemeRef) {
      this.groupedThemeRef.show()
    }
    // if (!this.isAddingItemsToLabel.value || this.labelToAddItemsTo.value.id !== label.id) {
    //   this.labelToAddItemsTo.value = new Label(label)
    //   this.labelItems.value = []
    //   this.isAddingItemsToLabel.value = true
    //   this.isSubmittingNewItemsToLabel.value = false
    // }

    // this.labelItems.value.push(new LabelItem())
  }

  onCancelAddPricingClicked(): void {
    this.labelToAddItemsTo.value = new Label()
    this.labelItems.value = []
    this.isAddingItemsToLabel.value = false
    this.isSubmittingNewItemsToLabel.value = false
  }

  onSelectedServicePricingForLabelItem(selectedServicePricingId: string, index: number): void {
    let labelItem = this.labelItems.value[index] ?? null
    if (!labelItem) {
      return
    }

    let servicePricing = this.tableDataFetcher.value.data.find((sp: ServicePricing) => {
      return sp.id === selectedServicePricingId
    })

    if (!servicePricing) {
      return
    }

    labelItem.labelId = this.labelToAddItemsTo.value.id
    labelItem.targetType = "service_pricing"
    labelItem.targetId = servicePricing.id
  }

  onRemoveServicePricingFromLabelItem(index: number): void {
    this.labelItems.value.splice(index, 1)
  }

  getSelectedPricingNameForLabelItem(index: number): string {
    let labelItem = this.labelItems.value[index] ?? null
    if (!labelItem) {
      return "Select One"
    }

    let servicePricing = this.tableDataFetcher.value.data.find((sp: ServicePricing) => {
      return sp.id === labelItem.targetId
    })

    return servicePricing?.serviceName ?? "Select Name"
  }

  getSelectedPricingPriceForLabelItem(index: number): string {
    let labelItem = this.labelItems.value[index] ?? null
    if (!labelItem) {
      return "0.00"
    }

    let servicePricing =
      this.tableDataFetcher.value.data.find((sp: ServicePricing) => {
        return sp.id === labelItem.targetId
      }) ?? null

    if (!servicePricing) {
      return "0.00"
    }

    return NumberUtil.currency(Number(servicePricing.baseGrandTotal) + Number(servicePricing.config.handlingFees))
  }

  onRemoveLabelItem(): void {
    // need confirm delete
  }

  get servicePricingOptions(): SelectOption[] {
    return this.tableDataFetcher.value.data.map((sp: ServicePricing) => {
      return new SelectOption(sp.id, sp.id, sp.serviceName)
    })
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Senarai Harga" : "Set Pricings"
  }

  get noRecordTitle(): string {
    return this.language.isMalay() ? `Tiada Harga Ditemui.` : `No Pricing Found`
  }

  get noRecordSubtitle(): string {
    if (!StringUtil.isNullOrEmpty(this.tableDataFetcher.value.filter.searchText)) {
      return this.language.isMalay() ? `Cuba dengan kata kunci lain.` : `Use a different keyword and search again.`
    }

    return this.language.isMalay()
      ? `Data akan dipaparkan apabila tersedia.`
      : `Data will appear once it becomes available.`
  }

  get tablePaginationProps(): PropsTablePagination {
    return new PropsTablePagination(this.tableDataFetcher.value.filter)
  }

  get viewButtonLabel(): string {
    return this.language.isMalay() ? "Lihat" : "View"
  }

  get removeButtonLabel(): string {
    return this.language.isMalay() ? "Padam" : "Remove"
  }

  get grandTotalLabel(): string {
    return this.language.isMalay() ? "Jumlah Keseluruhan" : "Grand Total"
  }

  get editorProps(): PropsServicePricingEditor {
    return new PropsServicePricingEditor(this.servicePricingForEditor.value)
  }

  get itemToRemoveName(): string {
    return this.language.isMalay() ? "Harga" : "Pricing"
  }

  get itemToRemoveLabelName(): string {
    return this.language.isMalay() ? "Tema" : "Theme"
  }

  get isRetrievingData(): boolean {
    return this.isFetchingLabels.value || this.tableDataFetcher.value.isLoading
  }

  get groupedServicePricingProps(): PropsGroupedServicePricing {
    let labelItems = this.labelAndPricings.value[this.labelToAddItemsTo.value.id] ?? []

    return new PropsGroupedServicePricing(this.labelToAddItemsTo.value, labelItems, this.tableDataFetcher.value.data)
  }
}
