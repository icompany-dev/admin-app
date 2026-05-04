import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingDividendRestriction extends CompanyConstitutionSettingItem {
  mustBePaidByProfit: boolean = false
  cannotBearInterestAgainstCompany: boolean = true
  cannotBePaidIfHasLoss: boolean = false
  cannotBePaidOnPartlyPaid: boolean = false
  cannotDeclareInFirstFye: boolean = false
  cannotDeclareWithinYearLimit: boolean = false
  minimumYearLimit: number | null = null
  cannotDeclareUntilCapitalCovered: boolean = false
  cannotDeclareUntilLoansPaid: boolean = false
  canDeclareIfPassNetProfitLimit: boolean = false
  netProfitLimit: number | null = null
  canDeclareIfPassAccProfitLimit: boolean = false
  accummulatedProfitLimit: number | null = null
  canDeclareIfCashLimit: boolean = false
  cashLimit: number | null = null
  hasMaxDividendPercentage: boolean = false
  maxDividendPercentage: number | null = null
  hasMinimumProfitToRetain: boolean = false
  minimumProfitToRetain: number | null = null
  cannotDeclareUntilRedemption: boolean = false
  cannotDeclareIfHasLiabilities: boolean = false
  cannotDeclareDuringLitigation: boolean = false
  canUnclaimedPaidSeparateAccount: boolean = false
  canInvestUnclaimed: boolean = false
  canForfeitUnclaimed: boolean = false
  canPayForfeitedUnclaimed: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingDividendRestriction) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.mustBePaidByProfit = data.must_be_paid_by_profit
    this.cannotBearInterestAgainstCompany = data.cannot_bear_interest_against_company
    this.cannotBePaidIfHasLoss = data.cannot_be_paid_if_has_loss
    this.cannotBePaidOnPartlyPaid = data.cannot_be_paid_on_partly_paid
    this.cannotDeclareInFirstFye = data.cannot_declare_in_first_fye
    this.cannotDeclareWithinYearLimit = data.cannot_declare_within_year_limit
    this.minimumYearLimit = data.minimum_year_limit
    this.cannotDeclareUntilCapitalCovered = data.cannot_declare_until_capital_covered
    this.cannotDeclareUntilLoansPaid = data.cannot_declare_until_loans_paid
    this.canDeclareIfPassNetProfitLimit = data.can_declare_if_pass_net_profit_limit
    this.netProfitLimit = data.net_profit_limit
    this.canDeclareIfPassAccProfitLimit = data.can_declare_if_pass_acc_profit_limit
    this.accummulatedProfitLimit = data.accumulated_profit_limit
    this.canDeclareIfCashLimit = data.can_declare_if_cash_limit
    this.cashLimit = data.cash_limit
    this.hasMaxDividendPercentage = data.has_max_dividend_percentage
    this.maxDividendPercentage = data.max_dividend_percentage
    this.hasMinimumProfitToRetain = data.has_minimum_profit_to_retain
    this.minimumProfitToRetain = data.minimum_profit_to_retain
    this.cannotDeclareUntilRedemption = data.cannot_declare_until_redemption
    this.cannotDeclareIfHasLiabilities = data.cannot_declare_if_has_liabilities
    this.cannotDeclareDuringLitigation = data.cannot_declare_during_litigation
    this.canUnclaimedPaidSeparateAccount = data.can_unclaimed_paid_separate_account
    this.canInvestUnclaimed = data.can_invest_unclaimed
    this.canForfeitUnclaimed = data.can_forfeit_unclaimed
    this.canPayForfeitedUnclaimed = data.can_pay_forfeited_unclaimed
  }

  cloneDetails(data: CompanyConstitutionSettingDividendRestriction): void {
    super.clone(data)
    this.mustBePaidByProfit = data.mustBePaidByProfit
    this.cannotBearInterestAgainstCompany = data.cannotBearInterestAgainstCompany
    this.cannotBePaidIfHasLoss = data.cannotBePaidIfHasLoss
    this.cannotBePaidOnPartlyPaid = data.cannotBePaidOnPartlyPaid
    this.cannotDeclareInFirstFye = data.cannotDeclareInFirstFye
    this.cannotDeclareWithinYearLimit = data.cannotDeclareWithinYearLimit
    this.minimumYearLimit = data.minimumYearLimit
    this.cannotDeclareUntilCapitalCovered = data.cannotDeclareUntilCapitalCovered
    this.cannotDeclareUntilLoansPaid = data.cannotDeclareUntilLoansPaid
    this.canDeclareIfPassNetProfitLimit = data.canDeclareIfPassNetProfitLimit
    this.netProfitLimit = data.netProfitLimit
    this.canDeclareIfPassAccProfitLimit = data.canDeclareIfPassAccProfitLimit
    this.accummulatedProfitLimit = data.accummulatedProfitLimit
    this.canDeclareIfCashLimit = data.canDeclareIfCashLimit
    this.cashLimit = data.cashLimit
    this.hasMaxDividendPercentage = data.hasMaxDividendPercentage
    this.maxDividendPercentage = data.maxDividendPercentage
    this.hasMinimumProfitToRetain = data.hasMinimumProfitToRetain
    this.minimumProfitToRetain = data.minimumProfitToRetain
    this.cannotDeclareUntilRedemption = data.cannotDeclareUntilRedemption
    this.cannotDeclareIfHasLiabilities = data.cannotDeclareIfHasLiabilities
    this.cannotDeclareDuringLitigation = data.cannotDeclareDuringLitigation
    this.canUnclaimedPaidSeparateAccount = data.canUnclaimedPaidSeparateAccount
    this.canInvestUnclaimed = data.canInvestUnclaimed
    this.canForfeitUnclaimed = data.canForfeitUnclaimed
    this.canPayForfeitedUnclaimed = data.canPayForfeitedUnclaimed
  }

  getRequestBody(): object {
    return {
      must_be_paid_by_profit: this.mustBePaidByProfit,
      cannot_bear_interest_against_company: this.cannotBearInterestAgainstCompany,
      cannot_be_paid_if_has_loss: this.cannotBePaidIfHasLoss,
      cannot_be_paid_on_partly_paid: this.cannotBePaidOnPartlyPaid,
      cannot_declare_in_first_fye: this.cannotDeclareInFirstFye,
      cannot_declare_within_year_limit: this.cannotDeclareWithinYearLimit,
      minimum_year_limit: this.minimumYearLimit,
      cannot_declare_until_capital_covered: this.cannotDeclareUntilCapitalCovered,
      cannot_declare_until_loans_paid: this.cannotDeclareUntilLoansPaid,
      can_declare_if_pass_net_profit_limit: this.canDeclareIfPassNetProfitLimit,
      net_profit_limit: this.netProfitLimit,
      can_declare_if_pass_acc_profit_limit: this.canDeclareIfPassAccProfitLimit,
      accumulated_profit_limit: this.accummulatedProfitLimit,
      can_declare_if_cash_limit: this.canDeclareIfCashLimit,
      cash_limit: this.cashLimit,
      has_max_dividend_percentage: this.hasMaxDividendPercentage,
      max_dividend_percentage: this.maxDividendPercentage,
      has_minimum_profit_to_retain: this.hasMinimumProfitToRetain,
      minimum_profit_to_retain: this.minimumProfitToRetain,
      cannot_declare_until_redemption: this.cannotDeclareUntilRedemption,
      cannot_declare_if_has_liabilities: this.cannotDeclareIfHasLiabilities,
      cannot_declare_during_litigation: this.cannotDeclareDuringLitigation,
      can_unclaimed_paid_separate_account: this.canUnclaimedPaidSeparateAccount,
      can_invest_unclaimed: this.canInvestUnclaimed,
      can_forfeit_unclaimed: this.canForfeitUnclaimed,
      can_pay_forfeited_unclaimed: this.canPayForfeitedUnclaimed,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
