import type { PaperOrientation, PaperSize } from "../constants/Paper"

export interface IPropsIdentificationDocumentWatermark {
  companyName: string
  companyRegistrationNumber: string
  identificationFileUrl: string
  altIdentificationFileUrl: string | null
  markerText: string
  paperOrientation: PaperOrientation
  paperSize: PaperSize
}

export class PropsIdentificationDocumentWatermark implements IPropsIdentificationDocumentWatermark {
  companyName: string
  companyRegistrationNumber: string
  identificationFileUrl: string
  altIdentificationFileUrl: string | null
  markerText: string
  paperOrientation: PaperOrientation
  paperSize: PaperSize

  constructor(
    companyName: string,
    companyRegistrationNumber: string,
    identificationFileUrl: string,
    altIdentificationFileUrl: string | null,
    markerText: string,
    paperOrientation: PaperOrientation,
    paperSize: PaperSize
  ) {
    this.companyName = companyName
    this.companyRegistrationNumber = companyRegistrationNumber
    this.identificationFileUrl = identificationFileUrl
    this.altIdentificationFileUrl = altIdentificationFileUrl
    this.markerText = markerText
    this.paperOrientation = paperOrientation
    this.paperSize = paperSize
  }
}
