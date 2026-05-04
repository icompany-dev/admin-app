import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingAllotmentAndPRN extends CompanyConstitutionSettingItem {
  isAuthorityByApprovalViaOrdinary: boolean = true // default
  isAuthorityBeByMinPercentageWithoutApproval: boolean = false
  percentageOfSharesToAllotWithoutApproval: number | null = null // cannot be null if above is true
  isAuthorityByApprovalViaSpecialForNonOrdinary: boolean = false
  isAuthorityByUnanimousConsentNewInvestors: boolean = false
  isRightsOfNewDeterminedByTheBoard: boolean = false
  isRightsOfNewPreApprovedByExistingMembers: boolean = false
  isRightsOfNewNoConflictsWithExisting: boolean = false
  hasToComplyWithSection85: boolean = false
  hasNoSpecialRightsPreferenceShares: boolean = false
  isDirectorsAuthorityRenewableAnnually: boolean = false
  hasExemptionWayForPrn: boolean = false
  canExemptPrnByOrdinaryResolution: boolean = false
  canExemptPrnBySpecialResolution: boolean = false
  canExemptPrnByUnanimousConsent: boolean = false
  canExemptPrnByShareholder: boolean = false
  shareholderIdToApprovePrnExemption: string | null = null //Cannot be null if above is true
  isNewIssuedTermsByMembersViaResolution: boolean = false
  isNewIssuedTermsByDirectorsWithinMandate: boolean = false
  isNewIssuedTermsProvidedByConstitution: boolean = false
  canAlterShareByIncreaseShareCapital: boolean = false
  canAlterShareByReduceShareCapital: boolean = false
  canReduceShareCapitalBySolvency: boolean = false
  canReduceShareCapitalByCourtOrder: boolean = false
  canAlterShareByConvertingShareCapital: boolean = false
  canAlterShareByCancellingShares: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingAllotmentAndPRN) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isAuthorityByApprovalViaOrdinary = data.is_authority_by_ordinary
    this.isAuthorityBeByMinPercentageWithoutApproval = data.is_authority_with_min_percentage
    this.percentageOfSharesToAllotWithoutApproval = data.minimum_shares_limit
    this.isAuthorityByApprovalViaSpecialForNonOrdinary = data.is_authority_by_special
    this.isAuthorityByUnanimousConsentNewInvestors = data.is_authority_by_unanimous
    this.isRightsOfNewDeterminedByTheBoard = data.is_rights_determined_by_board
    this.isRightsOfNewPreApprovedByExistingMembers = data.is_rights_pre_approved
    this.isRightsOfNewNoConflictsWithExisting = data.is_rights_no_conflicts
    this.hasToComplyWithSection85 = data.has_to_comply_with_section85
    this.hasNoSpecialRightsPreferenceShares = data.has_no_rights_preference_shares
    this.isDirectorsAuthorityRenewableAnnually = data.is_renewable_annually
    this.hasExemptionWayForPrn = data.has_exemption_way_for_prn
    this.canExemptPrnByOrdinaryResolution = data.can_exempt_by_ordinary_resolution
    this.canExemptPrnBySpecialResolution = data.can_exempt_by_special_resolution
    this.canExemptPrnByUnanimousConsent = data.can_exempt_by_unanimous_consent
    this.canExemptPrnByShareholder = data.can_exempt_by_shareholder
    this.shareholderIdToApprovePrnExemption = data.authorised_shareholder_id
    this.isNewIssuedTermsByMembersViaResolution = data.is_new_issued_terms_by_mcr
    this.isNewIssuedTermsByDirectorsWithinMandate = data.is_new_issued_terms_by_directors
    this.isNewIssuedTermsProvidedByConstitution = data.is_new_issued_terms_by_constitution
    this.canAlterShareByIncreaseShareCapital = data.can_alter_increase_share_capital
    this.canAlterShareByReduceShareCapital = data.can_alter_reduce_share_capital
    this.canReduceShareCapitalBySolvency = data.can_reduce_by_solvency
    this.canReduceShareCapitalByCourtOrder = data.can_reduce_by_court_order
    this.canAlterShareByConvertingShareCapital = data.can_alter_by_converting_share_capital
    this.canAlterShareByCancellingShares = data.can_alter_by_cancelling_shares
  }

  cloneDetails(data: CompanyConstitutionSettingAllotmentAndPRN): void {
    super.clone(data)
    this.isAuthorityByApprovalViaOrdinary = data.isAuthorityByApprovalViaOrdinary
    this.isAuthorityBeByMinPercentageWithoutApproval = data.isAuthorityBeByMinPercentageWithoutApproval
    this.percentageOfSharesToAllotWithoutApproval = data.percentageOfSharesToAllotWithoutApproval
    this.isAuthorityByApprovalViaSpecialForNonOrdinary = data.isAuthorityByApprovalViaSpecialForNonOrdinary
    this.isAuthorityByUnanimousConsentNewInvestors = data.isAuthorityByUnanimousConsentNewInvestors
    this.isRightsOfNewDeterminedByTheBoard = data.isRightsOfNewDeterminedByTheBoard
    this.isRightsOfNewPreApprovedByExistingMembers = data.isRightsOfNewPreApprovedByExistingMembers
    this.isRightsOfNewNoConflictsWithExisting = data.isRightsOfNewNoConflictsWithExisting
    this.hasToComplyWithSection85 = data.hasToComplyWithSection85
    this.hasNoSpecialRightsPreferenceShares = data.hasNoSpecialRightsPreferenceShares
    this.isDirectorsAuthorityRenewableAnnually = data.isDirectorsAuthorityRenewableAnnually
    this.hasExemptionWayForPrn = data.hasExemptionWayForPrn
    this.canExemptPrnByOrdinaryResolution = data.canExemptPrnByOrdinaryResolution
    this.canExemptPrnBySpecialResolution = data.canExemptPrnBySpecialResolution
    this.canExemptPrnByUnanimousConsent = data.canExemptPrnByUnanimousConsent
    this.canExemptPrnByShareholder = data.canExemptPrnByShareholder
    this.shareholderIdToApprovePrnExemption = data.shareholderIdToApprovePrnExemption
    this.isNewIssuedTermsByMembersViaResolution = data.isNewIssuedTermsByMembersViaResolution
    this.isNewIssuedTermsByDirectorsWithinMandate = data.isNewIssuedTermsByDirectorsWithinMandate
    this.isNewIssuedTermsProvidedByConstitution = data.isNewIssuedTermsProvidedByConstitution
    this.canAlterShareByIncreaseShareCapital = data.canAlterShareByIncreaseShareCapital
    this.canAlterShareByReduceShareCapital = data.canAlterShareByReduceShareCapital
    this.canReduceShareCapitalBySolvency = data.canReduceShareCapitalBySolvency
    this.canReduceShareCapitalByCourtOrder = data.canReduceShareCapitalByCourtOrder
    this.canAlterShareByConvertingShareCapital = data.canAlterShareByConvertingShareCapital
    this.canAlterShareByCancellingShares = data.canAlterShareByCancellingShares
  }

  getRequestBody(): object {
    return {
      is_authority_by_ordinary: this.isAuthorityByApprovalViaOrdinary,
      is_authority_with_min_percentage: this.isAuthorityBeByMinPercentageWithoutApproval,
      minimum_shares_limit: this.percentageOfSharesToAllotWithoutApproval,
      is_authority_by_special: this.isAuthorityByApprovalViaSpecialForNonOrdinary,
      is_authority_by_unanimous: this.isAuthorityByUnanimousConsentNewInvestors,
      is_rights_determined_by_board: this.isRightsOfNewDeterminedByTheBoard,
      is_rights_pre_approved: this.isRightsOfNewPreApprovedByExistingMembers,
      is_rights_no_conflicts: this.isRightsOfNewNoConflictsWithExisting,
      has_to_comply_with_section85: this.hasToComplyWithSection85,
      has_no_rights_preference_shares: this.hasNoSpecialRightsPreferenceShares,
      is_renewable_annually: this.isDirectorsAuthorityRenewableAnnually,
      has_exemption_way_for_prn: this.hasExemptionWayForPrn,
      can_exempt_by_ordinary_resolution: this.canExemptPrnByOrdinaryResolution,
      can_exempt_by_special_resolution: this.canExemptPrnBySpecialResolution,
      can_exempt_by_unanimous_consent: this.canExemptPrnByUnanimousConsent,
      can_exempt_by_shareholder: this.canExemptPrnByShareholder,
      authorised_shareholder_id: this.shareholderIdToApprovePrnExemption,
      is_new_issued_terms_by_mcr: this.isNewIssuedTermsByMembersViaResolution,
      is_new_issued_terms_by_directors: this.isNewIssuedTermsByDirectorsWithinMandate,
      is_new_issued_terms_by_constitution: this.isNewIssuedTermsProvidedByConstitution,
      can_alter_increase_share_capital: this.canAlterShareByIncreaseShareCapital,
      can_alter_reduce_share_capital: this.canAlterShareByReduceShareCapital,
      can_reduce_by_solvency: this.canReduceShareCapitalBySolvency,
      can_reduce_by_court_order: this.canReduceShareCapitalByCourtOrder,
      can_alter_by_converting_share_capital: this.canAlterShareByConvertingShareCapital,
      can_alter_by_cancelling_shares: this.canAlterShareByCancellingShares,
    }
  }

  canSubmit(): boolean {
    if (this.isAuthorityBeByMinPercentageWithoutApproval && this.percentageOfSharesToAllotWithoutApproval === null) {
      return false
    }

    if (this.canExemptPrnByShareholder && this.shareholderIdToApprovePrnExemption === null) {
      return false
    }

    return true
  }
}
