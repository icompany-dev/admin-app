import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingElectronicParticipation extends CompanyConstitutionSettingItem {
  isParticipationCountsAsPresent: boolean = false
  isVotesCastValid: boolean = false
  isResoPassedInMalaysiaTime: boolean = false
  isMinutesRecordPlatformAndParticipation: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingElectronicParticipation) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isParticipationCountsAsPresent = data.is_participation_counts_as_present
    this.isVotesCastValid = data.is_votes_cast_valid
    this.isResoPassedInMalaysiaTime = data.is_reso_passed_in_malaysia_time
    this.isMinutesRecordPlatformAndParticipation = data.is_minutes_record_platform_and_participation
  }

  cloneDetails(data: CompanyConstitutionSettingElectronicParticipation): void {
    super.clone(data)
    this.isParticipationCountsAsPresent = data.isParticipationCountsAsPresent
    this.isVotesCastValid = data.isVotesCastValid
    this.isResoPassedInMalaysiaTime = data.isResoPassedInMalaysiaTime
    this.isMinutesRecordPlatformAndParticipation = data.isMinutesRecordPlatformAndParticipation
  }

  getRequestBody(): object {
    return {
      is_participation_counts_as_present: this.isParticipationCountsAsPresent,
      is_votes_cast_valid: this.isVotesCastValid,
      is_reso_passed_in_malaysia_time: this.isResoPassedInMalaysiaTime,
      is_minutes_record_platform_and_participation: this.isMinutesRecordPlatformAndParticipation,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
