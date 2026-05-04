export class CompanyOutstanding {
  id: string = ""
  companyId: string = ""
  description: string = ""
  amount: number = 0
  status: string = ""
  updatedAt: string = ""
  createdAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyOutstanding) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.company_id
    this.description = data.description
    this.amount = data.amount
    this.status = data.status
    this.updatedAt = data.updated_at
    this.createdAt = data.created_at
  }

  clone(data: CompanyOutstanding): void {
    this.id = data.id
    this.companyId = data.companyId
    this.description = data.description
    this.amount = data.amount
    this.status = data.status
    this.updatedAt = data.updatedAt
    this.createdAt = data.createdAt
  }
}
