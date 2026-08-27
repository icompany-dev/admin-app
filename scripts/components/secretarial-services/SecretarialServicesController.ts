import { StatusConstants } from "~/scripts/constants/Status"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { StringUtil } from "~/scripts/utils/String"
import type { IRepositoryStore } from "~/scripts/models/IRepositoryStore"
import { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import type { Company } from "~/scripts/models/Company"

export abstract class SecretarialServicesController<T> {
  tableDataFetcher = ref<TableDataFetcher<T> | null>(null)

  emitEvents: any | null = null

  searchText: Ref<string | null> = ref<string | null>(null)
  isIncludeDemo: Ref<boolean> = ref<boolean>(false)

  isLoading: Ref<boolean> = ref<boolean>(false)

  itemClassType: new (data: any) => T

  language = useLanguage()
  router = useRouter()
  time = useLocalTime()

  constructor(
    props: PropsSecretarialServices,
    itemClassType: new (data: any) => T,
    repository: IRepositoryStore,
    emitEvents: any | null
  ) {
    this.itemClassType = itemClassType
    this.tableDataFetcher.value = new TableDataFetcher(itemClassType, repository)
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
  }

  async setDataFromProps(props: PropsSecretarialServices): Promise<void> {
    this.searchText.value = props.searchText
    this.isIncludeDemo.value = props.isIncludeDemo

    await this.init()
  }

  async init(): Promise<void> {
    if (!this.tableDataFetcher.value) {
      return
    }

    this.tableDataFetcher.value.filter = this.filter
    await this.tableDataFetcher.value.fetchData()
  }

  abstract onApplicationClicked(application: any): void
  abstract companyName(application: any): string
  abstract applicationDetails(application: any): string
  abstract applicationDate(application: any): string
  abstract applicationStatusClass(application: any): string
  abstract applicationStatus(application: any): string
  abstract company(application: any): Company

  onCompanyNameClicked(companyId: string): void {
    this.router.push({
      path: `/sdnbhds/${companyId}`,
    })
  }

  //getters
  get filter(): Filter {
    let filter = new Filter()
    filter.take = 20
    filter.takeAll = false
    filter.sortOrder = "desc"
    filter.orderBy = "created_at"
    filter.includeTestAccount = this.isIncludeDemo.value
    filter.statuses = [
      StatusConstants.DRAFT,
      StatusConstants.PENDING,
      StatusConstants.PAID,
      StatusConstants.NAME_REJECTED,
      StatusConstants.APPROVED,
      StatusConstants.REJECTED,
    ]

    if (!StringUtil.isNullOrEmpty(this.searchText.value)) {
      filter.searchText = this.searchText.value
    }

    return filter
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Memaut Semua" : "Retrieving All"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Permohonan" : "Applications"
  }

  get noRecordTitle(): string {
    return this.language.isMalay() ? `Tiada Permohonan Ditemui.` : `No Application Found`
  }

  get noRecordSubtitle(): string {
    if (!StringUtil.isNullOrEmpty(this.tableDataFetcher.value?.filter.searchText ?? "")) {
      return this.language.isMalay()
        ? `Tiada permohonan ditemui dengan kata kunci tersebut.`
        : `Use a different keyword and search again.`
    }

    return this.language.isMalay()
      ? `Data akan dipaparkan apabila tersedia.`
      : `Data will appear once it becomes available.`
  }

  get viewApplicationLabel(): string {
    return this.language.isMalay() ? "Lihat" : "View"
  }
}
