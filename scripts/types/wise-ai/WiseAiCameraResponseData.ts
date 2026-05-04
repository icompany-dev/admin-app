import type { PartialObject } from "lodash"

export class WiseAiCameraResponseData {
  isEncrypted: boolean = true
  encryptedData: string = ""

  constructor(data: PartialObject<WiseAiCameraResponseData> | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)
  }
}
