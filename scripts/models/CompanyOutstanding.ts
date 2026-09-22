import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyOutstanding {
  id: string = ""
  companyId: string = ""
  description: string = ""
  targetType: string = ""
  targetId: string = ""
  amount: number = 0
  status: string = "active"
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
    this.targetType = data.target_type ?? ""
    this.targetId = data.target_id ?? ""
    this.amount = data.amount
    this.status = data.status
    this.updatedAt = data.updated_at
    this.createdAt = data.created_at
  }

  clone(data: CompanyOutstanding): void {
    this.id = data.id
    this.companyId = data.companyId
    this.description = data.description
    this.targetType = data.targetType
    this.targetId = data.targetId
    this.amount = data.amount
    this.status = data.status
    this.updatedAt = data.updatedAt
    this.createdAt = data.createdAt
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      description: this.description,
      target: this.targetType,
      target_id: this.targetId,
      amount: this.amount,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.targetType) &&
      !StringUtil.isNullOrEmpty(this.targetId) &&
      this.amount > 0
    )
  }

  async create(repository: ReturnType<typeof useCompanyOutstandingStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
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

  async update(repository: ReturnType<typeof useCompanyOutstandingStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
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

  async remove(repository: ReturnType<typeof useCompanyOutstandingStore>): Promise<void> {
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
