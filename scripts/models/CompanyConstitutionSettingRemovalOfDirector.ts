import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingRemovalOfDirector extends CompanyConstitutionSettingItem {
  canDirectorBeRemovedByMembers: boolean = false
  isMisconductOrBreach: boolean = false
  isPersistentAbsence: boolean = false
  isConflictOfInterest: boolean = false
  isFailedToComply: boolean = false
  isDisqualified: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingRemovalOfDirector) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.canDirectorBeRemovedByMembers = data.can_director_be_removed_by_members
    this.isMisconductOrBreach = data.is_misconduct_or_breach
    this.isPersistentAbsence = data.is_persistent_absence
    this.isConflictOfInterest = data.is_conflict_of_interest
    this.isFailedToComply = data.is_failed_to_comply
    this.isDisqualified = data.is_disqualified
  }

  cloneDetails(data: CompanyConstitutionSettingRemovalOfDirector): void {
    super.clone(data)
    this.canDirectorBeRemovedByMembers = data.canDirectorBeRemovedByMembers
    this.isMisconductOrBreach = data.isMisconductOrBreach
    this.isPersistentAbsence = data.isPersistentAbsence
    this.isConflictOfInterest = data.isConflictOfInterest
    this.isFailedToComply = data.isFailedToComply
    this.isDisqualified = data.isDisqualified
  }

  getRequestBody(): object {
    return {
      can_director_be_removed_by_members: this.canDirectorBeRemovedByMembers,
      is_misconduct_or_breach: this.isMisconductOrBreach,
      is_persistent_absence: this.isPersistentAbsence,
      is_conflict_of_interest: this.isConflictOfInterest,
      is_failed_to_comply: this.isFailedToComply,
      is_disqualified: this.isDisqualified,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
