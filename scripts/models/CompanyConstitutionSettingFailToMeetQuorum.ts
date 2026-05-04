import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingFailToMeetQuorum extends CompanyConstitutionSettingItem {
  isMeetingDissolved: boolean = false
  isMeetingAdjourned: boolean = false
  isDirectorsToFixAnotherDate: boolean = false
  isNoFurtherNoticeRequired: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingFailToMeetQuorum) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isMeetingDissolved = data.is_meeting_dissolved
    this.isMeetingAdjourned = data.is_meeting_adjourned
    this.isDirectorsToFixAnotherDate = data.is_directors_to_fix_another_date
    this.isNoFurtherNoticeRequired = data.is_no_further_notice_required
  }

  cloneDetails(data: CompanyConstitutionSettingFailToMeetQuorum): void {
    super.clone(data)
    this.isMeetingDissolved = data.isMeetingDissolved
    this.isMeetingAdjourned = data.isMeetingAdjourned
    this.isDirectorsToFixAnotherDate = data.isDirectorsToFixAnotherDate
    this.isNoFurtherNoticeRequired = data.isNoFurtherNoticeRequired
  }

  getRequestBody(): object {
    return {
      is_meeting_dissolved: this.isMeetingDissolved,
      is_meeting_adjourned: this.isMeetingAdjourned,
      is_directors_to_fix_another_date: this.isDirectorsToFixAnotherDate,
      is_no_further_notice_required: this.isNoFurtherNoticeRequired,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
