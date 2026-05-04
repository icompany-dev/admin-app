export class CompanyTorConductConflict {
  id: string = ""
  companyTermsOfReferenceId: string = ""
  mustDeclareInterest: boolean = false
  mustAbstainFromVoting: boolean = false
  mustEnsureDisclosureMinuted: boolean = false
  isEnsureAllTransactionsDisclosed: boolean = false
  isEnsureApprovalsObtained: boolean = false
  isEnsureTransactionsTerms: boolean = false
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyTorConductConflict) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.tor_id
    this.mustDeclareInterest = data.must_declare_interest
    this.mustAbstainFromVoting = data.must_abstain_from_voting
    this.mustEnsureDisclosureMinuted = data.must_ensure_disclosure_minuted
    this.isEnsureAllTransactionsDisclosed = data.is_ensure_all_transactions_disclosed
    this.isEnsureApprovalsObtained = data.is_ensure_approvals_obtained
    this.isEnsureTransactionsTerms = data.is_ensure_transactions_terms
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: CompanyTorConductConflict): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.companyTermsOfReferenceId
    this.mustDeclareInterest = data.mustDeclareInterest
    this.mustAbstainFromVoting = data.mustAbstainFromVoting
    this.mustEnsureDisclosureMinuted = data.mustEnsureDisclosureMinuted
    this.isEnsureAllTransactionsDisclosed = data.isEnsureAllTransactionsDisclosed
    this.isEnsureApprovalsObtained = data.isEnsureApprovalsObtained
    this.isEnsureTransactionsTerms = data.isEnsureTransactionsTerms
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      tor_id: this.companyTermsOfReferenceId,
      must_declare_interest: this.mustDeclareInterest,
      must_abstain_from_voting: this.mustAbstainFromVoting,
      must_ensure_disclosure_minuted: this.mustEnsureDisclosureMinuted,
      is_ensure_all_transactions_disclosed: this.isEnsureAllTransactionsDisclosed,
      is_ensure_approvals_obtained: this.isEnsureApprovalsObtained,
      is_ensure_transactions_terms: this.isEnsureTransactionsTerms,
    }
  }
}
