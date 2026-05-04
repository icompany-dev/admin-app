import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingDirectorPowersAndDuty extends CompanyConstitutionSettingItem {
  includeCollectivePowers: boolean = false
  isSubjectToShareholdersReservedMatters: boolean = false
  isSubjectToBoardReservedMatters: boolean = false
  isIncorporatingStatutoryDuties: boolean = false
  includePowerToBorrow: boolean = false
  includePowerToMortgage: boolean = false
  includePowerToIssueDebentures: boolean = false
  includePowerToGiveGuarantees: boolean = false
  excludeBorrowingLimits: boolean = false
  borrowingLimits: number | null = null // cannot be null if above is true
  excludeCreationOfCharges: boolean = false
  excludeCorporateGuarantees: boolean = false
  shouldAbstainFromVoting: boolean = false
  canBePresentNotVote: boolean = true
  canVoteIfAllowed: boolean = false
  mustLeaveMeeting: boolean = false
  isApprovalRequireForMinTransation: boolean = false
  minTransactionLimit: number | null = null // cannot be null if above is true
  isAnnualWrittenDeclarationRequired: boolean = false

  constructor(data: any | null = null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingDirectorPowersAndDuty) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.includeCollectivePowers = data.include_collective_powers
    this.isSubjectToShareholdersReservedMatters = data.is_subject_to_shareholders_reserved_matters
    this.isSubjectToBoardReservedMatters = data.is_subject_to_board_reserved_matters
    this.isIncorporatingStatutoryDuties = data.is_incorporating_statutory_duties
    this.includePowerToBorrow = data.include_power_to_borrow
    this.includePowerToMortgage = data.include_power_to_mortgage
    this.includePowerToIssueDebentures = data.include_power_to_issue_debentures
    this.includePowerToGiveGuarantees = data.include_power_to_give_guarantees
    this.excludeBorrowingLimits = data.exclude_borrowing_limits
    this.borrowingLimits = data.borrowing_limits
    this.excludeCreationOfCharges = data.exclude_creation_of_charges
    this.excludeCorporateGuarantees = data.exclude_corporate_guarantees
    this.shouldAbstainFromVoting = data.should_abstain_from_voting
    this.canBePresentNotVote = data.can_be_present_not_vote
    this.canVoteIfAllowed = data.can_vote_if_allowed
    this.mustLeaveMeeting = data.must_leave_meeting
    this.isApprovalRequireForMinTransation = data.is_approval_require_for_min_transation
    this.minTransactionLimit = data.min_transaction_limit
    this.isAnnualWrittenDeclarationRequired = data.is_annual_written_declaration_required
  }

  cloneDetails(data: CompanyConstitutionSettingDirectorPowersAndDuty): void {
    super.clone(data)
    this.includeCollectivePowers = data.includeCollectivePowers
    this.isSubjectToShareholdersReservedMatters = data.isSubjectToShareholdersReservedMatters
    this.isSubjectToBoardReservedMatters = data.isSubjectToBoardReservedMatters
    this.isIncorporatingStatutoryDuties = data.isIncorporatingStatutoryDuties
    this.includePowerToBorrow = data.includePowerToBorrow
    this.includePowerToMortgage = data.includePowerToMortgage
    this.includePowerToIssueDebentures = data.includePowerToIssueDebentures
    this.includePowerToGiveGuarantees = data.includePowerToGiveGuarantees
    this.excludeBorrowingLimits = data.excludeBorrowingLimits
    this.borrowingLimits = data.borrowingLimits
    this.excludeCreationOfCharges = data.excludeCreationOfCharges
    this.excludeCorporateGuarantees = data.excludeCorporateGuarantees
    this.shouldAbstainFromVoting = data.shouldAbstainFromVoting
    this.canBePresentNotVote = data.canBePresentNotVote
    this.canVoteIfAllowed = data.canVoteIfAllowed
    this.mustLeaveMeeting = data.mustLeaveMeeting
    this.isApprovalRequireForMinTransation = data.isApprovalRequireForMinTransation
    this.minTransactionLimit = data.minTransactionLimit
    this.isAnnualWrittenDeclarationRequired = data.isAnnualWrittenDeclarationRequired
  }

  getRequestBody(): object {
    return {
      include_collective_powers: this.includeCollectivePowers,
      is_subject_to_shareholders_reserved_matters: this.isSubjectToShareholdersReservedMatters,
      is_subject_to_board_reserved_matters: this.isSubjectToBoardReservedMatters,
      is_incorporating_statutory_duties: this.isIncorporatingStatutoryDuties,
      include_power_to_borrow: this.includePowerToBorrow,
      include_power_to_mortgage: this.includePowerToMortgage,
      include_power_to_issue_debentures: this.includePowerToIssueDebentures,
      include_power_to_give_guarantees: this.includePowerToGiveGuarantees,
      exclude_borrowing_limits: this.excludeBorrowingLimits,
      borrowing_limits: this.borrowingLimits,
      exclude_creation_of_charges: this.excludeCreationOfCharges,
      exclude_corporate_guarantees: this.excludeCorporateGuarantees,
      should_abstain_from_voting: this.shouldAbstainFromVoting,
      can_be_present_not_vote: this.canBePresentNotVote,
      can_vote_if_allowed: this.canVoteIfAllowed,
      must_leave_meeting: this.mustLeaveMeeting,
      is_approval_require_for_min_transation: this.isApprovalRequireForMinTransation,
      min_transaction_limit: this.minTransactionLimit,
      is_annual_written_declaration_required: this.isAnnualWrittenDeclarationRequired,
    }
  }

  canSubmit(): boolean {
    if (this.excludeBorrowingLimits && this.borrowingLimits === null) {
      return false
    }

    if (this.isApprovalRequireForMinTransation && this.minTransactionLimit === null) {
      return false
    }

    return true
  }
}
