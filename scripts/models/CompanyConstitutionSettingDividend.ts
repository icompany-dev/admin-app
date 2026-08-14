import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingDividend extends CompanyConstitutionSettingItem {
  isInterimDividends: boolean = false
  isFinalDividends: boolean = true
  isSatisfiedByAnyDirector: boolean = false
  isSatisfiedBySimpleMajority: boolean = false
  isSatisfiedByMajorityLimit: boolean = false
  minimumMajorityLimit: number | null = null
  isSatisfiedByUnanimousApproval: boolean = false
  isSatisfiedByApprovalAll: boolean = false
  isSatisfiedByApprovalShareholder: boolean = false
  isApprovedByMcr: boolean = false
  isApprovedBySpecialResolution: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingDividend) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isInterimDividends = data.is_interim_dividends
    this.isFinalDividends = data.is_final_dividends
    this.isSatisfiedByAnyDirector = data.is_satisfied_by_any_director
    this.isSatisfiedBySimpleMajority = data.is_satisfied_by_simple_majority
    this.isSatisfiedByMajorityLimit = data.is_satisfied_by_majority_limit
    this.minimumMajorityLimit = data.minimum_majority_limit
    this.isSatisfiedByUnanimousApproval = data.is_satisfied_by_unanimous_approval
    this.isSatisfiedByApprovalAll = data.is_satisfied_by_approval_all
    this.isSatisfiedByApprovalShareholder = data.is_satisfied_by_approval_shareholder
    this.isApprovedByMcr = data.is_approved_by_mcr
    this.isApprovedBySpecialResolution = data.is_approved_by_special_resolution
  }

  cloneDetails(data: CompanyConstitutionSettingDividend): void {
    super.clone(data)
    this.isInterimDividends = data.isInterimDividends
    this.isFinalDividends = data.isFinalDividends
    this.isSatisfiedByAnyDirector = data.isSatisfiedByAnyDirector
    this.isSatisfiedBySimpleMajority = data.isSatisfiedBySimpleMajority
    this.isSatisfiedByMajorityLimit = data.isSatisfiedByMajorityLimit
    this.minimumMajorityLimit = data.minimumMajorityLimit
    this.isSatisfiedByUnanimousApproval = data.isSatisfiedByUnanimousApproval
    this.isSatisfiedByApprovalAll = data.isSatisfiedByApprovalAll
    this.isSatisfiedByApprovalShareholder = data.isSatisfiedByApprovalShareholder
    this.isApprovedByMcr = data.isApprovedByMcr
    this.isApprovedBySpecialResolution = data.isApprovedBySpecialResolution
  }

  getRequestBody(): object {
    return {
      is_interim_dividends: this.isInterimDividends,
      is_final_dividends: this.isFinalDividends,
      is_satisfied_by_any_director: this.isSatisfiedByAnyDirector,
      is_satisfied_by_simple_majority: this.isSatisfiedBySimpleMajority,
      is_satisfied_by_majority_limit: this.isSatisfiedByMajorityLimit,
      minimum_majority_limit: this.minimumMajorityLimit,
      is_satisfied_by_unanimous_approval: this.isSatisfiedByUnanimousApproval,
      is_satisfied_by_approval_all: this.isSatisfiedByApprovalAll,
      is_satisfied_by_approval_shareholder: this.isSatisfiedByApprovalShareholder,
      is_approved_by_mcr: this.isApprovedByMcr,
      is_approved_by_special_resolution: this.isApprovedBySpecialResolution,
    }
  }

  canSubmit(): boolean {
    if (this.isSatisfiedByMajorityLimit && this.minimumMajorityLimit === null) {
      return false
    }

    return true
  }
}
