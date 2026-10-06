import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
import { PropsDataDateFilter, PropsDataOrders, PropsTableFilter } from "../props/PropsTableFilter"
import { PageController } from "./PageController"

export class PageSdnBhdManagementAccountsController extends PageController {
  sortOrder: Ref<string> = ref<string>("asc")
  searchText: Ref<string> = ref<string>("")

  constructor() {
    let title: string = "Management Accounts - iCompany Malaysia"
    let description: string = "Management Accounts for All Sdn Bhd"

    super(title, description, "Management Accounts")
  }

  get breadCrumbProps(): PropsBreadCrumb {
    return new PropsBreadCrumb([new PropsBreadCrumbItem("Services", ""), new PropsBreadCrumbItem(this.pageAlias, "")])
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
