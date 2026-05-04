import type { IWiseAiFace } from "./IWiseAiFace"

export interface IWiseAiDecryptedData {
  ekycSuccess: boolean
  faceIsMatch: boolean
  livenessDetected: boolean
  face: IWiseAiFace

  name(): string
  identificationNumber(): string
  identificationType(): string
  gender(): string
  citizenship(): string
  addressLine1(): string
  postcode(): string
  faceImageBase64(): string
  documentFrontImageBase64(): string
  documentBackImageBase64(): string
}
