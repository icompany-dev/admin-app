import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
import { PropsDataDateFilter, PropsDataOrders, PropsTableFilter } from "../props/PropsTableFilter"
import { PageController } from "./PageController"

export class PageControlPanelPricingsController extends PageController {
  searchText: Ref<string> = ref<string>("")
  sortOrder: Ref<string> = ref<string>("asc")

  constructor() {
    let title: string = "Pricings Control - iCompany Malaysia"
    let description: string = "Manage Pricings"

    super(title, description, "Pricings")
  }

  onSearchInput(searchInput: string): void {
    this.searchText.value = searchInput
  }

  onSortOrderChanged(data: PropsDataOrders): void {
    if (data.orderColumn === this.sortOrderLabel) {
      this.sortOrder.value = data.sortOrder ? "desc" : "asc"
      return
    }
  }

  get breadCrumbProps(): PropsBreadCrumb {
    return new PropsBreadCrumb([new PropsBreadCrumbItem("Control Panel", ""), new PropsBreadCrumbItem("Pricings", "")])
  }

  get sortOrderLabel(): string {
    return this.sortOrder.value === "asc" ? "By A/Z" : "By Z/A"
  }

  get propsDataOrders(): PropsDataOrders[] {
    return [new PropsDataOrders(this.sortOrderLabel, "asc")]
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
