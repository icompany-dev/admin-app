import { BankDocumentsController } from "./BankDocumentsController"
import { BankConstants } from "~/scripts/constants/Banks"

export class HongLeongBankDocumentsController extends BankDocumentsController {
  bankId: string = BankConstants.HONG_LEONG_BANK_DETAIL.id
}
