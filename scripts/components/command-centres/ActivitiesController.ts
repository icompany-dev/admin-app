import { AdminToDo } from "~/scripts/models/AdminToDo"
import { Filter } from "~/scripts/library/Filter"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { FilterDateShortCuts } from "~/scripts/constants/FilterValues"
import { ServiceName, ServiceNames } from "~/scripts/constants/ServiceNames"
import { ObjectUtil } from "~/scripts/utils/Object"

export class ActivitiesController {
  todos = ref<AdminToDo[]>([])

  isLoading: Ref<boolean> = ref<boolean>(false)

  filter = ref<Filter>(new Filter())

  emitEvents: any | null = null

  language = useLanguage()

  isShowPeriodOptions: Ref<boolean> = ref<boolean>(false)
  selectedPeriod: Ref<FilterDateShortCuts> = ref<FilterDateShortCuts>(FilterDateShortCuts.Daily)
  periodOptions = Object.values(FilterDateShortCuts)

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents

    this.filter.value = new Filter()
    this.filter.value.take = 30
    this.filter.value.page = 1
    this.filter.value.totalPages = 1
    this.filter.value.totalRecords = 1

    this.fetchToDos()
  }

  async fetchToDos(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true
      let repository = useAdminToDoStore()

      let response = await repository.fetchAll(this.filter.value)
      this.filter.value.totalPages = Math.ceil(response.totalRecords / this.filter.value.take)
      this.filter.value.totalRecords = response.totalRecords

      this.todos.value = response.data.map((d: any) => {
        return new AdminToDo(d)
      })

      this.todos.value = ObjectUtil.sort<AdminToDo>(this.todos.value, "paidAt", "desc")
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error(Error.ERROR_TYPE_API, "")
        error.setForFetchAll()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async goToPage(page: number): Promise<void> {
    this.filter.value.page = page
  }

  onPeriodSelectionClicked(): void {
    this.isShowPeriodOptions.value = !this.isShowPeriodOptions.value
  }

  onPeriodSelected(value: FilterDateShortCuts): void {
    this.selectedPeriod.value = value
  }

  serviceName(todo: AdminToDo): string {
    let serviceName = ""

    let service = ServiceNames.names.find((sn: ServiceName) => {
      return sn.target === todo.type
    })

    if (service) {
      return service.en
    }

    return serviceName
  }

  get tablePaginationProps(): PropsTablePagination {
    return new PropsTablePagination(this.filter.value)
  }

  get title(): string {
    return this.language.isMalay() ? "Aktiviti dalam Sistem iCompany" : "Activities in iCompany Systems"
  }

  get activitiesOnPage(): AdminToDo[] {
    let startIndex = (this.filter.value.page - 1) * this.filter.value.take
    let endIndex = startIndex + this.filter.value.take

    return this.todos.value.slice(startIndex, endIndex)
  }
}
