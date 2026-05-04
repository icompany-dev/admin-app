import type { PartialObject } from "lodash"

export class AccessType {
  accessRuleId: string = ""
  accessType: string = ""

  constructor(data: PartialObject<AccessType>) {
    Object.assign(this, data)
  }
}
