import type { AccessRole } from "../models/AccessRole"

export interface IPropsAssignRole {
  companyId: string
  accessRoles: AccessRole[]
}

export class PropsAssignRole implements IPropsAssignRole {
  companyId: string
  accessRoles: AccessRole[]

  constructor(companyId: string, accessRoles: AccessRole[]) {
    this.companyId = companyId
    this.accessRoles = accessRoles
  }
}
