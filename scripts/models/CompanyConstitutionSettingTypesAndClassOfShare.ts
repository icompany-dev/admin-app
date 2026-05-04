import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingTypesAndClassOfShare extends CompanyConstitutionSettingItem {
  hasOrdinaryShares: boolean = false
  hasPreferenceShares: boolean = false
  hasOtherClassOfShares: boolean = false
  isApprovalOfSharesBySpecialResolution: boolean = false
  isApprovalOfSharesByUnanimousConsent: boolean = false
  isRightsAttachMustBeExpressInConstitution: boolean = false
  isNoRightsAttachUnlessApprovedByMembers: boolean = false
  isShareRightsInScheduleAttached: boolean = false // Must attach schedule if true, no?

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingTypesAndClassOfShare) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.hasOrdinaryShares = data.has_ordinary_shares
    this.hasPreferenceShares = data.has_preference_shares
    this.hasOtherClassOfShares = data.has_other_class_of_shares
    this.isApprovalOfSharesBySpecialResolution = data.is_approve_by_special_resolution
    this.isApprovalOfSharesByUnanimousConsent = data.is_approve_by_unanimous_consent
    this.isRightsAttachMustBeExpressInConstitution = data.is_rights_attach_in_constitution
    this.isNoRightsAttachUnlessApprovedByMembers = data.is_require_approval_for_rights
    this.isShareRightsInScheduleAttached = data.is_share_rights_in_schedule_attached
  }

  cloneDetails(data: CompanyConstitutionSettingTypesAndClassOfShare): void {
    super.clone(data)
    this.hasOrdinaryShares = data.hasOrdinaryShares
    this.hasPreferenceShares = data.hasPreferenceShares
    this.hasOtherClassOfShares = data.hasOtherClassOfShares
    this.isApprovalOfSharesBySpecialResolution = data.isApprovalOfSharesBySpecialResolution
    this.isApprovalOfSharesByUnanimousConsent = data.isApprovalOfSharesByUnanimousConsent
    this.isRightsAttachMustBeExpressInConstitution = data.isRightsAttachMustBeExpressInConstitution
    this.isNoRightsAttachUnlessApprovedByMembers = data.isNoRightsAttachUnlessApprovedByMembers
    this.isShareRightsInScheduleAttached = data.isShareRightsInScheduleAttached
  }

  getRequestBody(): object {
    return {
      has_ordinary_shares: this.hasOrdinaryShares,
      has_preference_shares: this.hasPreferenceShares,
      has_other_class_of_shares: this.hasOtherClassOfShares,
      is_approve_by_special_resolution: this.isApprovalOfSharesBySpecialResolution,
      is_approve_by_unanimous_consent: this.isApprovalOfSharesByUnanimousConsent,
      is_rights_attach_in_constitution: this.isRightsAttachMustBeExpressInConstitution,
      is_require_approval_for_rights: this.isNoRightsAttachUnlessApprovedByMembers,
      is_share_rights_in_schedule_attached: this.isShareRightsInScheduleAttached,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
