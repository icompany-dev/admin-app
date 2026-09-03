import { Company } from "~/scripts/models/Company"
import { Filter } from "~/scripts/library/Filter"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { StringUtil } from "~/scripts/utils/String"

export class AllController {
  tableDataFetcher = ref<TableDataFetcher<Company>>(new TableDataFetcher(Company, useCompanyStore()))

  selectedCompanyId: Ref<string> = ref<string>("")

  language = useLanguage()

  filter = ref<Filter>(new Filter())

  emitEvents: any | null = null

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents

    this.tableDataFetcher.value.filter.take = 20
    this.tableDataFetcher.value.filter.takeAll = false
    this.tableDataFetcher.value.filter.orderBy = "name"
    this.tableDataFetcher.value.filter.sortOrder = "asc"

    this.fetchData()
  }

  async setSearch(searchText: string): Promise<void> {
    this.tableDataFetcher.value.filter.searchText = searchText
    await this.fetchData()
  }

  async setSortOrder(sortOrder: string): Promise<void> {
    this.tableDataFetcher.value.filter.sortOrder = sortOrder
    await this.fetchData()
  }

  async setIsIncludeDemo(isIncludeDemo: boolean): Promise<void> {
    this.tableDataFetcher.value.filter.includeTestAccount = isIncludeDemo
    await this.fetchData()
  }

  async goToPage(page: number): Promise<void> {
    this.tableDataFetcher.value.filter.page = page
    this.tableDataFetcher.value.isLoading = true
    setTimeout(() => {
      this.tableDataFetcher.value.isLoading = false
    }, 200)
    // await this.tableDataFetcher.value.goToPage(page)
  }

  async fetchData(): Promise<void> {
    if (this.tableDataFetcher.value.isLoading) {
      return
    }

    this.tableDataFetcher.value.isLoading = true

    try {
      let repository = useCompanyStore()
      let response = await repository.fetchForAnnualReturn(this.tableDataFetcher.value.filter)

      if (!response) {
        this.tableDataFetcher.value.data = []
        return
      }

      this.tableDataFetcher.value.data = response.data.map((i: any) => {
        return new Company(i)
      })

      this.tableDataFetcher.value.filter.totalRecords = this.tableDataFetcher.value.data.length
      this.tableDataFetcher.value.filter.totalPages = Math.ceil(
        this.tableDataFetcher.value.data.length / this.tableDataFetcher.value.filter.take
      )
      this.tableDataFetcher.value.filter.page = 1
    } catch (e) {
      let error = new Error()
      error.setForFetchAll()
      error.handle()
    } finally {
      this.tableDataFetcher.value.isLoading = false
    }
  }

  onCompanySelected(companyId: string): void {
    this.selectedCompanyId.value = companyId

    let router = useRouter()
    router.push(`/sdnbhds/${this.selectedCompanyId.value}`)
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

  get isShowSelectedSdnBhd(): boolean {
    return !StringUtil.isNullOrEmpty(this.selectedCompanyId.value)
  }
}
