import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"

export class AllianceBankApplicationDetails {
  selectedProducts: string[] = []
  otherProductName: string = ""

  bizSmartAuthorisedRepresentatives: CompanyBankSignatory[] = []
  bizSmartMandateType: string = ""
  bizSmartMandateCount: number = 1

  isSelfManage: boolean = false
  isBankManage: boolean = false

  bizXpressAuthorisedRepresentatives: CompanyBankSignatory[] = []
  bizXpressMandateType: string = ""
  bizXpressMandateCount: number = 1

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)
  }
}
