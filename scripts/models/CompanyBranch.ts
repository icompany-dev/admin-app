import type { IModel } from "./IModel"
import { Location } from "./Location"

export class CompanyBranch implements IModel<CompanyBranch> {
  id: string = ""
  name: string = ""
  descriptions: string | null = null
  location: Location = new Location()
  companyId: string = ""
  status: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyBranch) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.name = data.name ?? ""
    this.descriptions = data.descriptions ?? ""
    this.location = new Location(data.location)
    this.companyId = data.company_id ?? ""
    this.status = data.status ?? "draft"
    this.updatedAt = data.updated_at
    this.createdAt = data.created_at
  }

  clone(data: CompanyBranch): void {
    this.id = data.id
    this.name = data.name
    this.descriptions = data.descriptions
    this.location = new Location(data.location)
    this.companyId = data.companyId
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {}
  }
}
