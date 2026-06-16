import { SignatureItem } from "~/scripts/types/SignatureItem"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"

export class Section201Controller {
  companyName: Ref<string> = ref<string>("")
  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, true, false, "", "", "", false))
  hasSigned = ref<boolean>(false)

  time = useLocalTime()
  emitEvents: any | null = null

  constructor(companyName: string, signatureItem: SignatureItem, emitEvents: any | null) {
    this.companyName.value = companyName
    this.emitEvents = emitEvents
    this.signatureItem.value = signatureItem
  }

  setCompanyName(companyName: string): void {
    this.companyName.value = companyName
  }

  setSignatureItem(signatureItem: SignatureItem): void {
    this.signatureItem.value = signatureItem
  }

  getCompanyNumber(): string {
    return ""
  }

  getCurrentDate(): string {
    return this.time.formatDateOnlyFull(new Date().toISOString())
  }

  showSignatureDate(): boolean {
    return this.hasSigned.value
  }

  showStrikethrough(): boolean {
    return this.hasSigned.value
  }

  onSignatureCompleted(signatureData: any): void {
    if (!signatureData) {
      return
    }

    this.hasSigned.value = true
    this.emitEvents("signed", signatureData)
  }
}
