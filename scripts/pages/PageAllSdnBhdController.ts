import { PageController } from "~/scripts/pages/PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"

export class PageAllSdnBhdController extends PageController {
  constructor() {
    let title: string = "Admin Dashboard - iCompany Malaysia"
    let description: string = "Admin Dashboard"

    super(title, description, "All Sdn Bhd")
  }

  get breadCrumbProps(): PropsBreadCrumb {
    return new PropsBreadCrumb([new PropsBreadCrumbItem("Companies", ""), new PropsBreadCrumbItem("All Sdn Bhd", "")])
  }
}
