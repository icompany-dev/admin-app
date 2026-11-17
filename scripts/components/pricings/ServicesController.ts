import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { Toast } from "~/scripts/library/Toast"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { PropsPricing } from "~/scripts/props/PropsPricing"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { ObjectUtil } from "~/scripts/utils/Object"
import { StringUtil } from "~/scripts/utils/String"

export class ServicesController {
  emitEvents: any | null = null

  take: number = 10
  searchText: Ref<string> = ref<string>("")
  currentPage: Ref<number> = ref<number>(1)

  tableDataFetcher: Ref<TableDataFetcher<ServicePricing>> = ref<TableDataFetcher<ServicePricing>>(
    new TableDataFetcher(ServicePricing, useServicePricingStore())
  )

  isShowing: Ref<boolean> = ref<boolean>(false)

  isEditing: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  confirmToDeleteRef: any | null = null

  servicePricingToRemove: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents

    this.tableDataFetcher.value.filter.takeAll = true
    this.tableDataFetcher.value.fetchData()
  }

  setConfirmToDeleteRef(confirmToDeleteRef: any): void {
    this.confirmToDeleteRef = confirmToDeleteRef
  }

  show(): void {
    this.searchText.value = ""
    this.currentPage.value = 1
    this.isShowing.value = true
  }

  hide(): void {
    this.isShowing.value = false
  }

  handlePostCreateUpdate(servicePricing: ServicePricing): void {
    let matched = this.tableDataFetcher.value.data.find((sp: ServicePricing) => {
      return sp.id === servicePricing.id
    })

    if (matched) {
      matched.clone(servicePricing)
    } else {
      this.tableDataFetcher.value.data.push(servicePricing)

      this.searchText.value = servicePricing.serviceName //To show that it is already added
    }

    this.isEditing.value = false

    this.isShowing.value = true
  }

  async onGoToPage(page: number): Promise<void> {
    let divTarget = document.getElementById("services-container")
    if (divTarget) {
      divTarget.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    }

    this.currentPage.value = page
  }

  onSearchTextInput(): void {
    //We want to move them to the first page
    if (StringUtil.isNullOrEmpty(this.searchText.value)) {
      this.currentPage.value = 1
      return
    }

    if (this.searchText.value.length === 1) {
      this.currentPage.value = 1
    }
  }

  getPropsPricing(servicePricing: ServicePricing): PropsPricing {
    return new PropsPricing(servicePricing, false)
  }

  getIndex(index: number): number {
    let offset = (this.currentPage.value - 1) * this.take
    return offset + index + 1
  }

  onEditClicked(servicePricing: ServicePricing): void {
    this.isEditing.value = true
    this.hide()
    this.emitEvents("edit", servicePricing)
  }

  onCreateNew(): void {
    this.hide()
    this.emitEvents("create")
  }

  onRemoveClicked(servicePricing: ServicePricing): void {
    this.servicePricingToRemove.value = new ServicePricing(servicePricing)

    if (this.confirmToDeleteRef) {
      this.confirmToDeleteRef.show()
    }
  }

  async onProceedRemove(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.servicePricingToRemove.value.id)) {
      return
    }

    try {
      this.tableDataFetcher.value.data = this.tableDataFetcher.value.data.filter((sp: ServicePricing) => {
        return sp.id !== this.servicePricingToRemove.value.id
      })

      await this.servicePricingToRemove.value.remove(useServicePricingStore())

      let toastTitle = this.language.isMalay() ? "Servis telah dipadamkan." : "The Service is removed."
      let toast = new Toast(toastTitle, "")
      toast.success()
    } catch (e) {
      if (e instanceof Error) {
        e.isMalay = this.language.isMalay()
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
        error.handle()
      }
    }
  }

  get servicePricings(): ServicePricing[] {
    let servicePricings = this.tableDataFetcher.value.data.filter((sp: ServicePricing) => {
      if (sp.mandatoryServices.length > 0 || sp.breakdowns.length <= 0 || sp.optionals.length > 0) {
        return false
      }

      if (StringUtil.isNullOrEmpty(this.searchText.value)) {
        return true
      }

      return StringUtil.contains(sp.serviceName, this.searchText.value)
    })

    servicePricings = ObjectUtil.sort<ServicePricing>(servicePricings, "serviceName", "asc")

    return servicePricings
  }

  get dataOnPage(): ServicePricing[] {
    if (this.servicePricings.length < this.take) {
      return this.servicePricings
    }

    let start = (this.currentPage.value - 1) * this.take
    let end = start + this.take

    return this.servicePricings.slice(start, end)
  }

  get totalRecords(): number {
    let records = this.tableDataFetcher.value.data.filter((sp: ServicePricing) => {
      return sp.mandatoryServices.length <= 0
    })

    return records.length
  }

  get totalData(): number {
    return this.servicePricings.length
  }

  get totalPages(): number {
    let pages = Math.ceil(this.totalData / this.take)

    if (pages <= 0) {
      return (pages = 1)
    }

    return pages
  }

  get heading(): string {
    return this.language.isMalay() ? "Servis" : "Services"
  }

  get tablePaginationProps(): PropsTablePagination {
    let filter = new Filter()
    filter.page = this.currentPage.value
    filter.totalPages = this.totalPages
    filter.totalRecords = this.totalData

    return new PropsTablePagination(filter)
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Populating the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Servis" : "Services"
  }

  get itemRemoveName(): string {
    return this.language.isMalay() ? "Servis" : "Service"
  }
}
