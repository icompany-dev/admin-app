import { StringUtil } from "../utils/String"
import { AccessRole } from "./AccessRole"
import type { IModel } from "./IModel"

export class CompanyDelegateAuthorityTo implements IModel<CompanyDelegateAuthorityTo> {
  id: string = ""
  delegationId: string = ""
  name: string = ""
  email: string = ""
  phone: string = ""
  accessRoleId: string = ""
  accessRole: AccessRole = new AccessRole()
  designation: string = ""
  scopeOfAuthority: string[] = []
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyDelegateAuthorityTo) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.delegationId = data.delegation_id ?? ""
    this.name = data.name ?? ""
    this.email = data.email ?? ""
    this.phone = data.phone ?? ""
    this.accessRoleId = data.access_role_id ?? ""
    this.accessRole = data.access_role ? new AccessRole(data.access_role) : new AccessRole()
    this.designation = data.designation ?? ""
    this.scopeOfAuthority = data.scope_of_authority ?? []
    this.createdAt = data.created_at ?? null
    this.updatedAt = data.updated_at ?? null
  }

  clone(data: CompanyDelegateAuthorityTo): void {
    this.id = data.id
    this.delegationId = data.delegationId
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.accessRoleId = data.accessRoleId
    this.accessRole = data.accessRole ? new AccessRole(data.accessRole) : new AccessRole()
    this.designation = data.designation
    this.scopeOfAuthority = [...data.scopeOfAuthority]
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    const body: any = {
      name: this.name,
      designation: this.designation,
      scope_of_authority: this.scopeOfAuthority,
    }

    if (!StringUtil.isNullOrEmpty(this.email)) {
      body.email = this.email
    }

    if (!StringUtil.isNullOrEmpty(this.phone)) {
      body.phone = this.phone
    }

    if (!StringUtil.isNullOrEmpty(this.accessRoleId)) {
      body.access_role_id = this.accessRoleId
    }

    return body
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.name) &&
      !StringUtil.isNullOrEmpty(this.designation) &&
      this.scopeOfAuthority.length > 0
    )
  }
}
