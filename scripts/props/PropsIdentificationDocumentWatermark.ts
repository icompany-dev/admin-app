import type { PaperOrientation, PaperSize } from "../constants/Paper"

export interface IPropsIdentificationDocumentWatermark {
  identificationFileUrl: string
  altIdentificationFileUrl: string | null
  markerText: string
  paperOrientation: PaperOrientation
  paperSize: PaperSize
}

export class PropsIdentificationDocumentWatermark implements IPropsIdentificationDocumentWatermark {
  identificationFileUrl: string
  altIdentificationFileUrl: string | null
  markerText: string
  paperOrientation: PaperOrientation
  paperSize: PaperSize

  constructor(
    identificationFileUrl: string,
    altIdentificationFileUrl: string | null,
    markerText: string,
    paperOrientation: PaperOrientation,
    paperSize: PaperSize
  ) {
    this.identificationFileUrl = identificationFileUrl
    this.altIdentificationFileUrl = altIdentificationFileUrl
    this.markerText = markerText
    this.paperOrientation = paperOrientation
    this.paperSize = paperSize
  }
}
