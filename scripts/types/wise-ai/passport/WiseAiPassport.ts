import type { PartialObject } from "lodash"
import { WiseAiPassportData } from "./WiseAiPassportData"
import type { IWiseAiDecryptedData } from "../IWiseAiDecryptedData"
import { WiseAiPassportFace } from "./WiseAiPassportFace"
import { IdentificationTypes } from "~/scripts/constants/IdentificationTypes"
import { WiseAiGender } from "~/scripts/constants/WiseAi"

//NOTE(Bahiyah): Response from Wise AI include more than this
//    - but we should only capture the ones that we need
export class WiseAiPassport implements IWiseAiDecryptedData {
  sessionId: string = ""
  ekycSuccess: boolean = false
  passportIsValid: boolean = false
  livenessDetected: boolean = false
  passportVsFaceIsMatch: boolean = false
  faceIsMatch: boolean = false
  passport: WiseAiPassportData = new WiseAiPassportData()
  face: WiseAiPassportFace = new WiseAiPassportFace()

  constructor(data: PartialObject<WiseAiPassport> | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)

    this.passport = new WiseAiPassportData(data.passport)
    this.face = new WiseAiPassportFace(data.face)
  }

  name(): string {
    return this.passport.name
  }

  identificationNumber(): string {
    return this.passport.passportNumber.replace(/[-\s]/g, "")
  }

  identificationType(): string {
    return IdentificationTypes.PASSPORT.id
  }

  gender(): string {
    switch (this.passport.gender?.toUpperCase()) {
      case WiseAiGender.Male:
        return "male"
      case WiseAiGender.Female:
        return "female"
      default:
        return ""
    }
  }

  citizenship(): string {
    return this.passport.nationality?.toLowerCase() ?? ""
  }

  addressLine1(): string {
    return ""
  }

  postcode(): string {
    return ""
  }

  faceImageBase64(): string {
    return this.face.faceImageBase64 ?? ""
  }

  documentFrontImageBase64(): string {
    return this.passport.documentImageBase64 ?? ""
  }

  documentBackImageBase64(): string {
    return ""
  }
}
