import type { PartialObject } from "lodash"

export class WiseAiTokenResponseDataEncryption {
  alg: string = ""
  mode: string = ""
  padding: string = ""
  iv: string = ""
  key: string = ""

  constructor(data: PartialObject<WiseAiTokenResponseDataEncryption> | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)
  }
}
