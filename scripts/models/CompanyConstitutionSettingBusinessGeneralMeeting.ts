import { CompanyConstitutionSettingItem } from "./CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingBusinessGeneralMeeting extends CompanyConstitutionSettingItem {
  isConsiderationOfAudit: boolean = true
  isApprovalOfDirectorsFees: boolean = false
  isForAppointmentOfAuditors: boolean = false
  isFixingRenumerationOfAuditors: boolean = false
  isAnySpecialBusinessNotified: boolean = false
  isAdoptionOrAmendmentOfConstitution: boolean = false
  isDeclarationOfDividends: boolean = false
  isOthersProvidedInAgenda: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingBusinessGeneralMeeting) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isConsiderationOfAudit = data.is_consideration_of_audit
    this.isApprovalOfDirectorsFees = data.is_approval_of_directors_fees
    this.isForAppointmentOfAuditors = data.is_for_appointment_of_auditors
    this.isFixingRenumerationOfAuditors = data.is_fixing_renumeration_of_auditors
    this.isAnySpecialBusinessNotified = data.is_any_special_business_notified
    this.isAdoptionOrAmendmentOfConstitution = data.is_adoption_or_amendment_of_constitution
    this.isDeclarationOfDividends = data.is_declaration_of_dividends
    this.isOthersProvidedInAgenda = data.is_others_provided_in_agenda
  }

  cloneDetails(data: CompanyConstitutionSettingBusinessGeneralMeeting): void {
    super.clone(data)
    this.isConsiderationOfAudit = data.isConsiderationOfAudit
    this.isApprovalOfDirectorsFees = data.isApprovalOfDirectorsFees
    this.isForAppointmentOfAuditors = data.isForAppointmentOfAuditors
    this.isFixingRenumerationOfAuditors = data.isFixingRenumerationOfAuditors
    this.isAnySpecialBusinessNotified = data.isAnySpecialBusinessNotified
    this.isAdoptionOrAmendmentOfConstitution = data.isAdoptionOrAmendmentOfConstitution
    this.isDeclarationOfDividends = data.isDeclarationOfDividends
    this.isOthersProvidedInAgenda = data.isOthersProvidedInAgenda
  }

  getRequestBody(): object {
    return {
      is_consideration_of_audit: this.isConsiderationOfAudit,
      is_approval_of_directors_fees: this.isApprovalOfDirectorsFees,
      is_for_appointment_of_auditors: this.isForAppointmentOfAuditors,
      is_fixing_renumeration_of_auditors: this.isFixingRenumerationOfAuditors,
      is_any_special_business_notified: this.isAnySpecialBusinessNotified,
      is_adoption_or_amendment_of_constitution: this.isAdoptionOrAmendmentOfConstitution,
      is_declaration_of_dividends: this.isDeclarationOfDividends,
      is_others_provided_in_agenda: this.isOthersProvidedInAgenda,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
