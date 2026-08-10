import { Filter } from "~/scripts/library/Filter"
import { AdminDelivery } from "~/scripts/models/AdminDelivery"
import { FilterDateShortCuts } from "~/scripts/constants/FilterValues"
import { ObjectUtil } from "~/scripts/utils/Object"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"

export class DeliveriesController {
  deliveries = ref<AdminDelivery[]>([])

  filter = ref<Filter>(new Filter())

  language = useLanguage()
  dayjs = useDayjs()
  time = useLocalTime()

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  isShowPeriodOptions: Ref<boolean> = ref<boolean>(false)
  selectedPeriod: Ref<FilterDateShortCuts> = ref<FilterDateShortCuts>(FilterDateShortCuts.Daily)
  periodOptions = Object.values(FilterDateShortCuts)

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents

    this.filter.value = new Filter()
    this.filter.value.take = 30
    this.filter.value.page = 1
    this.filter.value.totalPages = 1
    this.filter.value.totalRecords = 1

    this.fetchData()
  }

  async fetchData(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true
      let repository = useAnalyticsStore()
      this.filter.value.dateColumn = "paid_at"
      this.filter.value.startDate = this.startDate
      this.filter.value.endDate = this.endDate

      let response = await repository.fetchDeliveries(this.filter.value)
      this.deliveries.value = response.data.map((d: any) => {
        return new AdminDelivery(d)
      })

      this.filter.value.totalRecords = this.deliveries.value.length
      this.filter.value.totalPages = Math.ceil(this.filter.value.totalRecords / this.filter.value.take)
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

  async goToPage(page: number): Promise<void> {
    this.filter.value.page = page
  }

  onPeriodSelectionClicked(): void {
    this.isShowPeriodOptions.value = !this.isShowPeriodOptions.value
  }

  async onPeriodSelected(value: FilterDateShortCuts): Promise<void> {
    this.selectedPeriod.value = value
    await this.fetchData()
  }

  get title(): string {
    return this.language.isMalay() ? "Bayaran yang Diterima" : "Deliveries"
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
        endDate = today.add(1, "day").endOf("day").format("YYYY-MM-DD")
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

  get deliveriesOnPage(): AdminDelivery[] {
    let startIndex = (this.filter.value.page - 1) * this.filter.value.take
    let endIndex = startIndex + this.filter.value.take

    return this.deliveries.value.slice(startIndex, endIndex)
  }

  get tablePaginationProps(): PropsTablePagination {
    return new PropsTablePagination(this.filter.value)
  }
}
