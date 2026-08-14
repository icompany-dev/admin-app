export class DirectorDeclarationConflictOfInterestDisclosure {
  id: string = ""
  declarationId: string = ""
  nameOfCorporation: string = ""
  officeHeld: string = ""
  noOfSharesHeld: number = 0
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof DirectorDeclarationConflictOfInterestDisclosure) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.declarationId = data.declaration_id
    this.nameOfCorporation = data.name_of_corporation
    this.officeHeld = data.office_held
    this.noOfSharesHeld = data.no_of_shares_held
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: DirectorDeclarationConflictOfInterestDisclosure): void {
    this.id = data.id
    this.declarationId = data.declarationId
    this.nameOfCorporation = data.nameOfCorporation
    this.officeHeld = data.officeHeld
    this.noOfSharesHeld = data.noOfSharesHeld
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      id: this.id, //backend requires this in the request body
      declaration_id: this.declarationId,
      name_of_corporation: this.nameOfCorporation,
      office_held: this.officeHeld,
      no_of_shares_held: this.noOfSharesHeld,
    }
  }
}
