import { Company } from "~/scripts/models/Company"
import { Filter } from "~/scripts/library/Filter"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"

export class AllController {
  tableDataFetcher = ref<TableDataFetcher<Company>>(new TableDataFetcher(Company, useCompanyStore()))

  language = useLanguage()

  filter = ref<Filter>(new Filter())

  emitEvents: any | null = null

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents

    this.tableDataFetcher.value.filter.take = 20
    this.tableDataFetcher.value.filter.takeAll = false
    this.tableDataFetcher.value.filter.orderBy = "name"
    this.tableDataFetcher.value.filter.sortOrder = "asec"

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

  async goToPage(page: number): Promise<void> {
    await this.tableDataFetcher.value.goToPage(page)
  }
}
