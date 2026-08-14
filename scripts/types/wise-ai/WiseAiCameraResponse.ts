import type { PartialObject } from "lodash"
import { WiseAiCameraResponseData } from "./WiseAiCameraResponseData"
import { WiseAiCameraResponseMeta } from "./WiseAiCameraResponseMeta"

export class WiseAiCameraResponse {
  status: string = ""
  code: string = ""
  message: string = ""
  data: WiseAiCameraResponseData = new WiseAiCameraResponseData()
  meta: WiseAiCameraResponseMeta = new WiseAiCameraResponseMeta()

  constructor(data: PartialObject<WiseAiCameraResponse> | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)
  }
}
