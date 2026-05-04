import type { PartialObject } from "lodash"

export class AskSairaNameDescriptionDraft {
  name: string = ""
  description: string = ""

  constructor(data: PartialObject<AskSairaNameDescriptionDraft>) {
    Object.assign(this, data)
  }
}
