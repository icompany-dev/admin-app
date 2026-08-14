import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingRegisterTransfer extends CompanyConstitutionSettingItem {
  canDeclineToRegisterByOneDirector: boolean = false
  canDeclineToRegisterBySpecificDirector: boolean = false
  directorIdApprovingTransfer: string | null = null //cannot be null if above is true
  canDeclineToRegisterSimpleMajority: boolean = false
  canDeclineToRegisterNotMajorityPercentage: boolean = false
  minimumPercentageToRegisterTransfer: number | null = null //cannot be null if above is true
  canDeclineToRegisterUnanimousApproval: boolean = false
  canDeclineToRegisterIfSharesNotFullyPaid: boolean = false
  canDeclineToRegisterIfCompanyHasLien: boolean = false
  canDeclineToRegisterIfDirectorsDoNotApprove: boolean = false
  canDeclineToRegisterIfTransferBreaches: boolean = false
  canDeclineToRegisterIfTransferToCompetitor: boolean = false
  hasToReturnDocumentIfTransferRefused: boolean = false
  hasToIssueWrittenNoticeIfTransferRefused: boolean = false
  hasToAllowAppealIfTransferRefused: boolean = false
  hasToProvideOpportunityIfTransferRefused: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingRegisterTransfer) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.canDeclineToRegisterByOneDirector = data.can_decline_by_one_director
    this.canDeclineToRegisterBySpecificDirector = data.can_decline_by_specific_director
    this.directorIdApprovingTransfer = data.authorised_director_id
    this.canDeclineToRegisterSimpleMajority = data.can_decline_by_simple_majority
    this.canDeclineToRegisterNotMajorityPercentage = data.can_decline_by_not_majority_percentage
    this.minimumPercentageToRegisterTransfer = data.minimum_percentage_limit
    this.canDeclineToRegisterUnanimousApproval = data.can_decline_by_unanimous_approval
    this.canDeclineToRegisterIfSharesNotFullyPaid = data.can_decline_if_shares_not_fully_paid
    this.canDeclineToRegisterIfCompanyHasLien = data.can_decline_if_company_has_lien
    this.canDeclineToRegisterIfDirectorsDoNotApprove = data.can_decline_if_directors_do_not_approve
    this.canDeclineToRegisterIfTransferBreaches = data.can_decline_if_transfer_breaches
    this.canDeclineToRegisterIfTransferToCompetitor = data.can_decline_if_transfer_to_competitor
    this.hasToReturnDocumentIfTransferRefused = data.has_to_return_document
    this.hasToIssueWrittenNoticeIfTransferRefused = data.has_to_issue_written_notice
    this.hasToAllowAppealIfTransferRefused = data.has_to_allow_appeal
    this.hasToProvideOpportunityIfTransferRefused = data.has_to_provide_opportunity
  }

  cloneDetails(data: CompanyConstitutionSettingRegisterTransfer): void {
    super.clone(data)
    this.canDeclineToRegisterByOneDirector = data.canDeclineToRegisterByOneDirector
    this.canDeclineToRegisterBySpecificDirector = data.canDeclineToRegisterBySpecificDirector
    this.directorIdApprovingTransfer = data.directorIdApprovingTransfer
    this.canDeclineToRegisterSimpleMajority = data.canDeclineToRegisterSimpleMajority
    this.canDeclineToRegisterNotMajorityPercentage = data.canDeclineToRegisterNotMajorityPercentage
    this.minimumPercentageToRegisterTransfer = data.minimumPercentageToRegisterTransfer
    this.canDeclineToRegisterUnanimousApproval = data.canDeclineToRegisterUnanimousApproval
    this.canDeclineToRegisterIfSharesNotFullyPaid = data.canDeclineToRegisterIfSharesNotFullyPaid
    this.canDeclineToRegisterIfCompanyHasLien = data.canDeclineToRegisterIfCompanyHasLien
    this.canDeclineToRegisterIfDirectorsDoNotApprove = data.canDeclineToRegisterIfDirectorsDoNotApprove
    this.canDeclineToRegisterIfTransferBreaches = data.canDeclineToRegisterIfTransferBreaches
    this.canDeclineToRegisterIfTransferToCompetitor = data.canDeclineToRegisterIfTransferToCompetitor
    this.hasToReturnDocumentIfTransferRefused = data.hasToReturnDocumentIfTransferRefused
    this.hasToIssueWrittenNoticeIfTransferRefused = data.hasToIssueWrittenNoticeIfTransferRefused
    this.hasToAllowAppealIfTransferRefused = data.hasToAllowAppealIfTransferRefused
    this.hasToProvideOpportunityIfTransferRefused = data.hasToProvideOpportunityIfTransferRefused
  }

  getRequestBody(): object {
    return {
      can_decline_by_one_director: this.canDeclineToRegisterByOneDirector,
      can_decline_by_specific_director: this.canDeclineToRegisterBySpecificDirector,
      authorised_director_id: this.directorIdApprovingTransfer,
      can_decline_by_simple_majority: this.canDeclineToRegisterSimpleMajority,
      can_decline_by_not_majority_percentage: this.canDeclineToRegisterNotMajorityPercentage,
      minimum_percentage_limit: this.minimumPercentageToRegisterTransfer,
      can_decline_by_unanimous_approval: this.canDeclineToRegisterUnanimousApproval,
      can_decline_if_shares_not_fully_paid: this.canDeclineToRegisterIfSharesNotFullyPaid,
      can_decline_if_company_has_lien: this.canDeclineToRegisterIfCompanyHasLien,
      can_decline_if_directors_do_not_approve: this.canDeclineToRegisterIfDirectorsDoNotApprove,
      can_decline_if_transfer_breaches: this.canDeclineToRegisterIfTransferBreaches,
      can_decline_if_transfer_to_competitor: this.canDeclineToRegisterIfTransferToCompetitor,
      has_to_return_document: this.hasToReturnDocumentIfTransferRefused,
      has_to_issue_written_notice: this.hasToIssueWrittenNoticeIfTransferRefused,
      has_to_allow_appeal: this.hasToAllowAppealIfTransferRefused,
      has_to_provide_opportunity: this.hasToProvideOpportunityIfTransferRefused,
    }
  }

  canSubmit(): boolean {
    if (
      (this.canDeclineToRegisterBySpecificDirector && this.directorIdApprovingTransfer === null) ||
      (this.canDeclineToRegisterNotMajorityPercentage && this.minimumPercentageToRegisterTransfer === null)
    ) {
      return false
    }

    return true
  }
}
