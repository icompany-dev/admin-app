import type { PartialObject } from "lodash"
import type { IWiseAiFace } from "../IWiseAiFace"

export class WiseAiPassportFace implements IWiseAiFace {
  faceImageBase64: string = ""
  faceConfidence: number = 0

  constructor(data: PartialObject<WiseAiPassportFace> | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)
  }
}
