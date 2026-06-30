import { SignatureItem } from "~/scripts/types/SignatureItem"
import { ref, type Ref } from "vue"
import { StringUtil } from "~/scripts/utils/String"
import { useLanguage } from "~/composables/useLanguage"

export class SignatureController {
  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, true, false, "", "", ""))
  isSignaturePadEnlarged = ref<boolean>(false)
  signaturePad: Ref<any> | null = null
  imageFileUrl = ref<string | null>(null)
  emitEvents: any | null = null
  language = useLanguage()

  enlargedComponentStyle = ref({ top: `0px` })

  constructor(signatureItem: SignatureItem, emitEvents: any) {
    this.setSignatureItem(signatureItem)
    this.emitEvents = emitEvents
  }

  setSignatureItem(signatureItem: SignatureItem): void {
    this.signatureItem.value = signatureItem
    this.imageFileUrl.value = signatureItem.signatureUrl
  }

  setSignaturePad(signaturePadRef: any): void {
    this.signaturePad = signaturePadRef
  }

  clearButtonLabel(): string {
    return this.language.isMalay() ? "Cuba Semula" : "Retry"
  }

  doneButtonLabel(): string {
    return this.language.isMalay() ? "Teruskan" : "Proceed"
  }

  hasSignatureUrl(): boolean {
    return this.signatureItem.value.signatureUrl !== null
  }

  showSignature(): boolean {
    return !StringUtil.isNullOrEmpty(this.getSignatureFileImage())
  }

  shouldRequestForSignature(): boolean {
    return (
      StringUtil.isNullOrEmpty(this.getSignatureFileImage()) &&
      this.signatureItem.value.isSignatureEditable &&
      !this.signatureItem.value.isSignatureHidden
    )
  }

  isPending(): boolean {
    return !this.signatureItem.value.hasSigned
  }

  getSignatureFileImage(): string {
    if (this.hasSignatureUrl()) {
      return this.signatureItem.value.signatureUrl ?? ""
    }

    return this.imageFileUrl.value ?? ""
  }

  canSign(): boolean {
    return (
      this.signatureItem.value.isSignatureEditable &&
      !this.signatureItem.value.isSignatureHidden &&
      StringUtil.isNullOrEmpty(this.imageFileUrl.value)
    )
  }

  onSignaturePadClicked(event: MouseEvent): void {
    if (!this.signatureItem.value.isSignatureEditable || this.signatureItem.value.isSignatureHidden) {
      return
    }

    this.isSignaturePadEnlarged.value = true

    if (this.imageFileUrl.value !== null && this.signaturePad && this.signaturePad.value) {
      this.signaturePad.value.fromDataURL(this.imageFileUrl.value)
    } else if (this.imageFileUrl.value === null) {
      this.signaturePad?.value.clearCanvas()
    }
    this.emitEvents("isEnlarged", true)
  }

  onCloseSignaturePadClicked(): void {
    this.isSignaturePadEnlarged.value = false
    this.emitEvents("isEnlarged", false)
  }

  onClearSignature(): void {
    if (this.signaturePad && this.signaturePad.value) {
      this.signaturePad.value.clearCanvas()
    }
  }

  onAbstain(): void {
    this.onClearSignature()
    this.emitEvents("isEnlarged", false)
    this.emitEvents("abstain")
  }

  onSaveSignature(): void {
    if (!this.signaturePad || !this.signaturePad.value) {
      return
    }

    this.imageFileUrl.value = this.signaturePad.value.saveSignature()
    this.isSignaturePadEnlarged.value = false
    this.emitEvents("isEnlarged", false)
    this.emitEvents("signed", this.imageFileUrl.value)
  }

  abstainButtonLabel(): string {
    return this.language.isMalay() ? "Abstain" : "Abstain" //TODO: get the right translation for this
  }

  signNowButtonLabel(): string {
    if (!this.imageFileUrl.value) {
      return this.language.isMalay() ? "Tandatangan" : "Sign Now"
    }

    return this.language.isMalay() ? "Semula" : "Sign Again"
  }

  enlargedSignaturePadId(): string {
    return `${this.signatureItem.value.name.replaceAll(" ", "")}-${this.signatureItem.value.role.replaceAll(" ", "")}`
  }
}
