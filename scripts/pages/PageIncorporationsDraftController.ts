import { StringUtil } from "../utils/String"
import { PageIncorporationsController } from "./PageIncorporationsController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"

export class PageIncorporationsDraftController extends PageIncorporationsController {
  showAll: Ref<boolean> = ref<boolean>(true)
  showSelected: Ref<boolean> = ref<boolean>(false)

  selectedApplicationId: Ref<string> = ref<string>("")

  constructor() {
    super(
      "Incorporations in Draft - iCompany Malaysia",
      "Manage all applications for incorporations that are in Draft",
      "Incorporation Applications in Draft"
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

  get breadCrumbProps(): PropsBreadCrumb {
    if (this.showSelected.value) {
      return new PropsBreadCrumb([
        new PropsBreadCrumbItem("New Incorporations", ""),
        new PropsBreadCrumbItem("Drafts", "/incorporations/drafts"),
        new PropsBreadCrumbItem("Application", ""),
      ])
    }

    return new PropsBreadCrumb([
      new PropsBreadCrumbItem("New Incorporations", ""),
      new PropsBreadCrumbItem("Drafts", ""),
    ])
  }
}
