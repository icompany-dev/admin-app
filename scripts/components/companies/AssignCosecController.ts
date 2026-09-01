import { Company } from "~/scripts/models/Company"
import { Filter } from "~/scripts/library/Filter"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { StringUtil } from "~/scripts/utils/String"

export class AssignCosecController {
  tableDataFetcher = ref<TableDataFetcher<Company>>(new TableDataFetcher(Company, useCompanyStore()))

  selectedCompanyId: Ref<string> = ref<string>("")

  language = useLanguage()

  filter = ref<Filter>(new Filter())

  emitEvents: any | null = null

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents

    this.init()
  }

  async init(): Promise<void> {
    this.tableDataFetcher.value.filter.take = 20
    this.tableDataFetcher.value.filter.takeAll = false
    this.tableDataFetcher.value.filter.orderBy = "name"
    this.tableDataFetcher.value.filter.sortOrder = "asc"

    await this.tableDataFetcher.value.fetchData()

    this.selectedCompanyId.value =
      this.tableDataFetcher.value.data.length > 0 ? this.tableDataFetcher.value.data[0].id : ""
  }

  async setSearch(searchText: string): Promise<void> {
    this.tableDataFetcher.value.filter.searchText = searchText
    await this.tableDataFetcher.value.fetchData()

    this.selectedCompanyId.value =
      this.tableDataFetcher.value.data.length > 0 ? this.tableDataFetcher.value.data[0].id : ""
  }

  async setSortOrder(sortOrder: string): Promise<void> {
    this.tableDataFetcher.value.filter.sortOrder = sortOrder
    await this.tableDataFetcher.value.fetchData()

    this.selectedCompanyId.value =
      this.tableDataFetcher.value.data.length > 0 ? this.tableDataFetcher.value.data[0].id : ""
  }

  async setIsIncludeDemo(isIncludeDemo: boolean): Promise<void> {
    this.tableDataFetcher.value.filter.includeTestAccount = isIncludeDemo
    await this.tableDataFetcher.value.fetchData()

    this.selectedCompanyId.value =
      this.tableDataFetcher.value.data.length > 0 ? this.tableDataFetcher.value.data[0].id : ""
  }

  async goToPage(page: number): Promise<void> {
    await this.tableDataFetcher.value.goToPage(page)
  }

  onCompanySelected(companyId: string): void {
    this.selectedCompanyId.value = companyId

    // let router = useRouter()
    // router.push(`/sdnbhds/${this.selectedCompanyId.value}`)
    //this.emitEvents("sdnbhdSelected")
  }

  onCompanyUnselected(): void {
    this.selectedCompanyId.value = ""
  }

  // getters
  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Sdn Bhd" : "Sdn Bhds"
  }

  get noRecordTitle(): string {
    return this.language.isMalay() ? `Tiada Syarikat Ditemui.` : `No Company Found`
  }

  get noRecordSubtitle(): string {
    if (!StringUtil.isNullOrEmpty(this.tableDataFetcher.value.filter.searchText)) {
      return this.language.isMalay()
        ? `Tiada syarikat ditemui dengan kata kunci tersebut.`
        : `Use a different keyword and search again.`
    }

    return this.language.isMalay()
      ? `Data akan dipaparkan apabila tersedia.`
      : `Data will appear once it becomes available.`
  }

  get tablePaginationProps(): PropsTablePagination {
    return new PropsTablePagination(this.tableDataFetcher.value.filter)
  }

  get isShowDocument(): boolean {
    return !StringUtil.isNullOrEmpty(this.selectedCompanyId.value)
  }
}
