import { BankDocumentsController } from "./BankDocumentsController"
import { BankConstants } from "~/scripts/constants/Banks"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"

export class MaybankDocumentsController extends BankDocumentsController {
  bankId: string = BankConstants.MAYBANK_DETAIL.id

  authorisedSignatoryRef: any | null = null
  onlineBankingRef: any | null = null

  setAuthorisedSignatoryRef(authorisedSignatoryRef: any): void {
    this.authorisedSignatoryRef = authorisedSignatoryRef
  }

  setOnlineBankingRef(onlineBankingRef: any): void {
    this.onlineBankingRef = onlineBankingRef
  }

  override getBranchId(): string {
    if (!this.authorisedSignatoryRef) {
      return ""
    }

    return this.authorisedSignatoryRef.getBranchId()
  }

  override getSignatories(): CompanyBankSignatory[] {
    if (!this.authorisedSignatoryRef) {
      return []
    }

    return this.authorisedSignatoryRef.getSignatories()
  }

  override getSignatoryType(): string {
    if (!this.authorisedSignatoryRef) {
      return ""
    }

    return this.authorisedSignatoryRef.getSignatoryType()
  }

  override getAuthorisedPersonsForOnlineBanking(): OnlineBanking[] {
    if (!this.onlineBankingRef) {
      return []
    }

    return this.onlineBankingRef.getAuthorisedPersonsForOnlineBanking()
  }
}
