export interface IPropsLetterChangeReassignCosec {
  companyName: string
  registrationNumberNew: string
  registrationNumberOld: string
  cosecCompanyName: string
  cosecAddressLine1: string
  cosecAddressLine2: string
  cosecAddressPostCode: string
  cosecAddressCity: string
  cosecAddressState: string
  cosecName: string
  cosecEmail: string
  cosecPhone: string
  directorName: string
  isDocumentEditable: boolean
  isReadonly: boolean
  signatureUrl: string
  documentDate: string
  areValuesValid: boolean
  validationMessage: string
  hasSigned: boolean
  isSignatureEditable: boolean
  isSignatureHidden: boolean
  isInPreviewMode: boolean
  showWatermark: boolean
  watermarkText: string
}

export class PropsLetterChangeReassignCosec implements IPropsLetterChangeReassignCosec {
  companyName: string
  registrationNumberNew: string
  registrationNumberOld: string
  cosecCompanyName: string
  cosecAddressLine1: string
  cosecAddressLine2: string
  cosecAddressPostCode: string
  cosecAddressCity: string
  cosecAddressState: string
  cosecName: string
  cosecEmail: string
  cosecPhone: string
  directorName: string
  isDocumentEditable: boolean
  isReadonly: boolean
  signatureUrl: string
  documentDate: string
  areValuesValid: boolean
  validationMessage: string
  hasSigned: boolean
  isSignatureEditable: boolean
  isSignatureHidden: boolean
  isInPreviewMode: boolean
  showWatermark: boolean
  watermarkText: string

  constructor(
    companyName: string,
    registrationNumberNew: string,
    registrationNumberOld: string,
    cosecCompanyName: string,
    cosecAddressLine1: string,
    cosecAddressLine2: string,
    cosecAddressPostCode: string,
    cosecAddressCity: string,
    cosecAddressState: string,
    cosecName: string,
    cosecEmail: string,
    cosecPhone: string,
    directorName: string,
    isDocumentEditable: boolean,
    isReadonly: boolean,
    signatureUrl: string,
    documentDate: string,
    areValuesValid: boolean,
    validationMessage: string,
    hasSigned: boolean,
    isSignatureEditable: boolean,
    isSignatureHidden: boolean,
    isInPreviewMode: boolean,
    showWatermark: boolean,
    watermarkText: string
  ) {
    this.companyName = companyName
    this.registrationNumberNew = registrationNumberNew
    this.registrationNumberOld = registrationNumberOld
    this.cosecCompanyName = cosecCompanyName
    this.cosecAddressLine1 = cosecAddressLine1
    this.cosecAddressLine2 = cosecAddressLine2
    this.cosecAddressPostCode = cosecAddressPostCode
    this.cosecAddressCity = cosecAddressCity
    this.cosecAddressState = cosecAddressState
    this.cosecName = cosecName
    this.cosecEmail = cosecEmail
    this.cosecPhone = cosecPhone
    this.directorName = directorName
    this.isDocumentEditable = isDocumentEditable
    this.isReadonly = isReadonly
    this.signatureUrl = signatureUrl
    this.documentDate = documentDate
    this.areValuesValid = areValuesValid
    this.validationMessage = validationMessage
    this.hasSigned = hasSigned
    this.isSignatureEditable = isSignatureEditable
    this.isSignatureHidden = isSignatureHidden
    this.isInPreviewMode = isInPreviewMode
    this.showWatermark = showWatermark
    this.watermarkText = watermarkText
  }
}
