import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingMethodToAppointDirector extends CompanyConstitutionSettingItem {
  isOrdinaryResolution: boolean = false
  isResolutionForCasualVacancy: boolean = false
  isResolutionSubjectToConfirmation: boolean = false
  isByFounderWithMinPercentage: boolean = false
  minPercentageByFounder: number | null = null // cannot be null if above is true
  isInvestorsWithPreferenceShares: boolean = false
  isUntilRemoved: boolean = false
  isUntilResignation: boolean = false
  isForFixedTerm: boolean = false
  fixedTermForAppointment: number | null = null // cannot be null if above is true
  isSubjectToPerformanceReview: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingMethodToAppointDirector) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isOrdinaryResolution = data.is_ordinary_resolution
    this.isResolutionForCasualVacancy = data.is_resolution_for_casual_vacancy
    this.isResolutionSubjectToConfirmation = data.is_resolution_subject_to_confirmation
    this.isByFounderWithMinPercentage = data.is_by_founder_with_min_percentage
    this.minPercentageByFounder = data.min_percentage_by_founder
    this.isInvestorsWithPreferenceShares = data.is_investors_with_preference_shares
    this.isUntilRemoved = data.is_until_removed
    this.isUntilResignation = data.is_until_resignation
    this.isForFixedTerm = data.is_for_fixed_term
    this.fixedTermForAppointment = data.fixed_term_for_appointment
    this.isSubjectToPerformanceReview = data.is_subject_to_performance_review
  }

  cloneDetails(data: CompanyConstitutionSettingMethodToAppointDirector): void {
    super.clone(data)
    this.isOrdinaryResolution = data.isOrdinaryResolution
    this.isResolutionForCasualVacancy = data.isResolutionForCasualVacancy
    this.isResolutionSubjectToConfirmation = data.isResolutionSubjectToConfirmation
    this.isByFounderWithMinPercentage = data.isByFounderWithMinPercentage
    this.minPercentageByFounder = data.minPercentageByFounder
    this.isInvestorsWithPreferenceShares = data.isInvestorsWithPreferenceShares
    this.isUntilRemoved = data.isUntilRemoved
    this.isUntilResignation = data.isUntilResignation
    this.isForFixedTerm = data.isForFixedTerm
    this.fixedTermForAppointment = data.fixedTermForAppointment
    this.isSubjectToPerformanceReview = data.isSubjectToPerformanceReview
  }

  getRequestBody(): object {
    return {
      is_ordinary_resolution: this.isOrdinaryResolution,
      is_resolution_for_casual_vacancy: this.isResolutionForCasualVacancy,
      is_resolution_subject_to_confirmation: this.isResolutionSubjectToConfirmation,
      is_by_founder_with_min_percentage: this.isByFounderWithMinPercentage,
      min_percentage_by_founder: this.minPercentageByFounder,
      is_investors_with_preference_shares: this.isInvestorsWithPreferenceShares,
      is_until_removed: this.isUntilRemoved,
      is_until_resignation: this.isUntilResignation,
      is_for_fixed_term: this.isForFixedTerm,
      fixed_term_for_appointment: this.fixedTermForAppointment,
      is_subject_to_performance_review: this.isSubjectToPerformanceReview,
    }
  }

  canSubmit(): boolean {
    if (
      (this.minPercentageByFounder && this.minPercentageByFounder === null) ||
      (this.isForFixedTerm && this.fixedTermForAppointment === null)
    ) {
      return false
    }

    return true
  }
}
