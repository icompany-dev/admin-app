import { Filter } from "~/scripts/library/Filter"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { CompanyManagementAccount } from "~/scripts/models/CompanyManagementAccount"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { StringUtil } from "~/scripts/utils/String"

export class AllController {
  searchText: Ref<string> = ref<string>("")
  isIncludeDemo: Ref<boolean> = ref<boolean>(false)

  tableDataFetcher = ref<TableDataFetcher<CompanyManagementAccount>>(
    new TableDataFetcher(CompanyManagementAccount, useCompanyManagementAccountStore())
  )

  emitEvents: any | null = null

  language = useLanguage()

  filter: Ref<Filter> = ref<Filter>(new Filter())

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents

    this.tableDataFetcher.value.filter.take = 20
    this.tableDataFetcher.value.filter.takeAll = false
    this.tableDataFetcher.value.filter.orderBy = "name"
    this.tableDataFetcher.value.filter.sortOrder = "asc"

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

  async setIsIncludeDemo(isIncludeDemo: boolean): Promise<void> {
    this.tableDataFetcher.value.filter.includeTestAccount = isIncludeDemo
    await this.tableDataFetcher.value.fetchData()
  }

  async goToPage(page: number): Promise<void> {
    await this.tableDataFetcher.value.goToPage(page)
  }

  onManagementAccountClicked(companyManagementAccount: CompanyManagementAccount): void {
    let router = useRouter()
    router.push(`/services/management-accounts/${companyManagementAccount.id}`)
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Akaun Pengurusan" : "Management Accounts"
  }

  get noRecordTitle(): string {
    return this.language.isMalay() ? `Tiada Akaun Pengurusan Ditemui.` : `No Management Account Found`
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
}
