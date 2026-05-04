import { CompanyConstitutionSettingItem } from "./CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingCapitalisationOfProfit extends CompanyConstitutionSettingItem {
  isApprovedByMcr: boolean = false
  isApprovedBySpecialMcr: boolean = false
  isApprovedUnanimously: boolean = false
  canCapitaliseReserve: boolean = false
  canCapitaliseProfitLoss: boolean = false
  canCapitaliseProfit: boolean = false
  canIssueNewPaidShares: boolean = false
  canPayUnpaidAmount: boolean = false
  canIssueBonus: boolean = false
  canUsePartPayPartIssue: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingCapitalisationOfProfit) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isApprovedByMcr = data.is_approved_by_mcr
    this.isApprovedBySpecialMcr = data.is_approved_by_special_mcr
    this.isApprovedUnanimously = data.is_approved_unanimously
    this.canCapitaliseReserve = data.can_capitalise_reserve
    this.canCapitaliseProfitLoss = data.can_capitalise_profit_loss
    this.canCapitaliseProfit = data.can_capitalise_profit
    this.canIssueNewPaidShares = data.can_issue_new_paid_shares
    this.canPayUnpaidAmount = data.can_pay_unpaid_amount
    this.canIssueBonus = data.can_issue_bonus
    this.canUsePartPayPartIssue = data.can_use_part_pay_part_issue
  }

  cloneDetails(data: CompanyConstitutionSettingCapitalisationOfProfit): void {
    super.clone(data)
    this.isApprovedByMcr = data.isApprovedByMcr
    this.isApprovedBySpecialMcr = data.isApprovedBySpecialMcr
    this.isApprovedUnanimously = data.isApprovedUnanimously
    this.canCapitaliseReserve = data.canCapitaliseReserve
    this.canCapitaliseProfitLoss = data.canCapitaliseProfitLoss
    this.canCapitaliseProfit = data.canCapitaliseProfit
    this.canIssueNewPaidShares = data.canIssueNewPaidShares
    this.canPayUnpaidAmount = data.canPayUnpaidAmount
    this.canIssueBonus = data.canIssueBonus
    this.canUsePartPayPartIssue = data.canUsePartPayPartIssue
  }

  getRequestBody(): object {
    return {
      is_approved_by_mcr: this.isApprovedByMcr,
      is_approved_by_special_mcr: this.isApprovedBySpecialMcr,
      is_approved_unanimously: this.isApprovedUnanimously,
      can_capitalise_reserve: this.canCapitaliseReserve,
      can_capitalise_profit_loss: this.canCapitaliseProfitLoss,
      can_capitalise_profit: this.canCapitaliseProfit,
      can_issue_new_paid_shares: this.canIssueNewPaidShares,
      can_pay_unpaid_amount: this.canPayUnpaidAmount,
      can_issue_bonus: this.canIssueBonus,
      can_use_part_pay_part_issue: this.canUsePartPayPartIssue,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
