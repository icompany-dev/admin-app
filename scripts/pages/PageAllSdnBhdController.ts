import { PageController } from "~/scripts/pages/PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"

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

  onSortOrderChanged(sortOrder: string): void {
    this.sortOrder.value = sortOrder
  }

  get breadCrumbProps(): PropsBreadCrumb {
    return new PropsBreadCrumb([new PropsBreadCrumbItem("Companies", ""), new PropsBreadCrumbItem("All Sdn Bhd", "")])
  }
}
