export class SignatureItem {
  signatureUrl: string | null = null //this can be base64 or the image file from AWS
  hasSigned: boolean = false
  isSignatureEditable: boolean = false
  isSignatureHidden: boolean = false
  name: string = ""
  email: string = ""
  role: string = ""
  canAbstain: boolean = true

  constructor(
    signatureUrl: string | null,
    hasSigned: boolean,
    isSignatureEditable: boolean,
    isSignatureHidden: boolean,
    name: string,
    email: string,
    role: string,
    canAbstain: boolean = true
  ) {
    this.signatureUrl = signatureUrl
    this.hasSigned = hasSigned
    this.isSignatureEditable = isSignatureEditable
    this.isSignatureHidden = isSignatureHidden
    this.name = name
    this.email = email
    this.role = role
    this.canAbstain = canAbstain
  }
}
