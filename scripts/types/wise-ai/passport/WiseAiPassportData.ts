import type { PartialObject } from "lodash"

//NOTE(Bahiyah): Response from Wise AI include more than this
//    - but we should only capture the ones that we need
export class WiseAiPassportData {
  passportNumber: string = ""
  passportType: string = ""
  optionalData: string = ""
  gender: string = ""
  dateOfBirth: string = ""
  dateOfIssue: string = ""
  dateOfExpiry: string = ""
  issuingCountry: string = ""
  nationality: string = ""
  name: string = ""
  surname: string = ""
  givenName: string = ""
  documentImageBase64: string = ""
  faceImageBase64: string = ""
  mrzString: string = ""
  validCheckDigits: boolean = false

  constructor(data: PartialObject<WiseAiPassportData> | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)
  }
}
