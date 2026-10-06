import * as pdfjsLib from "pdfjs-dist"
import { StringUtil } from "~/scripts/utils/String"
import type { PDFPageProxy } from "pdfjs-dist"

export class ViewDocumentController {
  pdfUrl = ref<string>("")
  isShowing = ref<boolean>(false)
  isRendering = ref<boolean>(false)

  currentPage = ref<number>(1)
  totalPages = ref<number>(1)

  pdfCanvasRef: HTMLCanvasElement | null = null

  pageCanvases: Record<number, HTMLCanvasElement | null> = {}

  eventManager = useEventManagerStore()

  emitEvents: any | null = null

  constructor(pdfUrl: string, emitEvents: any | null) {
    this.emitEvents = emitEvents
    this.setPdfUrl(pdfUrl)
  }

  addEventListeners(): void {
    document.addEventListener("keydown", this.handleKeyDown.bind(this))
  }

  removeEventListeners(): void {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this))
  }

  async setPdfUrl(pdfUrl: string): Promise<void> {
    this.pdfUrl.value = pdfUrl
    await this.renderPdf()
  }

  setPageCanvas(pageNumber: number, canvas: HTMLCanvasElement | null): void {
    if (canvas) {
      this.pageCanvases[pageNumber] = canvas
    } else {
      delete this.pageCanvases[pageNumber]
    }
  }

  show(): void {
    this.isShowing.value = true

    this.eventManager.setIsPopupShowing(true)
  }

  hide(): void {
    this.isShowing.value = false
    this.eventManager.setIsPopupShowing(false)
    this.emitEvents("hide")
  }

  async setPdfCanvasRef(pdfCanvasRef: HTMLCanvasElement | null): Promise<void> {
    this.pdfCanvasRef = pdfCanvasRef
  }

  async renderPdf(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.pdfUrl.value)) {
      return
    }

    await this.renderPages()
  }

  async loadPdf() {
    const loadingTask = pdfjsLib.getDocument(this.pdfUrl.value)
    const pdf = await loadingTask.promise
    this.totalPages.value = pdf.numPages
    return pdf
  }

  async renderPages(): Promise<void> {
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
      await this.renderPage(page, canvas)
    }
  }

  async renderPage(page: PDFPageProxy, canvas: HTMLCanvasElement): Promise<void> {
    let viewport = page.getViewport({ scale: 1.3 })
    const context = canvas.getContext("2d")

    if (!context) {
      return
    }

    canvas.width = viewport.width
    canvas.height = viewport.height

    if (canvas.width > window.innerWidth) {
      let scale = (canvas.width - window.innerWidth) / canvas.width
      viewport = page.getViewport({ scale: scale })
      canvas.width = Math.floor(scale * canvas.width)
    }

    await page.render({ canvas: canvas, canvasContext: context, viewport }).promise
  }

  handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "Escape" && this.isShowing.value) {
      this.hide()
    }
  }

  handleClick(e: MouseEvent | TouchEvent): void {
    if (this.pdfCanvasRef && !this.pdfCanvasRef.contains(e.target as Node)) {
      this.hide()
    }
  }
}
