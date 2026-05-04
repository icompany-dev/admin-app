import { MultipleRoleConstants } from "../constants/MultipleRoles"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Company } from "./Company"
import type { IModel } from "./IModel"

export class AccessRole implements IModel<AccessRole> {
  id: string = ""
  name: string = ""
  description: string = ""
  companyId: string = ""
  company: Company = new Company()
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AccessRole) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.companyId = data.company_id
    this.company = data.company
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: AccessRole): void {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.companyId = data.companyId
    this.company = data.company
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      name: this.name,
      description: this.description,
      company_id: this.companyId,
    }
  }

  isNameValid(): boolean {
    if (StringUtil.isNullOrEmpty(this.name)) {
      return true
    }

    return !StringUtil.inArray(this.name, MultipleRoleConstants.LOCKED_ROLES)
  }

  canSubmit() {
    if (StringUtil.inArray(this.name, MultipleRoleConstants.LOCKED_ROLES)) {
      return false
    }

    return (
      !StringUtil.isNullOrEmpty(this.name) &&
      this.isNameValid() &&
      !StringUtil.isNullOrEmpty(this.description) &&
      !StringUtil.isNullOrEmpty(this.companyId)
    )
  }

  async create(repository: ReturnType<typeof useAccessRoleStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useAccessRoleStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
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

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useAccessRoleStore>): Promise<void> {
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

    return response
  }
}
