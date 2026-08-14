import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingNoticeOfMeeting extends CompanyConstitutionSettingItem {
  isNotLessThan14Days: boolean = true
  isNotLessThan21Days: boolean = false
  isAnyPeriodDeterminedByBoard: boolean = false
  isShorterNoticeIfAgreedByMembers: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingNoticeOfMeeting) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isNotLessThan14Days = data.is_not_less_than14_days
    this.isNotLessThan21Days = data.is_not_less_than21_days
    this.isAnyPeriodDeterminedByBoard = data.is_any_period
    this.isShorterNoticeIfAgreedByMembers = data.is_shorter_notice
  }

  cloneDetails(data: CompanyConstitutionSettingNoticeOfMeeting): void {
    super.clone(data)
    this.isNotLessThan14Days = data.isNotLessThan14Days
    this.isNotLessThan21Days = data.isNotLessThan21Days
    this.isAnyPeriodDeterminedByBoard = data.isAnyPeriodDeterminedByBoard
    this.isShorterNoticeIfAgreedByMembers = data.isShorterNoticeIfAgreedByMembers
  }

  getRequestBody(): object {
    return {
      is_not_less_than14_days: this.isNotLessThan14Days,
      is_not_less_than21_days: this.isNotLessThan21Days,
      is_any_period: this.isAnyPeriodDeterminedByBoard,
      is_shorter_notice: this.isShorterNoticeIfAgreedByMembers,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
