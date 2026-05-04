import type { PartialObject } from "lodash"
import { WiseAiTokenResponseDataEncryption } from "./WiseAiTokenResponseDataEncryption"

export class WiseAiTokenResponseData {
  encryption: WiseAiTokenResponseDataEncryption = new WiseAiTokenResponseDataEncryption()
  expired: number = 0
  created: number = 0
  ttl: number = 0
  token: string = ""

  constructor(data: PartialObject<WiseAiTokenResponseData> | null = null) {
    if (!data) {
      return
    }

    this.encryption = new WiseAiTokenResponseDataEncryption(data.encryption)
    this.expired = data.expired ?? 0
    this.created = data.created ?? 0
    this.ttl = data.ttl ?? 0
    this.token = data.token ?? ""
  }
}
