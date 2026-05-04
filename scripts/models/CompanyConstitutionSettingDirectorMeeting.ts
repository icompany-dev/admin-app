import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingDirectorMeeting extends CompanyConstitutionSettingItem {
  isAtLeastOnceEveryQuarter: boolean = false
  isAtLeastTwiceAYear: boolean = false
  isAccordingToSchedule: boolean = false
  canByConvenedByDirector: boolean = false
  canBeConvenedByChairman: boolean = false
  canBeConvenedBySecretary: boolean = false
  canBeConvenedByManagingDirector: boolean = false
  isNoticeNotLessThanLimit: boolean = false
  noticePeriodLimit: number | null = null // cannot be null if above is true
  isNoticeInAnyPeriod: boolean = false
  isNoMinimumNoticePeriod: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingDirectorMeeting) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isAtLeastOnceEveryQuarter = data.is_at_least_once_every_quarter
    this.isAtLeastTwiceAYear = data.is_at_least_twice_a_year
    this.isAccordingToSchedule = data.is_according_to_schedule
    this.canByConvenedByDirector = data.can_by_convened_by_director
    this.canBeConvenedByChairman = data.can_be_convened_by_chairman
    this.canBeConvenedBySecretary = data.can_be_convened_by_secretary
    this.canBeConvenedByManagingDirector = data.can_be_convened_by_managing_director
    this.isNoticeNotLessThanLimit = data.is_notice_not_less_than_limit
    this.noticePeriodLimit = data.notice_period_limit
    this.isNoticeInAnyPeriod = data.is_notice_in_any_period
    this.isNoMinimumNoticePeriod = data.is_no_minimum_notice_period
  }

  cloneDetails(data: CompanyConstitutionSettingDirectorMeeting): void {
    super.clone(data)
    this.isAtLeastOnceEveryQuarter = data.isAtLeastOnceEveryQuarter
    this.isAtLeastTwiceAYear = data.isAtLeastTwiceAYear
    this.isAccordingToSchedule = data.isAccordingToSchedule
    this.canByConvenedByDirector = data.canByConvenedByDirector
    this.canBeConvenedByChairman = data.canBeConvenedByChairman
    this.canBeConvenedBySecretary = data.canBeConvenedBySecretary
    this.canBeConvenedByManagingDirector = data.canBeConvenedByManagingDirector
    this.isNoticeNotLessThanLimit = data.isNoticeNotLessThanLimit
    this.noticePeriodLimit = data.noticePeriodLimit
    this.isNoticeInAnyPeriod = data.isNoticeInAnyPeriod
    this.isNoMinimumNoticePeriod = data.isNoMinimumNoticePeriod
  }

  getRequestBody(): object {
    return {
      is_at_least_once_every_quarter: this.isAtLeastOnceEveryQuarter,
      is_at_least_twice_a_year: this.isAtLeastTwiceAYear,
      is_according_to_schedule: this.isAccordingToSchedule,
      can_by_convened_by_director: this.canByConvenedByDirector,
      can_be_convened_by_chairman: this.canBeConvenedByChairman,
      can_be_convened_by_secretary: this.canBeConvenedBySecretary,
      can_be_convened_by_managing_director: this.canBeConvenedByManagingDirector,
      is_notice_not_less_than_limit: this.isNoticeNotLessThanLimit,
      notice_period_limit: this.noticePeriodLimit,
      is_notice_in_any_period: this.isNoticeInAnyPeriod,
      is_no_minimum_notice_period: this.isNoMinimumNoticePeriod,
    }
  }

  canSubmit(): boolean {
    if (this.isNoticeNotLessThanLimit && this.noticePeriodLimit === null) {
      return false
    }

    return true
  }
}
