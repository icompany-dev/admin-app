import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingQuorumForBoard extends CompanyConstitutionSettingItem {
  isQuorumTwoDirectors: boolean = false
  isQuorumMajority: boolean = false
  isQuorumMinimumDirectorLimit: boolean = false
  minimumQuorumLimit: number | null = null
  isQuorumMustIncludeResidentDirector: boolean = false
  isQuorumMustIncludeAppointedDirector: boolean = false
  isAdjournMeetingToDateIfFail: boolean = false
  isAutoAdjournMeetingIfFail: boolean = false
  isDissolvedIfFail: boolean = false
  canParticipateElectronic: boolean = false
  isVideoParticipationPresent: boolean = false
  isObserversNotCountToQuorum: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingQuorumForBoard) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isQuorumTwoDirectors = data.is_quorum_two_directors
    this.isQuorumMajority = data.is_quorum_majority
    this.isQuorumMinimumDirectorLimit = data.is_quorum_minimum_director_limit
    this.minimumQuorumLimit = data.minimum_quorum_limit
    this.isQuorumMustIncludeResidentDirector = data.is_quorum_must_include_resident_director
    this.isQuorumMustIncludeAppointedDirector = data.is_quorum_must_include_appointed_director
    this.isAdjournMeetingToDateIfFail = data.is_adjourn_meeting_to_date_if_fail
    this.isAutoAdjournMeetingIfFail = data.is_auto_adjourn_meeting_if_fail
    this.isDissolvedIfFail = data.is_dissolved_if_fail
    this.canParticipateElectronic = data.can_participate_electronic
    this.isVideoParticipationPresent = data.is_video_participation_present
    this.isObserversNotCountToQuorum = data.is_observers_not_count_to_quorum
  }

  cloneDetails(data: CompanyConstitutionSettingQuorumForBoard): void {
    super.clone(data)
    this.isQuorumTwoDirectors = data.isQuorumTwoDirectors
    this.isQuorumMajority = data.isQuorumMajority
    this.isQuorumMinimumDirectorLimit = data.isQuorumMinimumDirectorLimit
    this.minimumQuorumLimit = data.minimumQuorumLimit
    this.isQuorumMustIncludeResidentDirector = data.isQuorumMustIncludeResidentDirector
    this.isQuorumMustIncludeAppointedDirector = data.isQuorumMustIncludeAppointedDirector
    this.isAdjournMeetingToDateIfFail = data.isAdjournMeetingToDateIfFail
    this.isAutoAdjournMeetingIfFail = data.isAutoAdjournMeetingIfFail
    this.isDissolvedIfFail = data.isDissolvedIfFail
    this.canParticipateElectronic = data.canParticipateElectronic
    this.isVideoParticipationPresent = data.isVideoParticipationPresent
    this.isObserversNotCountToQuorum = data.isObserversNotCountToQuorum
  }

  getRequestBody(): object {
    return {
      is_quorum_two_directors: this.isQuorumTwoDirectors,
      is_quorum_majority: this.isQuorumMajority,
      is_quorum_minimum_director_limit: this.isQuorumMinimumDirectorLimit,
      minimum_quorum_limit: this.minimumQuorumLimit,
      is_quorum_must_include_resident_director: this.isQuorumMustIncludeResidentDirector,
      is_quorum_must_include_appointed_director: this.isQuorumMustIncludeAppointedDirector,
      is_adjourn_meeting_to_date_if_fail: this.isAdjournMeetingToDateIfFail,
      is_auto_adjourn_meeting_if_fail: this.isAutoAdjournMeetingIfFail,
      is_dissolved_if_fail: this.isDissolvedIfFail,
      can_participate_electronic: this.canParticipateElectronic,
      is_video_participation_present: this.isVideoParticipationPresent,
      is_observers_not_count_to_quorum: this.isObserversNotCountToQuorum,
    }
  }

  canSubmit(): boolean {
    if (this.isQuorumMinimumDirectorLimit && this.minimumQuorumLimit === null) {
      return false
    }

    return true
  }
}
