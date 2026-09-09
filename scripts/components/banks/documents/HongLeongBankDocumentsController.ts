import { BankDocumentsController } from "./BankDocumentsController"
import { BankConstants } from "~/scripts/constants/Banks"

export class HongLeongBankDocumentsController extends BankDocumentsController {
  bankId: string = BankConstants.HONG_LEONG_BANK_DETAIL.id

  async getPdfPages(): Promise<HTMLElement[]> {
    let pages: HTMLElement[] = []

    if (this.dcrRef) {
      let docPages = await this.dcrRef.getPdfPages()
      pages = pages.concat(docPages)
    }

    return pages
  }
}
