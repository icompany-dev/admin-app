import { StringUtil } from "~/scripts/utils/String"
import type { OnlineBanking } from "./OnlineBanking"

export class AffinBankApplicationDetails {
  isAllowLinkAndTransactSubsidiary: boolean = false
  isAcknowledgeOnSubsidiaryBehalf: boolean = false
  isTermCompanyForSubsidiary: boolean = false
  authorisedSignatorySigningLimit: string = ""
  onlineBankingSigningLimit: string = ""

  systemAdministratorApprovers: OnlineBanking[] = []

  transferLimit: string = ""

  currentBankingSignatoryType: string = ""
  currentBankingSignatoryTypeOther: string = ""

  onlineBankingSignatoryType: string = ""
  onlineBankingSignatoryTypeOther: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)
  }

  isInformationCompleted(): boolean {
    if (this.currentBankingSignatoryType === "others") {
      if (StringUtil.isNullOrEmpty(this.currentBankingSignatoryTypeOther)) {
        return false
      }
    }

    if (this.onlineBankingSignatoryType === "others") {
      if (StringUtil.isNullOrEmpty(this.onlineBankingSignatoryTypeOther)) {
        return false
      }
    }

    return (
      !StringUtil.isNullOrEmpty(this.authorisedSignatorySigningLimit) &&
      !StringUtil.isNullOrEmpty(this.onlineBankingSigningLimit) &&
      this.systemAdministratorApprovers.length > 0 &&
      !StringUtil.isNullOrEmpty(this.transferLimit) &&
      !StringUtil.isNullOrEmpty(this.currentBankingSignatoryType) &&
      !StringUtil.isNullOrEmpty(this.onlineBankingSignatoryType)
    )
  }
}
