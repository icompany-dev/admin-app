import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingScopeDutiesAuthority extends CompanyConstitutionSettingItem {
  isOverseeDayToDay: boolean = false
  isSuperviseDepartments: boolean = false
  isSignContract: boolean = false
  isExerciseFinancialAuthority: boolean = false
  isImplementPolicies: boolean = false
  isMakeOperationalDecisions: boolean = false
  isRepresentCompany: boolean = false
  isHireManageEmployees: boolean = false
  requireBoardApprovalForTransaction: boolean = false
  minimumTransactionLimit: number | null = null
  requireBoardApprovalForContractYear: boolean = false
  minimumContractYearLimit: number | null = null
  requireBoardApprovalToTerminate: boolean = false
  requireRegularReporting: boolean = false
  isNonDelegationOfPowers: boolean = false
  requireComplianceWithPolicies: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingScopeDutiesAuthority) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isOverseeDayToDay = data.is_oversee_day_to_day
    this.isSuperviseDepartments = data.is_supervise_departments
    this.isSignContract = data.is_sign_contract
    this.isExerciseFinancialAuthority = data.is_exercise_financial_authority
    this.isImplementPolicies = data.is_implement_policies
    this.isMakeOperationalDecisions = data.is_make_operational_decisions
    this.isRepresentCompany = data.is_represent_company
    this.isHireManageEmployees = data.is_hire_manage_employees
    this.requireBoardApprovalForTransaction = data.require_board_approval_for_transaction
    this.minimumTransactionLimit = data.minimum_transaction_limit
    this.requireBoardApprovalForContractYear = data.require_board_approval_for_contract_year
    this.minimumContractYearLimit = data.minimum_contract_year_limit
    this.requireBoardApprovalToTerminate = data.require_board_approval_to_terminate
    this.requireRegularReporting = data.require_regular_reporting
    this.isNonDelegationOfPowers = data.is_non_delegation_of_powers
    this.requireComplianceWithPolicies = data.require_compliance_with_policies
  }

  cloneDetails(data: CompanyConstitutionSettingScopeDutiesAuthority): void {
    super.clone(data)
    this.isOverseeDayToDay = data.isOverseeDayToDay
    this.isSuperviseDepartments = data.isSuperviseDepartments
    this.isSignContract = data.isSignContract
    this.isExerciseFinancialAuthority = data.isExerciseFinancialAuthority
    this.isImplementPolicies = data.isImplementPolicies
    this.isMakeOperationalDecisions = data.isMakeOperationalDecisions
    this.isRepresentCompany = data.isRepresentCompany
    this.isHireManageEmployees = data.isHireManageEmployees
    this.requireBoardApprovalForTransaction = data.requireBoardApprovalForTransaction
    this.minimumTransactionLimit = data.minimumTransactionLimit
    this.requireBoardApprovalForContractYear = data.requireBoardApprovalForContractYear
    this.minimumContractYearLimit = data.minimumContractYearLimit
    this.requireBoardApprovalToTerminate = data.requireBoardApprovalToTerminate
    this.requireRegularReporting = data.requireRegularReporting
    this.isNonDelegationOfPowers = data.isNonDelegationOfPowers
    this.requireComplianceWithPolicies = data.requireComplianceWithPolicies
  }

  getRequestBody(): object {
    return {
      is_oversee_day_to_day: this.isOverseeDayToDay,
      is_supervise_departments: this.isSuperviseDepartments,
      is_sign_contract: this.isSignContract,
      is_exercise_financial_authority: this.isExerciseFinancialAuthority,
      is_implement_policies: this.isImplementPolicies,
      is_make_operational_decisions: this.isMakeOperationalDecisions,
      is_represent_company: this.isRepresentCompany,
      is_hire_manage_employees: this.isHireManageEmployees,
      require_board_approval_for_transaction: this.requireBoardApprovalForTransaction,
      minimum_transaction_limit: this.minimumTransactionLimit,
      require_board_approval_for_contract_year: this.requireBoardApprovalForContractYear,
      minimum_contract_year_limit: this.minimumContractYearLimit,
      require_board_approval_to_terminate: this.requireBoardApprovalToTerminate,
      require_regular_reporting: this.requireRegularReporting,
      is_non_delegation_of_powers: this.isNonDelegationOfPowers,
      require_compliance_with_policies: this.requireComplianceWithPolicies,
    }
  }

  canSubmit(): boolean {
    if (
      (this.requireBoardApprovalForTransaction && this.minimumTransactionLimit === null) ||
      (this.requireBoardApprovalForContractYear && this.minimumContractYearLimit === null)
    ) {
      return false
    }

    return true
  }
}
