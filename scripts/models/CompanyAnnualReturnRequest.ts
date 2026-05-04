import { Company } from "~/scripts/models/Company"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"
import { StatusConstants } from "../constants/Status"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"

export class CompanyAnnualReturnRequest
  extends Application
  implements IModelApplication<CompanyAnnualReturnRequest, ReturnType<typeof useCompanyAnnualReturnRequestStore>>
{
  year: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyAnnualReturnRequest) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.id = data.id
    this.company = new Company(data.company)
    this.year = data.year
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  cloneDetails(data: CompanyAnnualReturnRequest): void {
    super.clone(data)
    this.id = data.id
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.year = data.year
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      year: this.year,
      date: `${this.year}-01-01`,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.year)
  }

  async create(repository: ReturnType<typeof useCompanyAnnualReturnRequestStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyAnnualReturnRequestStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyAnnualReturnRequestStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }
  }
}
