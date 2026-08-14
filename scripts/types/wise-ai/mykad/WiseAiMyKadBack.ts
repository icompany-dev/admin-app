import type { PartialObject } from "lodash"

//NOTE(Bahiyah): Response from Wise AI include more than this
//    - but we should only capture the ones that we need
export class WiseAiMyKadBack {
  type: string = ""
  idFraudDetected: boolean = false
  isValid: boolean = false
  documentImageBase64: string = ""

  constructor(data: PartialObject<WiseAiMyKadBack> | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)
  }
}
