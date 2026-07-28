import { StatusConstants } from "~/scripts/constants/Status"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { PropsIncorporationsDraft } from "~/scripts/props/PropsIncorporationsDraft"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { StringUtil } from "~/scripts/utils/String"

export class DraftsController {
  tableDataFetcher = ref<TableDataFetcher<ApplicationIncorporate>>(
    new TableDataFetcher(ApplicationIncorporate, useApplicationIncorporateStore())
  )
  applications: Ref<ApplicationIncorporate[]> = ref<ApplicationIncorporate[]>([])

  emitEvents: any | null = null

  searchText: Ref<string | null> = ref<string | null>(null)

  isLoading: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  constructor(props: PropsIncorporationsDraft, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  async setDataFromProps(props: PropsIncorporationsDraft): Promise<void> {
    this.searchText.value = props.searchText

    await this.init()
  }

  async init(): Promise<void> {
    this.tableDataFetcher.value.filter = this.filter
    await this.tableDataFetcher.value.fetchData()
  }

  applicationDate(application: ApplicationIncorporate): string {
    let time = useLocalTime()

    return time.formatDateTimeFull(application.createdAt)
  }

  applicationStatus(application: ApplicationIncorporate): string {
    switch (application.status) {
      case StatusConstants.DRAFT:
        return this.language.isMalay() ? "Belum Dibayar" : "Pending Payment"
      case StatusConstants.PAID:
        return this.language.isMalay() ? "Bayaran Diterima" : "Payment Received"
      case StatusConstants.NAME_REJECTED:
        return this.language.isMalay() ? "Cadangan Nama Ditolak" : "Proposed Name Rejected"
    }

    return application.status
  }

  applicationStatusClass(application: ApplicationIncorporate): string {
    switch (application.status) {
      case StatusConstants.DRAFT:
        return "draft"
      case StatusConstants.PAID:
        return "info"
      case StatusConstants.NAME_REJECTED:
        return "danger"
      case StatusConstants.APPROVED:
        return "success"
    }

    return "info"
  }

  onApplicationClicked(application: ApplicationIncorporate): void {
    let router = useRouter()
    router.push({ path: `/incorporations/drafts/${application.id}` })
  }

  // getters
  get filter(): Filter {
    let filter = new Filter()
    filter.take = 20
    filter.takeAll = false
    filter.sortOrder = "desc"
    filter.orderBy = "created_at"

    if (!StringUtil.isNullOrEmpty(this.searchText.value)) {
      filter.searchText = this.searchText.value
    }

    return filter
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Memaut Semua" : "Retrieving All"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Pemerbadanan Baharu" : "New Incorporations"
  }

  get noRecordTitle(): string {
    return this.language.isMalay() ? `Tiada Permohonan Ditemui.` : `No Application Found`
  }

  get noRecordSubtitle(): string {
    if (!StringUtil.isNullOrEmpty(this.tableDataFetcher.value.filter.searchText)) {
      return this.language.isMalay()
        ? `Tiada permohonan ditemui dengan kata kunci tersebut.`
        : `Use a different keyword and search again.`
    }

    return this.language.isMalay()
      ? `Data akan dipaparkan apabila tersedia.`
      : `Data will appear once it becomes available.`
  }
}
