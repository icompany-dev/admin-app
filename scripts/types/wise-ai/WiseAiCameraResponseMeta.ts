import type { PartialObject } from "lodash"

export class WiseAiCameraResponseMeta {
  reqTs: number = 0
  respTs: number = 0
  reqId: string = ""

  constructor(data: PartialObject<WiseAiCameraResponseMeta> | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)
  }
}
