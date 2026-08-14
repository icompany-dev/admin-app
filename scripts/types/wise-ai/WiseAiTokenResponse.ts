import { WiseAiTokenResponseData } from "./WiseAiTokenResponseData"
import type { PartialObject } from "lodash"

export class WiseAiTokenResponse {
  status: string = ""
  code: string = ""
  data: WiseAiTokenResponseData = new WiseAiTokenResponseData()

  constructor(data: PartialObject<WiseAiTokenResponse> | null = null) {
    if (!data) {
      return
    }

    this.status = data.status ?? ""
    this.code = data.code ?? ""
    this.data = new WiseAiTokenResponseData(data.data)
  }
}
