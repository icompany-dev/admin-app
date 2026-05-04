export class CompanyTorAdditionalTerm {
  id: string = ""
  companyTermsOfReferenceId: string = ""
  number: string = ""
  description: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyTorAdditionalTerm) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.tor_id
    this.number = data.number
    this.description = data.description
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: CompanyTorAdditionalTerm): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.companyTermsOfReferenceId
    this.number = data.number
    this.description = data.description
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      tor_id: this.companyTermsOfReferenceId,
      number: this.number,
      description: this.description,
    }
  }
}
