import { PaperOrientation } from "~/scripts/constants/Paper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { DocumentScaler } from "~/scripts/library/DocumentScaler"
import { StringUtil } from "~/scripts/utils/String"

export class DocumentWrapperController {
  isInPreviewMode: Ref<boolean> = ref<boolean>(true)
  documentViewMode: Ref<string> = ref<string>(ViewMode.Shrouded)
  isHoverDocument: Ref<boolean> = ref<boolean>(false)
  isOverlayVisible: Ref<boolean> = ref<boolean>(true)
  isShowOverlayInstruction: Ref<boolean> = ref<boolean>(false)
  hasSetFye: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  language = useLanguage()
  eventManager = useEventManagerStore()

  constructor(isInPreviewMode: boolean, hasSetFye: boolean, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setIsInPreviewMode(isInPreviewMode)
    this.setHasSetFye(hasSetFye)
  }

  setIsInPreviewMode(isInPreviewMode: boolean): void {
    this.isInPreviewMode.value = isInPreviewMode
    this.documentViewMode.value = isInPreviewMode ? ViewMode.Shrouded : ViewMode.Edit
  }

  setHasSetFye(hasSetFye: boolean): void {
    this.hasSetFye.value = hasSetFye
  }

  getDocumentScale(): number {
    let documentScaler = new DocumentScaler(PaperOrientation.Portrait)
    let scale = documentScaler.scaleFactor

    if (this.documentViewMode.value === ViewMode.Enlarged) {
      const targetWidth = window.innerWidth * 0.9
      scale = targetWidth / this.paperWidthInPx
    }

    if (!this.isInPreviewMode.value && this.documentViewMode.value === ViewMode.Preview) {
      const targetWidth = window.innerWidth * 0.9
      scale = targetWidth / this.paperWidthInPx
    }

    return scale
  }

  getDocumentContainerStyle(): string {
    if (this.documentViewMode.value === ViewMode.Preview && this.isInPreviewMode) {
      let width = 210
      return `width: ${width}mm;` // big size
    }

    let scale = this.getDocumentScale()
    let scaledHeight = this.paperHeightInPx * scale
    let scaledWidth = this.paperWidthInPx * scale

    if (this.documentViewMode.value === ViewMode.Enlarged) {
      let papers = document.querySelectorAll(".paper:not(.receipt-paper)")
      let totalPages = Math.max(papers.length, 1)
      let height = scaledHeight * totalPages + 100 //add padding bottomm

      return `width: ${scaledWidth}px; height: ${height}px;`
    }

    return `width: ${scaledWidth}px; height: ${scaledHeight}px; overflow-y: hidden`
  }

  getDocumentContentStyle(): string {
    if (this.documentViewMode.value === ViewMode.Preview) {
      return "" // big size
    }

    let scale = this.getDocumentScale()

    return `transform: scale(${scale});`
  }

  getResolutionContainerStyle(): string {
    if (this.documentViewMode.value === ViewMode.Preview || this.documentViewMode.value === ViewMode.Enlarged) {
      return "height: fit-content;" // big size
    }

    let scale = this.getDocumentScale()

    let scaledHeight = this.paperHeightInPx * scale
    let scaledWidth = this.paperWidthInPx * scale

    return `width: ${scaledWidth}px; height: ${scaledHeight}px; overflow-y: hidden;`
  }

  getOverlayStyle(): string {
    if (this.documentViewMode.value !== ViewMode.Shrouded && this.documentViewMode.value !== ViewMode.Edit) {
      return "" // big size
    }

    let scale = this.getDocumentScale()
    let scaledWidth = this.paperWidthInPx * scale
    let scaledHeight = this.paperHeightInPx * scale

    return `width: ${scaledWidth}px; left: calc(50% - ${scaledWidth / 2}px); height: ${scaledHeight}px;`
  }

  getSlipCaseStyle(): string {
    let scale = this.getDocumentScale()
    let slipCasePadding = 0
    let scaledWidth = this.paperWidthInPx * scale - slipCasePadding
    return `width: ${scaledWidth}px; left: calc(50% - ${scaledWidth / 2 + slipCasePadding / 2}px); overflow: hidden`
  }

  isOverlayHidden(): boolean {
    if (this.isShowOverlayInstruction.value || this.documentViewMode.value === ViewMode.Shrouded) {
      return false
    }

    if (!this.isDocumentShrouded()) {
      return true
    }

    return !this.isOverlayVisible.value
  }

  isDocumentShrouded(): boolean {
    return this.documentViewMode.value === ViewMode.Shrouded
  }

  shroudLabel(): string {
    if (this.isShowOverlayInstruction.value) {
      if (this.hasSetFye.value) {
        return this.language.isMalay()
          ? "Tetapkan Tarikh Akhir Kewangan untuk mulakan Akaun Pengurusan anda."
          : "Set your FYE to start your Management Account."
      }

      return this.language.isMalay()
        ? "Klik Teruskan untuk mulakan Akaun Pengurusan anda."
        : "Click on Proceed to Start Your Management Account."
    }

    return this.language.isMalay() ? "Klik untuk Lihat Dokumen" : "Click to Preview"
  }

  handleDocumentClicked(): void {
    if (!this.isInPreviewMode.value) {
      this.isShowOverlayInstruction.value = false

      if (this.documentViewMode.value === ViewMode.Edit) {
        this.documentViewMode.value = ViewMode.Preview
        this.eventManager.setIsDocumentActive(true)
        this.eventManager.setIsDocumentPreview(false)
        return
      }

      return
    }

    if (this.documentViewMode.value === ViewMode.Shrouded) {
      if (window.innerWidth > 500) {
        this.isShowOverlayInstruction.value = true
        this.documentViewMode.value = ViewMode.Preview
        this.eventManager.setIsDocumentPreview(true)
        this.emitEvents("preview")
      } else {
        this.eventManager.setIsDocumentActive(true)
        this.isShowOverlayInstruction.value = true
        this.documentViewMode.value = ViewMode.Enlarged
      }
      return
    }

    if (this.documentViewMode.value === ViewMode.Preview) {
      this.eventManager.setIsDocumentActive(true)
      this.eventManager.setIsDocumentPreview(false)
      this.isShowOverlayInstruction.value = true
      this.documentViewMode.value = ViewMode.Enlarged
      return
    }

    if (this.documentViewMode.value === ViewMode.Enlarged) {
      this.eventManager.setIsDocumentActive(false)
      this.isShowOverlayInstruction.value = false
      this.documentViewMode.value = ViewMode.Shrouded
      this.emitEvents("shrouded")

      if (this.isHoverDocument.value) {
        this.isOverlayVisible.value = false
      }

      return
    }

    if (this.documentViewMode.value === ViewMode.Edit) {
      this.documentViewMode.value = ViewMode.Preview
      return
    }
  }

  setDocumentHover(isHoverDocument: boolean): void {
    this.isHoverDocument.value = isHoverDocument

    if (!this.isHoverDocument.value) {
      this.isOverlayVisible.value = true
    }
  }

  get paperHeightInPx(): number {
    return (297 / 25.4) * 96
  }

  get paperWidthInPx(): number {
    return (210 / 25.4) * 96
  }

  get slipCaseTitle(): string {
    return this.language.isMalay() ? "Ini adalah Akaun Pengurusan" : "This is a Management Account."
  }

  get backButton(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  get proceedButton(): string {
    return this.language.isMalay() ? "Teruskan" : "Proceed"
  }

  get showSlipCase(): boolean {
    if (!this.isInPreviewMode.value) {
      return false
    }

    return this.documentViewMode.value === ViewMode.Shrouded
  }
}
