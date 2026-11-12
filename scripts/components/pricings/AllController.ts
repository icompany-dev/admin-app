import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { NumberUtil } from "~/scripts/utils/Number"
import { StringUtil } from "~/scripts/utils/String"

export class AllController {
  tableDataFetcher = ref<TableDataFetcher<ServicePricing>>(
    new TableDataFetcher(ServicePricing, useServicePricingStore())
  )

  emitEvents: any | null = null

  language = useLanguage()

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

  getGrandTotal(servicePricing: ServicePricing): string {
    let total = Number(servicePricing.baseGrandTotal) + Number(servicePricing.config.handlingFees)
    return NumberUtil.currency(total)
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
}
