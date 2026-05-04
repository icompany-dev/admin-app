import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"
import { Company } from "./Company"
import { AccessRole } from "./AccessRole"

export class UserInvitation {
  id: string = ""
  companyId: string = ""
  company: Company = new Company()
  name: string = ""
  email: string = ""
  phone: string = ""
  userId: string = ""
  accessRoleId: string = ""
  accessRole: AccessRole = new AccessRole()
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof UserInvitation) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? data.user_invitation_id
    this.companyId = data.company_id
    this.company = new Company(data.company)
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.userId = data.user_id ?? null
    this.accessRoleId = data.access_role_id
    this.accessRole = new AccessRole(data.access_role)
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: UserInvitation): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.userId = data.userId
    this.accessRoleId = data.accessRoleId
    this.accessRole = new AccessRole(data.accessRole)
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody() {
    return {
      company_id: this.companyId,
      name: this.name,
      email: this.email,
      phone: this.phone,
      access_role_id: this.accessRoleId,
    }
  }

  companyName() {
    return this.company ? this.company.name.toUpperCase() : ""
  }

  roleName() {
    return this.accessRole ? this.accessRole.name : ""
  }

  canSubmit() {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.name) &&
      !StringUtil.isNullOrEmpty(this.email) &&
      !StringUtil.isNullOrEmpty(this.accessRoleId)
    )
  }

  async create(repository: ReturnType<typeof useUserInvitationStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useUserInvitationStore>): Promise<void> {
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

  async accept(repository: ReturnType<typeof useUserInvitationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    await repository.accept(this.id)
  }

  async reject(repository: ReturnType<typeof useUserInvitationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const data = {
      invitation_id: this.id,
    }

    await repository.reject(this.id)
  }
}
