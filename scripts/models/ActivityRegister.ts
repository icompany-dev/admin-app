import { Error } from "../library/Error"
import { Company } from "./Company"
import type { IModel } from "./IModel"
import { User } from "./User"

export class ActivityRegister implements IModel<ActivityRegister> {
  id: string = ""
  email: string = ""
  userId: string = ""
  user: User = new User()
  companyId: string | null = null
  company: Company | null = null
  role: string = ""
  action: string = ""
  additionalInfo: string = ""
  targetType: string = ""
  targetId: string = ""
  ipAddress: string = ""
  status: string = ""
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ActivityRegister) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.email = data.email
    this.userId = data.user_id
    this.user = new User(data.user)
    this.companyId = data.company_id
    this.company = data.company ? new Company(data.company) : null
    this.role = data.role
    this.action = data.action
    this.additionalInfo = data.additional_info
    this.targetType = data.target_type
    this.targetId = data.target_id
    this.ipAddress = data.ip_address
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: ActivityRegister): void {
    this.id = data.id
    this.email = data.email
    this.userId = data.userId
    this.user = new User(data.user)
    this.companyId = data.companyId
    this.company = data.company ? new Company(data.company) : null
    this.role = data.role
    this.action = data.action
    this.additionalInfo = data.additionalInfo
    this.targetType = data.targetType
    this.targetId = data.targetId
    this.ipAddress = data.ipAddress
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      email: this.email,
      user_id: this.userId,
      company_id: this.companyId,
      role: this.role,
      action: this.action,
      additional_info: this.additionalInfo,
      target_type: this.targetType,
      target_id: this.targetId,
      ip_address: this.ipAddress,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return true
  }

  async create(repository: ReturnType<typeof useActivityRegisterStore>): Promise<void> {
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

    this.convertFromResponse(response)
  }
}
