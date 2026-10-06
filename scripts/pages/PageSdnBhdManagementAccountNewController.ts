import { PropsManagementAccountDocument } from "../props/PropsManagementAccountDocument"
import { PageController } from "./PageController"

export class PageSdnBhdManagementAccountNewController extends PageController {
  constructor() {
    let title: string = "Create Management Account - iCompany Malaysia"
    let description: string = "Create New Management Account for Sdn Bhd"

    super(title, description, "New Management Account")
  }

  get propsManagementAccountDocument(): PropsManagementAccountDocument {
    return new PropsManagementAccountDocument("", "", "", null, true, true, false, false, false, false)
  }
}
