import { StringUtil } from "../utils/String"
import { PageSwitchesController } from "./PageSwitchesController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
// import { PropsSwitchesOngoing } from "~/scripts/props/PropsSwitchesOngoing"
// import { PropsIncorporationApplication } from "../props/PropsIncorporationApplication"
import { PropsTableFilter, PropsDataDateFilter, PropsDataOrders } from "../props/PropsTableFilter"

export class PageSwitchesOngoingController extends PageSwitchesController {
  showAll: Ref<boolean> = ref<boolean>(true)
  showSelected: Ref<boolean> = ref<boolean>(false)

  selectedApplicationId: Ref<string> = ref<string>("")

  constructor() {
    super(
      "Switches of New Sdn Bhd - iCompany Malaysia",
      "Manage all applications for incorporations of New Sdn Bhd",
      "Incorporation Applications"
    )

    this.handleRoute()
  }

  handleRoute(): void {
    let paramId = this.route.params?.id ?? null

    if (
      !paramId ||
      (Array.isArray(paramId) && paramId.length <= 0) ||
      (!Array.isArray(paramId) && StringUtil.isNullOrEmpty(paramId))
    ) {
      this.selectedApplicationId.value = ""
      this.onShowAllClicked()
    }

    if (Array.isArray(paramId)) {
      this.selectedApplicationId.value = paramId[0]
    } else {
      this.selectedApplicationId.value = paramId
    }

    if (StringUtil.isNullOrEmpty(this.selectedApplicationId.value)) {
      this.onShowAllClicked()
    } else {
      this.onShowSelectedClicked()
    }
  }

  onShowAllClicked(): void {
    this.showAll.value = true
    this.showSelected.value = false
  }

  onShowSelectedClicked(): void {
    this.showAll.value = false
    this.showSelected.value = true
  }

  onClearSelected(): void {
    this.router.push({ path: "/incorporations/ongoings" })
  }

  get breadCrumbProps(): PropsBreadCrumb {
    if (this.showSelected.value) {
      return new PropsBreadCrumb([
        new PropsBreadCrumbItem("New Switches", ""),
        new PropsBreadCrumbItem("Ongoings", "/incorporations/ongoings"),
        new PropsBreadCrumbItem("Application", ""),
      ])
    }

    return new PropsBreadCrumb([new PropsBreadCrumbItem("New Switches", ""), new PropsBreadCrumbItem("Ongoings", "")])
  }

  // get ongoingsProps(): PropsSwitchesOngoing {
  //   return new PropsSwitchesOngoing(this.searchText.value, this.isIncludeDemo.value)
  // }

  // get applicationProps(): PropsIncorporationApplication {
  //   return new PropsIncorporationApplication(this.selectedApplicationId.value)
  // }

  override get tableFilterProps(): PropsTableFilter {
    if (this.showSelected.value) {
      return new PropsTableFilter(false, "", false, [], false, new PropsDataDateFilter("", "", ""), true)
    }
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
