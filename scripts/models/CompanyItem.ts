import { Company } from "./Company"

export abstract class CompanyItem {
  id: string = ""
  companyId: string = ""
  company: Company | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor() {}

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = data.company ? new Company(data.company) : null
    if (!data.companyId && data.company) {
      this.companyId = data.company.id
    }
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: CompanyItem): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = data.company ? new Company(data.company) : null
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}
