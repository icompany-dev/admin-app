import { PageController } from "~/scripts/pages/PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
import { PropsTableFilter, PropsDataDateFilter, PropsDataOrders } from "../props/PropsTableFilter"

export class PageAllSdnBhdController extends PageController {
  searchText: Ref<string> = ref<string>("")
  sortOrder: Ref<string> = ref<string>("asc")
  isIncludeDemo: Ref<boolean> = ref<boolean>(false)

  constructor() {
    let title: string = "Admin Dashboard - iCompany Malaysia"
    let description: string = "Admin Dashboard"

    super(title, description, "All Sdn Bhd")
  }

  onSearchInput(searchInput: string): void {
    this.searchText.value = searchInput
  }

  onSortOrderChanged(data: PropsDataOrders): void {
    if (data.orderColumn === this.sortOrderLabel) {
      this.sortOrder.value = data.sortOrder ? "desc" : "asc"
      return
    }

    console.log("data.orderColumn", data)
    if (data.orderColumn === "Include Demo") {
      this.isIncludeDemo.value = data.sortOrder ? true : false
      return
    }
  }

  get breadCrumbProps(): PropsBreadCrumb {
    return new PropsBreadCrumb([new PropsBreadCrumbItem("Companies", ""), new PropsBreadCrumbItem("All Sdn Bhd", "")])
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
      new PropsDataDateFilter("", "", "")
    )
  }
}
