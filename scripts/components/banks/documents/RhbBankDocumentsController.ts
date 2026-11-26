import type { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { BankDocumentsController } from "./BankDocumentsController"

export class RhbBankDocumentsController extends BankDocumentsController {
  getApplication(): CompanyBankAccountOpening | null {
    return this.dcrRef?.getApplication() ?? null
  }
}
