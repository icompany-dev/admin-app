import { PageController } from "./PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
import { PropsTableFilter, PropsDataDateFilter, PropsDataOrders } from "../props/PropsTableFilter"
import { StringUtil } from "../utils/String"

export class PageAnnouncementsController extends PageController {
  searchText: Ref<string> = ref<string>("")
  sortOrder: Ref<string> = ref<string>("asc")

  constructor() {
    super("Announcements", "Manage All Your Announcements in One Place", "Announcement Page")
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
    return new PropsBreadCrumb([new PropsBreadCrumbItem("Announcements", "")])
  }

  get sortOrderLabel(): string {
    return "By Z/A"
  }

  get propsDataOrders(): PropsDataOrders[] {
    return [new PropsDataOrders(this.sortOrderLabel, "asc")]
  }

  get tableFilterProps(): PropsTableFilter {
    return new PropsTableFilter(
      false,
      "",
      false,
      this.propsDataOrders,
      false,
      new PropsDataDateFilter("", "", ""),
      true
    )
  }
}
