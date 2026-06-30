import { SignatureItem } from "~/scripts/types/SignatureItem"

export class ResolutionSignaturesController {
  signatureItems = ref<SignatureItem[]>([])
  maxSignatureOnFirstPage = ref<number>(4)
  maxSignatureOnOtherPages = ref<number>(6)
  signatureStartPage = ref<number>(1)

  language = useLanguage()

  constructor(
    signatureItems: Array<SignatureItem>,
    maxSignatureOnFirstPage: number,
    maxSignatureOnOtherPages: number,
    signatureStartPage: number
  ) {
    this.signatureItems.value = signatureItems
    this.maxSignatureOnFirstPage.value = maxSignatureOnFirstPage
    this.maxSignatureOnOtherPages.value = maxSignatureOnOtherPages
    this.signatureStartPage.value = signatureStartPage
  }

  getSignatureOnPage(page: number): SignatureItem[] {
    if (page < this.signatureStartPage.value) {
      return []
    }

    if (page === this.signatureStartPage.value) {
      return this.signatureItems.value.slice(0, this.maxSignatureOnFirstPage.value)
    }

    const offsetPage = this.signatureStartPage.value + 1
    const skip = (page - offsetPage) * this.maxSignatureOnOtherPages.value + this.maxSignatureOnFirstPage.value
    const lastIndex = Math.min(this.signatureItems.value.length, skip + this.maxSignatureOnOtherPages.value)

    return this.signatureItems.value.slice(skip, lastIndex)
  }

  handleEnlargedSignaturePad(isEnlarged: any): void {
    if (isEnlarged) {
      document.body.classList.add("no-scroll")
    } else {
      document.body.classList.remove("no-scroll")
    }
  }

  loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  loaderSublabel(): string {
    return this.language.isMalay() ? "Resolusi Anda" : "Resolution"
  }
}
