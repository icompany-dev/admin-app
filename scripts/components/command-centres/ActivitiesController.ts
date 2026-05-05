import { AdminToDo } from "~/scripts/models/AdminToDo"
import { Filter } from "~/scripts/library/Filter"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { FilterDateShortCuts } from "~/scripts/constants/FilterValues"
import { ServiceName, ServiceNames } from "~/scripts/constants/ServiceNames"
import { ObjectUtil } from "~/scripts/utils/Object"

export class ActivitiesController {
  todos = ref<AdminToDo[]>([])
  filteredTodos = ref<AdminToDo[]>([])

  isLoading: Ref<boolean> = ref<boolean>(false)

  filter = ref<Filter>(new Filter())

  emitEvents: any | null = null

  language = useLanguage()
  dayjs = useDayjs()
  time = useLocalTime()

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
      this.todos.value = response.data.map((d: any) => {
        return new AdminToDo(d)
      })

      this.todos.value = ObjectUtil.sort<AdminToDo>(this.todos.value, "paidAt", "desc")
      this.setFilteredToDos()
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
    this.setFilteredToDos()
  }

  activityStatus(todo: AdminToDo): string {
    if (todo.signatureStatus === "completed") {
      return "Majority Achieved"
    }

    return todo.otherDetails
  }

  setFilteredToDos(): void {
    let startDate = this.dayjs(this.startDate)
    let endDate = this.dayjs(this.endDate)

    console.log("startDate", this.startDate)
    console.log("endDate", this.endDate)

    this.filteredTodos.value = this.todos.value.filter((td: AdminToDo) => {
      let updatedAt = this.dayjs(td.updatedAt)
      return updatedAt.isAfter(startDate) && updatedAt.isBefore(endDate)
    })

    this.filter.value.totalRecords = this.filteredTodos.value.length
    this.filter.value.totalPages = Math.ceil(this.filter.value.totalRecords / this.filter.value.take)
  }

  get tablePaginationProps(): PropsTablePagination {
    return new PropsTablePagination(this.filter.value)
  }

  get title(): string {
    return this.language.isMalay() ? "Aktiviti dalam Sistem iCompany" : "Activities in iCompany Systems"
  }

  get startDate(): string {
    let today = this.dayjs()
    let startDate = today.startOf("day").format("YYYY-MM-DD")

    switch (this.selectedPeriod.value) {
      case FilterDateShortCuts.Daily:
        break
      case FilterDateShortCuts.Weekly:
        startDate = today.startOf("week").format("YYYY-MM-DD")
        break
      case FilterDateShortCuts.Monthly:
        startDate = today.startOf("month").format("YYYY-MM-DD")
        break
      case FilterDateShortCuts.Quarterly:
        let month = today.month()
        let monthInQuarter = Math.floor(month / 3) * 3 + 2
        let dateString = `${today.year()}-${monthInQuarter}-01`
        startDate = this.dayjs(dateString).startOf("month").format("YYYY-MM-DD")
        break
      case FilterDateShortCuts.Yearly:
        startDate = today.startOf("year").format("YYYY-MM-DD")
        break
    }

    return startDate
  }

  get endDate(): string {
    let today = this.dayjs()
    let endDate = today.startOf("day").format("YYYY-MM-DD")

    switch (this.selectedPeriod.value) {
      case FilterDateShortCuts.Daily:
        endDate = today.endOf("day").format("YYYY-MM-DD")
        break
      case FilterDateShortCuts.Weekly:
        endDate = today.endOf("week").format("YYYY-MM-DD")
        break
      case FilterDateShortCuts.Monthly:
        endDate = today.endOf("month").format("YYYY-MM-DD")
        break
      case FilterDateShortCuts.Quarterly:
        let month = today.month()
        let monthInQuarter = Math.floor(month / 3) * 3 + 2
        let dateString = `${today.year()}-${monthInQuarter}-01`
        endDate = this.dayjs(dateString).endOf("month").format("YYYY-MM-DD")
        break
      case FilterDateShortCuts.Yearly:
        endDate = today.endOf("year").format("YYYY-MM-DD")
        break
    }

    return endDate
  }

  get activitiesOnPage(): AdminToDo[] {
    let startIndex = (this.filter.value.page - 1) * this.filter.value.take
    let endIndex = startIndex + this.filter.value.take

    return this.filteredTodos.value.slice(startIndex, endIndex)
  }
}
