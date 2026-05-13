import { PageController } from "./PageController"

export class PageIndexController extends PageController {
  constructor() {
    let title: string = "Admin Dashboard - iCompany Malaysia"
    let description: string = "Admin Dashboard"

    super(title, description, "")
  }
}
