export class DirectorDeclarationConflictOfInterestProperty {
  id: string = ""
  declarationId: string = ""
  number: number = 1
  particulars: string = ""
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof DirectorDeclarationConflictOfInterestProperty) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.declarationId = data.declaration_id
    this.number = data.number
    this.particulars = data.particulars
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: DirectorDeclarationConflictOfInterestProperty): void {
    this.id = data.id
    this.declarationId = data.declarationId
    this.number = data.number
    this.particulars = data.particulars
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      id: this.id, //backend requires this in the request body
      declaration_id: this.declarationId,
      number: this.number,
      particulars: this.particulars,
    }
  }
}
