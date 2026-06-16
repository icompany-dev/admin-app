import { BankDocumentsController } from "./BankDocumentsController"
import { BankConstants } from "~/scripts/constants/Banks"

export class HongLeongBankDocumentsController extends BankDocumentsController {
  bankId: string = BankConstants.BANK_ISLAM_DETAIL.id
}
