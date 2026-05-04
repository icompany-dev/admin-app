import type { PartialObject } from "lodash"
import { UserAccessRole } from "~/scripts/models/UserAccessRole"

export class SelectedUserDetailRole {
  id: string = ""
  name: string = ""
  isRemovable: boolean = false
  userAccessRole: UserAccessRole = new UserAccessRole()

  constructor(data: PartialObject<SelectedUserDetailRole>) {
    Object.assign(this, data)
  }
}

export class SelectedUserDetail {
  userId: string = ""
  name: string = ""
  email: string = ""
  profileImage: string | null = null
  roles: SelectedUserDetailRole[] = []

  constructor(data: PartialObject<SelectedUserDetail>) {
    Object.assign(this, data)
  }
}
