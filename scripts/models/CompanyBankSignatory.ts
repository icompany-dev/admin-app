export class CompanyBankSignatory {
  id: string = ""
  name: string | null = null
  type: string | null = null
  identification: string | null = null
  role: string | null = null
  updatedAt: string | null = null
  createdAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyBankSignatory) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.type = data.type
    this.identification = data.identification
    this.role = data.role
    this.updatedAt = data.updated_at
    this.createdAt = data.created_at
  }

  clone(data: CompanyBankSignatory): void {
    this.id = data.id
    this.name = data.name
    this.type = data.type
    this.identification = data.identification
    this.role = data.role
    this.updatedAt = data.updatedAt
    this.createdAt = data.createdAt
  }

  getRequestBody(): object {
    return {
      name: this.name,
      type: this.type,
      identification: this.identification,
      role: this.role,
    }
  }
}
