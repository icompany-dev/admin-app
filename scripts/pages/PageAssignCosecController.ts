import { PageController } from "./PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
import { PropsTableFilter, PropsDataDateFilter, PropsDataOrders } from "../props/PropsTableFilter"

export class PageAssignCosecController extends PageController {
  searchText: Ref<string> = ref<string>("")
  sortOrder: Ref<string> = ref<string>("asc")
  isIncludeDemo: Ref<boolean> = ref<boolean>(false)
  isSdnBhdSelected: Ref<boolean> = ref<boolean>(false)

  constructor() {
    let title: string = "Assignment of Company Secretary - iCompany Malaysia"
    let description: string = "Assign Company Secretary to Sdn Bhd"

    super(title, description, "Assign Company Secretary")
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

  onSdnBhdSelected(): void {
    this.isSdnBhdSelected.value = true
  }

  onSdnBhdUnselected(): void {
    this.isSdnBhdSelected.value = false
  }

  get breadCrumbProps(): PropsBreadCrumb {
    return new PropsBreadCrumb([
      new PropsBreadCrumbItem("Companies", ""),
      new PropsBreadCrumbItem("Assign Company Secretary", ""),
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
