import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingWrittenResolution extends CompanyConstitutionSettingItem {
  isASimpleMajority: boolean = false
  isNotLessThanPercentage: boolean = false
  isOtherMajorityRequireByAct: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingWrittenResolution) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isASimpleMajority = data.is_a_simple_majority
    this.isNotLessThanPercentage = data.is_not_less_than_percentage
    this.isOtherMajorityRequireByAct = data.is_other_majority_require_by_act
  }

  cloneDetails(data: CompanyConstitutionSettingWrittenResolution): void {
    super.clone(data)
    this.isASimpleMajority = data.isASimpleMajority
    this.isNotLessThanPercentage = data.isNotLessThanPercentage
    this.isOtherMajorityRequireByAct = data.isOtherMajorityRequireByAct
  }

  getRequestBody(): object {
    return {
      is_a_simple_majority: this.isASimpleMajority,
      is_not_less_than_percentage: this.isNotLessThanPercentage,
      is_other_majority_require_by_act: this.isOtherMajorityRequireByAct,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
