import * as pdfjsLib from "pdfjs-dist"
import { StringUtil } from "~/scripts/utils/String"
import { ref, nextTick, type Ref } from "vue"
import { PDFCanvasItem } from "~/scripts/types/PDFCanvasItem"
import type { PDFPageProxy } from "pdfjs-dist"
import { DocumentScaler } from "~/scripts/library/DocumentScaler"
import { PaperOrientation } from "~/scripts/constants/Paper"

export class PdfViewerController {
  pdfUrl = ref<string>("")
  numberOfPages = ref<number>(1)
  canvases: Record<string, PDFCanvasItem> = {}

  pdfCanvas: HTMLCanvasElement | null = null
  currentPage = ref<number>(1)
  pageCanvases: Record<number, HTMLCanvasElement | null> = {}

  zoomLevel = ref<number>(0)
  isRendering = ref<boolean>(false)
  documentScaler = ref<DocumentScaler>(new DocumentScaler(PaperOrientation.Portrait, 140))
  documentHeight = ref<number>(0)

  language = useLanguage()

  hasToShowOverlay = ref<boolean>(false)
  overlayText: Ref<string> = ref<string>("")
  overlaySubtext: Ref<string> = ref<string>("")

  emitEvents: any | null = null

  canZoom: Ref<boolean> = ref<boolean>(true)

  constructor(
    pdfUrl: string,
    hasToShowOverlay: boolean,
    overlayText: string,
    overlaySubtext: string,
    emitEvents: any | null,
    canZoom: boolean,
    zoomLevel: number
  ) {
    this.pdfUrl.value = pdfUrl
    this.emitEvents = emitEvents
    this.hasToShowOverlay.value = hasToShowOverlay
    this.overlayText.value = overlayText
    this.overlaySubtext.value = overlaySubtext
    this.canZoom.value = canZoom
    this.zoomLevel.value = zoomLevel
  }

  setHasToShowOverlay(hasToShowOverlay: boolean): void {
    this.hasToShowOverlay.value = hasToShowOverlay
  }

  setOverlayText(overlayText: string): void {
    this.overlayText.value = overlayText
  }

  setOverlaySubtext(overlaySubtext: string): void {
    this.overlaySubtext.value = overlaySubtext
  }

  setPdfUrl(pdfUrl: string) {
    this.pdfUrl.value = pdfUrl
    this.zoomLevel.value = 0
    this.currentPage.value = 1
  }

  setPdfCanvas(pdfCanvas: HTMLCanvasElement): void {
    this.pdfCanvas = pdfCanvas
  }

  setPageCanvas(pageNumber: number, canvas: HTMLCanvasElement | null): void {
    if (canvas) {
      this.pageCanvases[pageNumber] = canvas
    } else {
      delete this.pageCanvases[pageNumber]
    }
  }

  getPageRange(): string[] {
    return Array.from({ length: this.numberOfPages.value }, (_, i) => (i + 1).toString())
  }

  async loadPdf() {
    const loadingTask = pdfjsLib.getDocument(this.pdfUrl.value)
    const pdf = await loadingTask.promise
    this.numberOfPages.value = pdf.numPages
    return pdf
  }

  async renderPdf(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.pdfUrl.value)) {
      return
    }

    await this.renderAllPages()
  }

  async renderPage(page: PDFPageProxy, canvas: HTMLCanvasElement): Promise<void> {
    const defaultViewport = page.getViewport({ scale: 1 })
    const viewportWidth = defaultViewport.width
    const viewportHeight = defaultViewport.height
    this.documentScaler.value.setViewPortScale(viewportWidth, viewportHeight)

    const viewport = page.getViewport({ scale: 1.3 })
    this.documentHeight.value = viewport.height

    const context = canvas.getContext("2d")

    if (!context) {
      return
    }

    canvas.width = viewport.width
    canvas.height = viewport.height

    await page.render({ canvas: canvas, canvasContext: context, viewport }).promise
  }

  async renderAllPages(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.pdfUrl.value)) {
      return
    }

    const pdf = await this.loadPdf()

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const canvas = this.pageCanvases[pageNumber]
      if (!canvas) {
        continue
      }

      const page = await pdf.getPage(pageNumber)
      nextTick(async () => {
        await this.renderPage(page, canvas)
      })
    }
  }

  onDocumentClicked(): void {
    if (this.isShowOverlay) {
      return
    }

    if (window.innerWidth > 500) {
      this.zoomLevel.value = (this.zoomLevel.value + 1) % 3
    } else {
      this.zoomLevel.value = this.zoomLevel.value === 2 ? 0 : 2
    }

    this.emitEvents("zoom", this.zoomLevel.value)

    if (!this.canZoom.value) {
      this.zoomLevel.value = 0
    }
  }

  getDocumentWrapperStyle(): string {
    let scaleFactor = this.documentScaler.value.scaleFactor

    if (this.zoomLevel.value === 1) {
      scaleFactor = 1
    } else if (this.zoomLevel.value === 2) {
      return ""
    }

    let scaledHeight = this.documentHeight.value * scaleFactor

    return `transform: scale(${scaleFactor}); max-height: ${scaledHeight}px;`
  }

  getPdfViewerStyle(): string {
    if (this.zoomLevel.value > 0) {
      return ""
    }

    if (this.documentHeight.value * this.documentScaler.value.scaleFactor <= 0) {
      return "min-height: 535px;"
    }

    return `max-height: ${this.documentHeight.value * this.documentScaler.value.scaleFactor}px;`
  }

  getEnlargedClass(): string {
    switch (this.zoomLevel.value) {
      case 1:
        return "enlarged"
      case 2:
        return "enlarged-max"
      default:
        return ""
    }
  }

  async onGoToPage(pageNumber: number): Promise<void> {
    this.currentPage.value = pageNumber
  }

  canvasClass(pageNumber: number): string {
    if (this.zoomLevel.value === 0 && this.currentPage.value !== pageNumber) {
      return "hidden"
    }

    return ""
  }

  get isShowOverlay(): boolean {
    if (StringUtil.isNullOrEmpty(this.pdfUrl.value)) {
      return this.hasToShowOverlay.value
    }

    return !StringUtil.isNullOrEmpty(this.pdfUrl.value) && this.hasToShowOverlay.value
  }

  get noDocument(): string {
    if (!StringUtil.isNullOrEmpty(this.overlayText.value)) {
      return this.overlayText.value
    }

    return this.language.isMalay()
      ? `Tidak Berjaya untuk Memaut Dokumen buat Masa ini`
      : `Unable to Retrieve Your Document for Now`
  }

  get noDocumentSubtitle(): string {
    if (!StringUtil.isNullOrEmpty(this.overlaySubtext.value)) {
      return this.overlaySubtext.value
    }

    return this.language.isMalay()
      ? `Ia akan ditunjuk apabila ia sudah sedia.`
      : `It will be displayed once it becomes available.`
  }
}
