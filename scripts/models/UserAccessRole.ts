import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { AccessRole } from "./AccessRole"
import { Company } from "./Company"
import type { IModel } from "./IModel"
import { User } from "./User"

export class UserAccessRole implements IModel<UserAccessRole> {
  id: string = ""
  userId: string = ""
  user: User = new User()
  accessRoleId: string = ""
  accessRole: AccessRole = new AccessRole()
  companyId: string = ""
  company: Company = new Company()
  createdAt: string | null = ""
  updatedAt: string | null = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof UserAccessRole) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.userId = data.user_id ?? data.user?.id
    this.user = new User(data.user)
    this.accessRoleId = data.access_role_id ?? ""
    this.accessRole = new AccessRole(data.access_role)
    this.companyId = data.company_id
    this.company = new Company(data.company)
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: UserAccessRole): void {
    this.id = data.id
    this.userId = data.userId
    this.user = new User(data.user)
    this.accessRoleId = data.accessRoleId
    this.accessRole = new AccessRole(data.accessRole)
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      user_id: this.userId,
      access_role_id: this.accessRoleId,
      company_id: this.companyId,
    }
  }

  getUserName(): string {
    return this.user.showName()
  }

  getUserEmail(): string {
    return this.user.email
  }

  getRoleName(): string {
    return this.accessRole.name
  }

  getProfilePicture(): string | null {
    if (this.user.detail?.image?.url) {
      return this.user.detail.image.url
    }

    return null
  }

  getGender(): string {
    if (this.user.detail?.gender) {
      return this.user.detail.gender
    }

    return "male"
  }

  canSubmit() {
    return (
      !StringUtil.isNullOrEmpty(this.userId) &&
      !StringUtil.isNullOrEmpty(this.accessRoleId) &&
      !StringUtil.isNullOrEmpty(this.companyId)
    )
  }

  async create(repository: ReturnType<typeof useUserAccessRoleStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useUserAccessRoleStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useUserAccessRoleStore>): Promise<void> {
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
