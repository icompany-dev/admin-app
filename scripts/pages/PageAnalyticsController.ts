import { PageController } from "./PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"

export class PageAnalyticsController extends PageController {
  //

  constructor() {
    let title: string = "Analytics Dashboard - iCompany Malaysia"
    let description: string = "Analytics Dashboard"

    super(title, description, "")
  }

  get breadCrumbProps(): PropsBreadCrumb {
    return new PropsBreadCrumb([
      new PropsBreadCrumbItem("Command Centre", ""),
      new PropsBreadCrumbItem("Analytics", ""),
    ])
  }
}
