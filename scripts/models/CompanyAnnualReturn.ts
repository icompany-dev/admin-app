import { Company } from "~/scripts/models/Company"
import { StringUtil } from "../utils/String"
import type { IModel } from "./IModel"
import { Error } from "../library/Error"

export class CompanyAnnualReturn implements IModel<CompanyAnnualReturn> {
  id: string = ""
  companyId: string = ""
  company: Company = new Company()
  year: string = ""
  status: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyAnnualReturn) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.year = data.year
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: CompanyAnnualReturn): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.year = data.year
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  // NOTE(Bahiyah): Only Admin can create/update/remove annual return records. not user
  getRequestBody(): object {
    return {}
  }
}
