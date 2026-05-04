import { CompanyConstitutionSettingItem } from "./CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingConveningMeeting extends CompanyConstitutionSettingItem {
  canConvenedByMemberWithMinPercentage: boolean = false
  minimumPercentageToConveneMeeting: number | null = null
  canConvenedByAnyMemberWithPercentage: boolean = false
  canConvenedByRequisition: boolean = false
  canExercisePowerByResoAtGeneralMeeting: boolean = false
  canExercisePowerByResoAtEorHybridMeeting: boolean = false
  canExercisePowerByWrittenResoWithoutMeeting: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingConveningMeeting) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.canConvenedByMemberWithMinPercentage = data.can_convened_by_with_min_percentage
    this.minimumPercentageToConveneMeeting = data.minimum_percentage_limit
    this.canConvenedByAnyMemberWithPercentage = data.can_convened_by_with_percentage
    this.canConvenedByRequisition = data.can_convened_by_requisition
    this.canExercisePowerByResoAtGeneralMeeting = data.can_exercise_power_at_general_meeting
    this.canExercisePowerByResoAtEorHybridMeeting = data.can_exercise_power_at_eor_hybrid_meeting
    this.canExercisePowerByWrittenResoWithoutMeeting = data.can_exercise_power_reso_without_meeting
  }

  cloneDetails(data: CompanyConstitutionSettingConveningMeeting): void {
    super.clone(data)
    this.canConvenedByMemberWithMinPercentage = data.canConvenedByMemberWithMinPercentage
    this.minimumPercentageToConveneMeeting = data.minimumPercentageToConveneMeeting
    this.canConvenedByAnyMemberWithPercentage = data.canConvenedByAnyMemberWithPercentage
    this.canConvenedByRequisition = data.canConvenedByRequisition
    this.canExercisePowerByResoAtGeneralMeeting = data.canExercisePowerByResoAtGeneralMeeting
    this.canExercisePowerByResoAtEorHybridMeeting = data.canExercisePowerByResoAtEorHybridMeeting
    this.canExercisePowerByWrittenResoWithoutMeeting = data.canExercisePowerByWrittenResoWithoutMeeting
  }

  getRequestBody(): object {
    return {
      can_convened_by_with_min_percentage: this.canConvenedByMemberWithMinPercentage,
      minimum_percentage_limit: this.minimumPercentageToConveneMeeting,
      can_convened_by_with_percentage: this.canConvenedByAnyMemberWithPercentage,
      can_convened_by_requisition: this.canConvenedByRequisition,
      can_exercise_power_at_general_meeting: this.canExercisePowerByResoAtGeneralMeeting,
      can_exercise_power_at_eor_hybrid_meeting: this.canExercisePowerByResoAtEorHybridMeeting,
      can_exercise_power_reso_without_meeting: this.canExercisePowerByWrittenResoWithoutMeeting,
    }
  }

  canSubmit(): boolean {
    if (this.canConvenedByMemberWithMinPercentage && this.minimumPercentageToConveneMeeting === null) {
      return false
    }

    return true
  }
}
