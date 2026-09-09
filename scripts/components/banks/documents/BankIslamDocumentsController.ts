import { BankDocumentsController } from "./BankDocumentsController"
import { BankConstants } from "~/scripts/constants/Banks"

export class BankIslamDocumentsController extends BankDocumentsController {
  bankId: string = BankConstants.BANK_ISLAM_DETAIL.id

  async getPdfPages(): Promise<HTMLElement[]> {
    let pages: HTMLElement[] = []

    if (this.dcrRef) {
      let docPages = await this.dcrRef.getPdfPages()
      pages = pages.concat(docPages)
    }

    return pages
  }
}
