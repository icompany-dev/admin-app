import type { PartialObject } from "lodash"

//NOTE(Bahiyah): Response from Wise AI include more than this
//    - but we should only capture the ones that we need
export class WiseAiMyKadFront {
  documentImageBase64: string = ""
  type: string = ""
  idFraudDetected: boolean = false
  isValid: string = ""
  icNumber: string = ""
  name: string = ""
  birthdateISO: string = ""
  street: string = ""
  city: string = ""
  state: string = ""
  zipCode: string = ""
  fullAddress: string = ""
  faceImageBase64: string = ""
  religion: string = ""
  gender: string = ""

  constructor(data: PartialObject<WiseAiMyKadFront> | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)
  }
}
