import { PublicServiceAnnouncement } from "~/scripts/models/PublicServiceAnnouncement"
import { Filter } from "~/scripts/library/Filter"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { StringUtil } from "~/scripts/utils/String"

export class AllController {
  tableDataFetcher = ref<TableDataFetcher<PublicServiceAnnouncement>>(
    new TableDataFetcher(PublicServiceAnnouncement, usePublicServiceAnnouncementStore())
  )

  selectedPublicServiceAnnouncementId: Ref<string> = ref<string>("")

  language = useLanguage()

  filter = ref<Filter>(new Filter())

  emitEvents: any | null = null

  constructor(emitEvents: any) {
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

  onPublicServiceAnnouncementSelected(companyId: string): void {
    this.selectedPublicServiceAnnouncementId.value = companyId

    let router = useRouter()
    router.push(`/command-centre/announcements/${this.selectedPublicServiceAnnouncementId.value}`)
    //this.emitEvents("sdnbhdSelected")
  }

  onPublicServiceAnnouncementUnselected(): void {
    this.selectedPublicServiceAnnouncementId.value = ""
  }

  // getters
  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Announcements" : "Announcements"
  }

  get noRecordTitle(): string {
    return this.language.isMalay() ? `Tiada Announcement Ditemui.` : `No Announcement Found`
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
    return !StringUtil.isNullOrEmpty(this.selectedPublicServiceAnnouncementId.value)
  }
}
