export class DirectorDeclarationConflictOfInterestShareholding {
  id: string = ""
  declarationId: string = ""
  type: string = ""
  dateOfTransaction: string | null = null
  priceOrOtherConsideration: number | null = null
  noSharesAsBoUnderName: number = 0
  noSharesAsBoUnderOthers: number = 0
  nameOfSharesAsBoUnderOthers: string = ""
  noOfSharesAsNominee: number = 0
  nameOfSharesAsNominee: string = ""
  noOfSharesByCorporation: number = 0
  nameOfSharesByCorporation: string = ""
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof DirectorDeclarationConflictOfInterestShareholding) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.declarationId = data.declaration_id
    this.type = data.type
    this.dateOfTransaction = data.date_of_transaction
    this.priceOrOtherConsideration = data.price_or_other_consideration
    this.noSharesAsBoUnderName = data.no_shares_as_bo_under_name
    this.noSharesAsBoUnderOthers = data.no_shares_as_bo_under_others
    this.nameOfSharesAsBoUnderOthers = data.name_of_shares_as_bo_under_others
    this.noOfSharesAsNominee = data.no_of_shares_as_nominee
    this.nameOfSharesAsNominee = data.name_of_shares_as_nominee
    this.noOfSharesByCorporation = data.no_of_shares_by_corporation
    this.nameOfSharesByCorporation = data.name_of_shares_by_corporation
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: DirectorDeclarationConflictOfInterestShareholding): void {
    this.id = data.id
    this.declarationId = data.declarationId
    this.type = data.type
    this.dateOfTransaction = data.dateOfTransaction
    this.priceOrOtherConsideration = data.priceOrOtherConsideration
    this.noSharesAsBoUnderName = data.noSharesAsBoUnderName
    this.noSharesAsBoUnderOthers = data.noSharesAsBoUnderOthers
    this.nameOfSharesAsBoUnderOthers = data.nameOfSharesAsBoUnderOthers
    this.noOfSharesAsNominee = data.noOfSharesAsNominee
    this.nameOfSharesAsNominee = data.nameOfSharesAsNominee
    this.noOfSharesByCorporation = data.noOfSharesByCorporation
    this.nameOfSharesByCorporation = data.nameOfSharesByCorporation
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      id: this.id, //backend requires this in the request body
      declaration_id: this.declarationId,
      type: this.type,
      date_of_transaction: this.dateOfTransaction,
      price_or_other_consideration: this.priceOrOtherConsideration,
      no_shares_as_bo_under_name: this.noSharesAsBoUnderName,
      no_shares_as_bo_under_others: this.noSharesAsBoUnderOthers,
      name_of_shares_as_bo_under_others: this.nameOfSharesAsBoUnderOthers,
      no_of_shares_as_nominee: this.noOfSharesAsNominee,
      name_of_shares_as_nominee: this.nameOfSharesAsNominee,
      no_of_shares_by_corporation: this.noOfSharesByCorporation,
      name_of_shares_by_corporation: this.nameOfSharesByCorporation,
    }
  }
}
