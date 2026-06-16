import type { SignatureItem } from "../types/SignatureItem"

export interface IPropsResolution {
  companyName: string
  registrationNumberOld: string
  registrationNumberNew: string
  resolutionTitle: string
  resolutionName: string
  signatureTitle: string
  signatureItems: SignatureItem[]
  resolutionDate: string
  totalPages: number
  signatureStartOnPage: number
  maxSignatureOnFirstPage: number
  maxSignatureOnOtherPage: number
  hasAccompanyingDocument: boolean
  isDcr: boolean
  showWatermark: boolean
  watermarkText: string
  contentPages: string[]
  isUsingTemplate: boolean
  isLoading: boolean
  isSignatureTinted: boolean
  signatureTintLabel: string
}

export class PropsResolution implements IPropsResolution {
  companyName: string
  registrationNumberOld: string
  registrationNumberNew: string
  resolutionTitle: string
  resolutionName: string
  signatureTitle: string
  signatureItems: SignatureItem[]
  resolutionDate: string
  totalPages: number
  signatureStartOnPage: number
  maxSignatureOnFirstPage: number
  maxSignatureOnOtherPage: number
  hasAccompanyingDocument: boolean
  isDcr: boolean
  showWatermark: boolean
  watermarkText: string
  contentPages: string[]
  isUsingTemplate: boolean
  isLoading: boolean
  isSignatureTinted: boolean
  signatureTintLabel: string

  constructor(
    companyName: string,
    registrationNumberOld: string,
    registrationNumberNew: string,
    resolutionTitle: string,
    resolutionName: string,
    signatureTitle: string,
    signatureItems: SignatureItem[],
    resolutionDate: string,
    totalPages: number,
    signatureStartOnPage: number,
    maxSignatureOnFirstPage: number,
    maxSignatureOnOtherPage: number,
    hasAccompanyingDocument: boolean,
    isDcr: boolean,
    showWatermark: boolean,
    watermarkText: string,
    contentPages: string[],
    isUsingTemplate: boolean,
    isLoading: boolean,
    isSignatureTinted: boolean = false,
    signatureTintLabel: string = ""
  ) {
    this.companyName = companyName
    this.registrationNumberOld = registrationNumberOld
    this.registrationNumberNew = registrationNumberNew
    this.resolutionTitle = resolutionTitle
    this.resolutionName = resolutionName
    this.signatureTitle = signatureTitle
    this.signatureItems = signatureItems
    this.resolutionDate = resolutionDate
    this.totalPages = totalPages
    this.signatureStartOnPage = signatureStartOnPage
    this.maxSignatureOnFirstPage = maxSignatureOnFirstPage
    this.maxSignatureOnOtherPage = maxSignatureOnOtherPage
    this.hasAccompanyingDocument = hasAccompanyingDocument
    this.isDcr = isDcr
    this.showWatermark = showWatermark
    this.watermarkText = watermarkText
    this.contentPages = contentPages
    this.isUsingTemplate = isUsingTemplate
    this.isLoading = isLoading
    this.isSignatureTinted = isSignatureTinted
    this.signatureTintLabel = signatureTintLabel
  }
}
