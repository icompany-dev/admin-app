// This is to map the data received from a very specific endpoint: accesses/users/roles/companyId
import _ from "lodash"
import { File } from "~/scripts/models/File"

export class UserAccessRoleForCompany {
  id: string = ""
  accessRoleId: string = ""
  accessRoleName: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof UserAccessRoleForCompany) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.accessRoleId = data.access_role_id
    this.accessRoleName = data.access_role_name
  }

  clone(data: UserAccessRoleForCompany): void {
    this.id = data.id
    this.accessRoleId = data.accessRoleId
    this.accessRoleName = data.accessRoleName
  }
}

export class UserRolesForCompany {
  name: string = ""
  corporateRepName: string = ""
  email: string = ""
  image: File | null = null
  roles: UserAccessRoleForCompany[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof UserRolesForCompany) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.name = data.name
    this.corporateRepName = data.rep_name
    this.email = data.email
    this.image = data.image !== null ? new File(data.image) : null
    this.roles = data.roles?.map((d: any) => {
      return new UserAccessRoleForCompany(d)
    })
  }

  clone(data: UserRolesForCompany): void {
    this.name = data.name
    this.corporateRepName = data.corporateRepName
    this.email = data.email
    this.image = data.image !== null ? new File(data.image) : null
    this.roles = data.roles.map((d: UserAccessRoleForCompany) => {
      const roleData = new UserAccessRoleForCompany()
      roleData.clone(d)
      return roleData
    })
  }

  profilePictureUrl() {
    if (!this.image) {
      return null
    }

    return this.image.url
  }
}
