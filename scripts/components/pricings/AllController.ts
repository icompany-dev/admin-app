import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import type { ServicePricingBreakdown } from "~/scripts/models/ServicePricingBreakdown"
import type { ServicePricingMandatory } from "~/scripts/models/ServicePricingMandatory"
import type { ServicePricingOptional } from "~/scripts/models/ServicePricingOptional"
import { PropsServicePricingEditor } from "~/scripts/props/PropsServicePricingEditor"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { PricingDetail } from "~/scripts/types/pricings/PricingDetail"
import { NumberUtil } from "~/scripts/utils/Number"
import { StringUtil } from "~/scripts/utils/String"

export class AllController {
  tableDataFetcher = ref<TableDataFetcher<ServicePricing>>(
    new TableDataFetcher(ServicePricing, useServicePricingStore())
  )

  emitEvents: any | null = null

  language = useLanguage()

  servicePricingForEditor: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())

  editorRef: any | null = null

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents

    this.tableDataFetcher.value.filter.take = 10
    this.tableDataFetcher.value.filter.takeAll = false
    this.tableDataFetcher.value.filter.orderBy = "service_name"
    this.tableDataFetcher.value.filter.sortOrder = "asc"
    this.tableDataFetcher.value.filter.includeTestAccount = true

    this.tableDataFetcher.value.fetchData()
  }

  async setSearch(searchText: string): Promise<void> {
    this.tableDataFetcher.value.filter.searchText = searchText
    await this.tableDataFetcher.value.fetchData()
  }

  async setSortOrder(sortOrder: string): Promise<void> {
    this.tableDataFetcher.value.filter.sortOrder = sortOrder
    await this.tableDataFetcher.value.fetchData()
  }

  setEditorRef(editorRef: any): void {
    this.editorRef = editorRef
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
}
