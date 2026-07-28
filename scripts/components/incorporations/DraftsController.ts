import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { PropsIncorporationsDraft } from "~/scripts/props/PropsIncorporationsDraft"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { StringUtil } from "~/scripts/utils/String"

export class DraftsController {
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
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      let repository = useApplicationIncorporateStore()
      let response = await repository.fetchAll(this.filter)

      if (repository.error !== null) {
        throw repository.error
      }

      this.applications.value = response.data.map((d: any) => {
        return new ApplicationIncorporate(d)
      })
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetchAll()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  // getters
  get filter(): Filter {
    let filter = new Filter()
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
}
