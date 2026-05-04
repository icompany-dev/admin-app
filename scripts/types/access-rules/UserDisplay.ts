import type { PartialObject } from "lodash"

export class UserDisplay {
  id: string = ""
  name: string = ""
  profileImage: string | null = null
  isCorporateRep: boolean = false
  corporateRepName: string = ""
  gender: string = ""
  roles: string = ""
  appointedAt: string | null = null

  constructor(data: PartialObject<UserDisplay>) {
    Object.assign(this, data)
  }
}
