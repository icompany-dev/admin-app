import type { PartialObject } from "lodash"
import { WiseAiMyKadFront } from "./WiseAiMyKadFront"
import { WiseAiMyKadBack } from "./WiseAiMyKadBack"
import type { IWiseAiDecryptedData } from "../IWiseAiDecryptedData"
import { WiseAiMyKadFace } from "./WiseAiMyKadFace"
import { IdentificationTypes } from "~/scripts/constants/IdentificationTypes"
import { WiseAiGender } from "~/scripts/constants/WiseAi"

//NOTE(Bahiyah): Response from Wise AI include more than this
//    - but we should only capture the ones that we need
export class WiseAiMyKad implements IWiseAiDecryptedData {
  sessionId: string = ""
  ekycSuccess: boolean = false
  isPending: boolean = false
  mykadFrontIsValid: boolean = false
  mykadBackIsValid: boolean = false
  livenessDetected: boolean = false
  mykadVsFaceIsMatch: boolean = false
  faceIsMatch: boolean = false
  mykadFront: WiseAiMyKadFront = new WiseAiMyKadFront()
  mykadBack: WiseAiMyKadBack = new WiseAiMyKadBack()
  face: WiseAiMyKadFace = new WiseAiMyKadFace()

  constructor(data: PartialObject<WiseAiMyKad> | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)

    this.mykadFront = new WiseAiMyKadFront(data.mykadFront)
    this.mykadBack = new WiseAiMyKadBack(data.mykadBack)
    this.face = new WiseAiMyKadFace(data.face)
  }

  name(): string {
    return this.mykadFront.name
  }

  identificationNumber(): string {
    return this.mykadFront.icNumber.replace(/[-\s]/g, "")
  }

  identificationType(): string {
    return IdentificationTypes.IC.id
  }

  gender(): string {
    switch (this.mykadFront.gender?.toUpperCase()) {
      case WiseAiGender.Male:
        return "male"
      case WiseAiGender.Female:
        return "female"
      default:
        return ""
    }
  }

  citizenship(): string {
    return "malaysia"
  }

  addressLine1(): string {
    return this.mykadFront.street?.replace(/\r?\n/g, " ").trim() ?? ""
  }

  postcode(): string {
    return this.mykadFront.zipCode?.trim() ?? ""
  }

  faceImageBase64(): string {
    return this.face.faceImageBase64 ?? ""
  }

  documentFrontImageBase64(): string {
    return this.mykadFront.documentImageBase64 ?? ""
  }

  documentBackImageBase64(): string {
    return this.mykadBack.documentImageBase64 ?? ""
  }
}
