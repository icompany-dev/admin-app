import { Error } from "../library/Error"
import { Toast } from "../library/Toast"
import { PageController } from "./PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
import { PropsTableFilter, PropsDataDateFilter, PropsDataOrders } from "../props/PropsTableFilter"

export class PageTransactionsController extends PageController {
  showReceipts = ref<boolean>(true)
  showAnalytics = ref<boolean>(false)
  showCorporateStoryline = ref<boolean>(false)

  showMakePayment = ref<boolean>(false)

  isLoading: Ref<boolean> = ref<boolean>(false)

  searchText: Ref<string> = ref<string>("")
  sortOrder: Ref<string> = ref<string>("asc")
  isIncludeDemo: Ref<boolean> = ref<boolean>(false)

  constructor() {
    let title: string = "Your Transactions - iCompany Malaysia"
    let description: string = "View your past transactions on iCompany."

    super(title, description, "Transactions")
    this.addPageViewLog()
  }

  onSearchInput(searchInput: string): void {
    this.searchText.value = searchInput
  }

  onSortOrderChanged(data: PropsDataOrders): void {
    if (data.orderColumn === this.sortOrderLabel) {
      this.sortOrder.value = data.sortOrder ? "desc" : "asc"
      return
    }

    if (data.orderColumn === "Show Demo") {
      this.isIncludeDemo.value = data.sortOrder ? true : false
      return
    }
  }

  get breadCrumbProps(): PropsBreadCrumb {
    return new PropsBreadCrumb([
      new PropsBreadCrumbItem("Transactions", ""),
      new PropsBreadCrumbItem("Payments Received", ""),
    ])
  }

  get sortOrderLabel(): string {
    return this.sortOrder.value === "asc" ? "By A/Z" : "By Z/A"
  }

  get propsDataOrders(): PropsDataOrders[] {
    return [new PropsDataOrders(this.sortOrderLabel, "asc"), new PropsDataOrders("Show Demo", "false")]
  }

  get tableFilterProps(): PropsTableFilter {
    return new PropsTableFilter(
      true,
      this.searchText.value,
      true,
      this.propsDataOrders,
      false,
      new PropsDataDateFilter("", "", ""),
      false
    )
  }
}
