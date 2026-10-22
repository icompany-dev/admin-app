import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
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
    return {
      name: this.name,
      descriptions: this.descriptions,
      location: this.location.getRequestBody(),
      company_id: this.companyId,
      status: this.status,
    }
  }

  canProceed(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.name) &&
      !StringUtil.isNullOrEmpty(this.descriptions) &&
      this.location.canCreate()
    )
  }

  async create(repository: ReturnType<typeof useCompanyBranchStore>): Promise<void> {
    if (!this.canProceed()) {
      console.log("companyId", this.companyId)
      console.log("name", this.name)
      console.log("descriptions", this.descriptions)
      console.log("location", this.location)
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof useCompanyBranchStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canProceed()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useCompanyBranchStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }
}
