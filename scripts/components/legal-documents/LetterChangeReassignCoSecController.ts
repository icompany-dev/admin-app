import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export class LetterChangeReassignCoSecController {
  companyName: Ref<string> = ref<string>("")
  registrationNumberNew: Ref<string> = ref<string>("")
  registrationNumberOld: Ref<string> = ref<string>("")
  cosecCompanyName: Ref<string> = ref<string>("")
  cosecAddressLine1: Ref<string> = ref<string>("")
  cosecAddressLine2: Ref<string> = ref<string>("")
  cosecAddressPostCode: Ref<string> = ref<string>("")
  cosecAddressCity: Ref<string> = ref<string>("")
  cosecAddressState: Ref<string> = ref<string>("")
  cosecName: Ref<string> = ref<string>("")
  cosecEmail: Ref<string> = ref<string>("")
  cosecPhone: Ref<string> = ref<string>("")
  directorName: Ref<string> = ref<string>("")
  signatureUrl: Ref<string | null> = ref<string | null>(null)
  documentDate: Ref<string | null> = ref<string | null>(null)

  isDocumentEditable: Ref<boolean> = ref<boolean>(true)

  isReadOnlyMode: Ref<boolean> = ref<boolean>(false)

  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, true, false, "", "", "Director"))

  emitEvents: any | null = null

  documentRef: any | null = null

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
    isReadOnly: boolean,
    signatureUrl: string | null,
    documentDate: string | null,
    hasSigned: boolean,
    isSignatureEditable: boolean,
    isSignatureHidden: boolean,
    emitEvents: any | null = null
  ) {
    this.emitEvents = emitEvents

    this.setCompanyName(companyName)
    this.setRegistrationNumberNew(registrationNumberNew)
    this.setRegistrationNumberOld(registrationNumberOld)
    this.setCosecCompanyName(cosecCompanyName)
    this.setCosecAddressLine1(cosecAddressLine1)
    this.setCosecAddressLine2(cosecAddressLine2)
    this.setCosecAddressPostCode(cosecAddressPostCode)
    this.setCosecAddressCity(cosecAddressCity)
    this.setCosecAddressState(cosecAddressState)
    this.setCosecName(cosecName)
    this.setCosecEmail(cosecEmail)
    this.setCosecPhone(cosecPhone)
    this.setDirectorName(directorName)
    this.setIsDocumentEditable(isDocumentEditable)
    this.setIsReadOnly(isReadOnly)
    this.setSignatureUrl(signatureUrl)
    this.setDocumentDate(documentDate)
    this.setHasSigned(hasSigned)
    this.setIsSignatureEditable(isSignatureEditable)
    this.setIsSignatureHidden(isSignatureHidden)

    this.signatureItem.value.canAbstain = false
  }

  setCompanyName(companyName: string): void {
    this.companyName.value = companyName ?? ""
  }

  setRegistrationNumberNew(registrationNumberNew: string): void {
    this.registrationNumberNew.value = registrationNumberNew
  }

  setRegistrationNumberOld(registrationNumberOld: string): void {
    this.registrationNumberOld.value = registrationNumberOld
  }

  setCosecCompanyName(cosecCompanyName: string): void {
    this.cosecCompanyName.value = cosecCompanyName
  }

  setCosecAddressLine1(cosecAddressLine1: string): void {
    this.cosecAddressLine1.value = cosecAddressLine1
  }

  setCosecAddressLine2(cosecAddressLine2: string): void {
    this.cosecAddressLine2.value = cosecAddressLine2
  }

  setCosecAddressPostCode(cosecAddressPostCode: string): void {
    this.cosecAddressPostCode.value = cosecAddressPostCode
  }

  setCosecAddressCity(cosecAddressCity: string): void {
    this.cosecAddressCity.value = cosecAddressCity
  }

  setCosecAddressState(cosecAddressState: string): void {
    this.cosecAddressState.value = cosecAddressState
  }

  setCosecName(cosecName: string): void {
    this.cosecName.value = cosecName
  }

  setCosecEmail(cosecEmail: string): void {
    this.cosecEmail.value = cosecEmail
  }

  setCosecPhone(cosecPhone: string): void {
    this.cosecPhone.value = cosecPhone
  }

  setDirectorName(directorName: string): void {
    this.directorName.value = directorName

    nextTick(() => {
      this.signatureItem.value.name = directorName
    })
  }

  setIsDocumentEditable(isDocumentEditable: boolean): void {
    this.isDocumentEditable.value = isDocumentEditable
  }

  setIsReadOnly(isReadOnly: boolean): void {
    this.isReadOnlyMode.value = isReadOnly
  }

  setSignatureUrl(signatureUrl: string | null): void {
    this.signatureUrl.value = StringUtil.isNullOrEmpty(signatureUrl) ? null : signatureUrl

    nextTick(() => {
      this.signatureItem.value.signatureUrl = signatureUrl
    })
  }

  setHasSigned(hasSigned: boolean): void {
    nextTick(() => {
      this.signatureItem.value.hasSigned = hasSigned
    })
  }

  setIsSignatureHidden(isSignatureHidden: boolean): void {
    nextTick(() => {
      this.signatureItem.value.isSignatureHidden = isSignatureHidden
    })
  }

  setIsSignatureEditable(isSignatureEditable: boolean): void {
    nextTick(() => {
      this.signatureItem.value.isSignatureEditable = isSignatureEditable
    })
  }

  setDocumentDate(documentDate: string | null): void {
    if (StringUtil.isNullOrEmpty(documentDate)) {
      this.documentDate.value = null
      return
    }

    let time = useLocalTime()
    this.documentDate.value = time.formatDateOnlyFull(documentDate ?? "")
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  getCompanyNameForSignOff(): string {
    return this.companyName.value.length > 0 ? this.companyName.value : "Name of Your Sdn Bhd as above"
  }

  hasDocumentDate(): boolean {
    return !StringUtil.isNullOrEmpty(this.documentDate.value)
  }

  formattedDocumentDate(): string {
    if (!this.hasDocumentDate()) {
      return "To be determined by iCompany"
    }

    return this.documentDate.value ?? "To be determined by iCompany"
  }

  onNameChanged(value: string): void {
    if (this.companyName.value === value) {
      return
    }

    this.companyName.value = value
    this.emitEvents("nameChanged", this.companyName.value)
  }

  onRegistrationNumberNewUpdated(value: string): void {
    if (this.registrationNumberNew.value === value) {
      return
    }

    this.registrationNumberNew.value = value
    this.emitEvents("registrationNoNewUpdated", this.registrationNumberNew.value)
  }

  onRegistrationNumberOldUpdated(value: string): void {
    if (this.registrationNumberOld.value === value) {
      return
    }

    this.registrationNumberOld.value = value
    this.emitEvents("registrationNoOldUpdated", this.registrationNumberOld.value)
  }

  getData(): ApplicationSwitch {
    let application = new ApplicationSwitch()
    application.name = this.companyName.value
    application.nameType = "sdnbhd"
    application.registrationNumberNew = this.registrationNumberNew.value
    application.registrationNumberOld = this.registrationNumberOld.value
    application.hasCompanySecretary = true
    application.secretaryEmail = this.cosecEmail.value
    application.secretaryPhone = this.cosecPhone.value
    application.secretaryCompanyName = this.cosecCompanyName.value
    application.secretaryCompanyAddress = `${this.cosecAddressLine1.value}\n${this.cosecAddressLine2.value.length > 0 ? this.cosecAddressLine2.value + "\n" : ""}${this.cosecAddressPostCode.value}\n${this.cosecAddressCity.value}\n${this.cosecAddressState.value}`
    application.secretaryName = this.cosecName.value

    return application
  }

  async getLetterPdfElements(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    return await PdfPaperUtil.getPdfElements(this.documentRef as HTMLElement)
  }

  isDataEmpty(): boolean {
    return StringUtil.isNullOrEmpty(this.companyName.value)
  }

  getCompanyName(): string {
    if (StringUtil.isNullOrEmpty(this.companyName.value)) {
      return "Your Company Name"
    }

    return this.companyName.value
  }

  getRegistrationNumberNew(): string {
    if (StringUtil.isNullOrEmpty(this.registrationNumberNew.value)) {
      return "000000000000"
    }

    return this.registrationNumberNew.value
  }

  getRegistrationNumberOld(): string {
    if (StringUtil.isNullOrEmpty(this.registrationNumberOld.value)) {
      return "000000-X"
    }

    return this.registrationNumberOld.value
  }
}
