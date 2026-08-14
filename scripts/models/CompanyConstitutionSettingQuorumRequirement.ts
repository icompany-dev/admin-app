import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingQuorumRequirement extends CompanyConstitutionSettingItem {
  isRequireTwoMembers: boolean = false
  isRequireOneMemberForAdjournedMeeting: boolean = false
  isRequiredOneMemberForSingleShareholder: boolean = false
  isRequireAnyNumbers: boolean = false
  minimumNumberOfQuorum: number | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingQuorumRequirement) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isRequireTwoMembers = data.is_require_two_members
    this.isRequireOneMemberForAdjournedMeeting = data.is_require_one_member_for_adjourned
    this.isRequiredOneMemberForSingleShareholder = data.is_required_one_member_for_single
    this.isRequireAnyNumbers = data.is_require_any_numbers
    this.minimumNumberOfQuorum = data.minimum_number_of_quorum
  }

  cloneDetails(data: CompanyConstitutionSettingQuorumRequirement): void {
    super.clone(data)
    this.isRequireTwoMembers = data.isRequireTwoMembers
    this.isRequireOneMemberForAdjournedMeeting = data.isRequireOneMemberForAdjournedMeeting
    this.isRequiredOneMemberForSingleShareholder = data.isRequiredOneMemberForSingleShareholder
    this.isRequireAnyNumbers = data.isRequireAnyNumbers
    this.minimumNumberOfQuorum = data.minimumNumberOfQuorum
  }

  getRequestBody(): object {
    return {
      is_require_two_members: this.isRequireTwoMembers,
      is_require_one_member_for_adjourned: this.isRequireOneMemberForAdjournedMeeting,
      is_required_one_member_for_single: this.isRequiredOneMemberForSingleShareholder,
      is_require_any_numbers: this.isRequireAnyNumbers,
      minimum_number_of_quorum: this.minimumNumberOfQuorum,
    }
  }

  canSubmit(): boolean {
    if (this.isRequireAnyNumbers && this.minimumNumberOfQuorum === null) {
      return false
    }

    return true
  }
}
