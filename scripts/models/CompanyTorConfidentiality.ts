export class CompanyTorConfidentiality {
  id: string = ""
  companyTermsOfReferenceId: string = ""
  canDisclosureAuthorisedByBoard: boolean = true
  isOnlyDuringTenure: boolean = false
  mustDirectorVentureApprovedByBoard: boolean = false
  mustProfitBeDisclosed: boolean = false
  mustProfitAccountedReturned: boolean = false
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyTorConfidentiality) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.tor_id
    this.canDisclosureAuthorisedByBoard = data.can_disclosure_authorised_by_board
    this.isOnlyDuringTenure = data.is_only_during_tenure
    this.mustDirectorVentureApprovedByBoard = data.must_director_venture_approved_by_board
    this.mustProfitBeDisclosed = data.must_profit_be_disclosed
    this.mustProfitAccountedReturned = data.must_profit_accounted_returned
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: CompanyTorConfidentiality): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.companyTermsOfReferenceId
    this.canDisclosureAuthorisedByBoard = data.canDisclosureAuthorisedByBoard
    this.isOnlyDuringTenure = data.isOnlyDuringTenure
    this.mustDirectorVentureApprovedByBoard = data.mustDirectorVentureApprovedByBoard
    this.mustProfitBeDisclosed = data.mustProfitBeDisclosed
    this.mustProfitAccountedReturned = data.mustProfitAccountedReturned
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      tor_id: this.companyTermsOfReferenceId,
      can_disclosure_authorised_by_board: this.canDisclosureAuthorisedByBoard,
      is_only_during_tenure: this.isOnlyDuringTenure,
      must_director_venture_approved_by_board: this.mustDirectorVentureApprovedByBoard,
      must_profit_be_disclosed: this.mustProfitBeDisclosed,
      must_profit_accounted_returned: this.mustProfitAccountedReturned,
    }
  }
}
