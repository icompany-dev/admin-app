import type { PartialObject } from "lodash"
import type { IWiseAiFace } from "../IWiseAiFace"

export class WiseAiMyKadFace implements IWiseAiFace {
  faceImageBase64: string = ""
  faceConfidence: number = 0

  constructor(data: PartialObject<WiseAiMyKadFace> | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)
  }
}
