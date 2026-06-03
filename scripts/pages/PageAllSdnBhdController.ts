import { PageController } from "~/scripts/pages/PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
import { PropsTableFilter, PropsDataDateFilter, PropsDataOrders } from "../props/PropsTableFilter"

export class PageAllSdnBhdController extends PageController {
  searchText: Ref<string> = ref<string>("")
  sortOrder: Ref<string> = ref<string>("asc")

  constructor() {
    let title: string = "Admin Dashboard - iCompany Malaysia"
    let description: string = "Admin Dashboard"

    super(title, description, "All Sdn Bhd")
  }

  onSearchInput(searchInput: string): void {
    this.searchText.value = searchInput
  }

  onSortOrderChanged(data: PropsDataOrders): void {
    this.sortOrder.value = data.sortOrder ? "desc" : "asc"
  }

  get breadCrumbProps(): PropsBreadCrumb {
    return new PropsBreadCrumb([new PropsBreadCrumbItem("Companies", ""), new PropsBreadCrumbItem("All Sdn Bhd", "")])
  }

  get propsDataOrders(): PropsDataOrders {
    let name = this.sortOrder.value === "asc" ? "By A/Z" : "By Z/A"

    return new PropsDataOrders(name, "asc")
  }

  get tableFilterProps(): PropsTableFilter {
    return new PropsTableFilter(
      true,
      this.searchText.value,
      true,
      [this.propsDataOrders],
      false,
      new PropsDataDateFilter("", "", "")
    )
  }
}
