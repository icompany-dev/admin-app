import { PageController } from "./PageController"

export class PageLoginController extends PageController {
  constructor() {
    let title: string = "Login - iCompany Malaysia"
    let description: string = "Login to iCompany Systems. Access to Admin Dashboard."

    super(title, description, "")
  }
}
