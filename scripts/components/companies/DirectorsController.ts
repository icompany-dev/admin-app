import { Director } from "~/scripts/models/Director"
import { Filter } from "~/scripts/library/Filter"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { StringUtil } from "~/scripts/utils/String"

export class DirectorsController {
  tableDataFetcher = ref<TableDataFetcher<Director>>(new TableDataFetcher(Director, useDirectorStore()))

  selectedDirectorId: Ref<string> = ref<string>("")

  language = useLanguage()

  filter = ref<Filter>(new Filter())

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents

    this.tableDataFetcher.value.filter.take = 20
    this.tableDataFetcher.value.filter.takeAll = false
    this.tableDataFetcher.value.filter.orderBy = "created_at"
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
    await this.tableDataFetcher.value.goToPage(page)
  }

  async fetchData(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await this.tableDataFetcher.value.fetchData()

      let promises = this.tableDataFetcher.value.data.map((d: Director) => {
        return d.setCompany(useCompanyStore())
      })

      await Promise.allSettled(promises)

      this.selectedDirectorId.value = this.tableDataFetcher.value.data[0].id
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  onDirectorSelected(directorId: string): void {
    this.selectedDirectorId.value = directorId

    // let router = useRouter()
    // router.push(`/sdnbhds/directors/${this.selectedDirectorId.value}`)
  }

  onDirectorUnselected(): void {
    this.selectedDirectorId.value = ""
  }

  // getters
  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Pengarah" : "Directors"
  }

  get noRecordTitle(): string {
    return this.language.isMalay() ? `Tiada Pengarah Ditemui.` : `No Director Found`
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
    return !StringUtil.isNullOrEmpty(this.selectedDirectorId.value)
  }
}
