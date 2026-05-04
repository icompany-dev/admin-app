import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingManagingDirector extends CompanyConstitutionSettingItem {
  isAppointmentBySimpleMajority: boolean = false
  isAppointmentByOrdinaryResolution: boolean = false
  isAppointmentBySpecialResolution: boolean = false
  isAppointmentByUnanimousConsent: boolean = false
  isTerminableAtWill: boolean = false
  hasDefinedLimitedContract: boolean = false
  isSubjectToShareholdersAgreement: boolean = false
  requirePriorApproval: boolean = false
  isSubjectToAnyRegulatory: boolean = false
  isResignedIfNotDirector: boolean = false
  cannotBeCeo: boolean = false
  canBeCeoWithApproval: boolean = false
  isSubjectToReview: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingManagingDirector) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isAppointmentBySimpleMajority = data.is_appointment_by_simple_majority
    this.isAppointmentByOrdinaryResolution = data.is_appointment_by_ordinary_resolution
    this.isAppointmentBySpecialResolution = data.is_appointment_by_special_resolution
    this.isAppointmentByUnanimousConsent = data.is_appointment_by_unanimous_consent
    this.isTerminableAtWill = data.is_terminable_at_will
    this.hasDefinedLimitedContract = data.has_defined_limited_contract
    this.isSubjectToShareholdersAgreement = data.is_subject_to_shareholders_agreement
    this.requirePriorApproval = data.require_prior_approval
    this.isSubjectToAnyRegulatory = data.is_subject_to_any_regulatory
    this.isResignedIfNotDirector = data.is_resigned_if_not_director
    this.cannotBeCeo = data.cannot_be_ceo
    this.canBeCeoWithApproval = data.can_be_ceo_with_approval
    this.isSubjectToReview = data.is_subject_to_review
  }

  cloneDetails(data: CompanyConstitutionSettingManagingDirector): void {
    super.clone(data)
    this.isAppointmentBySimpleMajority = data.isAppointmentBySimpleMajority
    this.isAppointmentByOrdinaryResolution = data.isAppointmentByOrdinaryResolution
    this.isAppointmentBySpecialResolution = data.isAppointmentBySpecialResolution
    this.isAppointmentByUnanimousConsent = data.isAppointmentByUnanimousConsent
    this.isTerminableAtWill = data.isTerminableAtWill
    this.hasDefinedLimitedContract = data.hasDefinedLimitedContract
    this.isSubjectToShareholdersAgreement = data.isSubjectToShareholdersAgreement
    this.requirePriorApproval = data.requirePriorApproval
    this.isSubjectToAnyRegulatory = data.isSubjectToAnyRegulatory
    this.isResignedIfNotDirector = data.isResignedIfNotDirector
    this.cannotBeCeo = data.cannotBeCeo
    this.canBeCeoWithApproval = data.canBeCeoWithApproval
    this.isSubjectToReview = data.isSubjectToReview
  }

  getRequestBody(): object {
    return {
      is_appointment_by_simple_majority: this.isAppointmentBySimpleMajority,
      is_appointment_by_ordinary_resolution: this.isAppointmentByOrdinaryResolution,
      is_appointment_by_special_resolution: this.isAppointmentBySpecialResolution,
      is_appointment_by_unanimous_consent: this.isAppointmentByUnanimousConsent,
      is_terminable_at_will: this.isTerminableAtWill,
      has_defined_limited_contract: this.hasDefinedLimitedContract,
      is_subject_to_shareholders_agreement: this.isSubjectToShareholdersAgreement,
      require_prior_approval: this.requirePriorApproval,
      is_subject_to_any_regulatory: this.isSubjectToAnyRegulatory,
      is_resigned_if_not_director: this.isResignedIfNotDirector,
      cannot_be_ceo: this.cannotBeCeo,
      can_be_ceo_with_approval: this.canBeCeoWithApproval,
      is_subject_to_review: this.isSubjectToReview,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
