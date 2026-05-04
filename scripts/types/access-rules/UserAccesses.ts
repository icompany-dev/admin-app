import type { PartialObject } from "lodash"

export class UserAccesses {
  userId: string = ""
  companyId: string = ""
  accessRulesIds: string[] = []

  constructor(data: PartialObject<UserAccesses>) {
    Object.assign(this, data)
  }
}
