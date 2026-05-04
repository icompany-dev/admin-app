import { CompanyConstitutionSettingItem } from "./CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingCeoDuty extends CompanyConstitutionSettingItem {
  isDayToDay: boolean = false
  hasAuthorityToSign: boolean = false
  isOverseeOperations: boolean = false
  hasFinancialAuthority: boolean = false
  canImplementPolicies: boolean = false
  isAuthorisedToRepresentCompany: boolean = false
  isAuthorisedToIncurExpenditure: boolean = false
  requireBoardApprovalForTransaction: boolean = false
  minimumTransactionLimit: number | null = null
  requiredBoardApprovalToTerminate: boolean = false
  requireIntervalReport: boolean = false
  isProhibitedLongTermCommitment: boolean = false
  minimumLongTermLimit: number | null = null
  isProhibitedFromDelegating: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingCeoDuty) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isDayToDay = data.is_day_to_day
    this.hasAuthorityToSign = data.has_authority_to_sign
    this.isOverseeOperations = data.is_oversee_operations
    this.hasFinancialAuthority = data.has_financial_authority
    this.canImplementPolicies = data.can_implement_policies
    this.isAuthorisedToRepresentCompany = data.is_authorised_to_represent_company
    this.isAuthorisedToIncurExpenditure = data.is_authorised_to_incur_expenditure
    this.requireBoardApprovalForTransaction = data.require_board_approval_for_transaction
    this.minimumTransactionLimit = data.minimum_transaction_limit
    this.requiredBoardApprovalToTerminate = data.required_board_approval_to_terminate
    this.requireIntervalReport = data.require_interval_report
    this.isProhibitedLongTermCommitment = data.is_prohibited_long_term_commitment
    this.minimumLongTermLimit = data.minimum_long_term_limit
    this.isProhibitedFromDelegating = data.is_prohibited_from_delegating
  }

  cloneDetails(data: CompanyConstitutionSettingCeoDuty): void {
    super.clone(data)
    this.isDayToDay = data.isDayToDay
    this.hasAuthorityToSign = data.hasAuthorityToSign
    this.isOverseeOperations = data.isOverseeOperations
    this.hasFinancialAuthority = data.hasFinancialAuthority
    this.canImplementPolicies = data.canImplementPolicies
    this.isAuthorisedToRepresentCompany = data.isAuthorisedToRepresentCompany
    this.isAuthorisedToIncurExpenditure = data.isAuthorisedToIncurExpenditure
    this.requireBoardApprovalForTransaction = data.requireBoardApprovalForTransaction
    this.minimumTransactionLimit = data.minimumTransactionLimit
    this.requiredBoardApprovalToTerminate = data.requiredBoardApprovalToTerminate
    this.requireIntervalReport = data.requireIntervalReport
    this.isProhibitedLongTermCommitment = data.isProhibitedLongTermCommitment
    this.minimumLongTermLimit = data.minimumLongTermLimit
    this.isProhibitedFromDelegating = data.isProhibitedFromDelegating
  }

  getRequestBody(): object {
    return {
      is_day_to_day: this.isDayToDay,
      has_authority_to_sign: this.hasAuthorityToSign,
      is_oversee_operations: this.isOverseeOperations,
      has_financial_authority: this.hasFinancialAuthority,
      can_implement_policies: this.canImplementPolicies,
      is_authorised_to_represent_company: this.isAuthorisedToRepresentCompany,
      is_authorised_to_incur_expenditure: this.isAuthorisedToIncurExpenditure,
      require_board_approval_for_transaction: this.requireBoardApprovalForTransaction,
      minimum_transaction_limit: this.minimumTransactionLimit,
      required_board_approval_to_terminate: this.requiredBoardApprovalToTerminate,
      require_interval_report: this.requireIntervalReport,
      is_prohibited_long_term_commitment: this.isProhibitedLongTermCommitment,
      minimum_long_term_limit: this.minimumLongTermLimit,
      is_prohibited_from_delegating: this.isProhibitedFromDelegating,
    }
  }

  canSubmit(): boolean {
    if (this.requireBoardApprovalForTransaction && this.minimumTransactionLimit === null) {
      return false
    }

    if (this.isProhibitedLongTermCommitment && this.minimumLongTermLimit === null) {
      return false
    }

    return true
  }
}
