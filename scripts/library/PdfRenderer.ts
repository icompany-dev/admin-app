import * as pdfjsLib from "pdfjs-dist"
import { PDFCanvasItem } from "~/scripts/types/PDFCanvasItem"
import { DocumentScaler } from "~/scripts/library/DocumentScaler"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { StringUtil } from "~/scripts/utils/String"
import type { PDFPageProxy } from "pdfjs-dist"

export class PdfRenderer {
  pdfUrl: string = ""
  numberOfPages: number = 1
  canvases: Record<string, PDFCanvasItem> = {}

  pdfCanvas: HTMLCanvasElement | null = null
  currentPage: number = 1
  pageCanvases: Record<number, HTMLCanvasElement | null> = {}

  zoomLevel: number = 0
  isRendering: boolean = false
  documentScaler: DocumentScaler = new DocumentScaler(PaperOrientation.Portrait, 100)
  documentHeight: number = 0

  constructor(pdfFileUrl: string) {
    this.pdfUrl = pdfFileUrl
  }

  setPageCanvas(pageNumber: number, canvas: HTMLCanvasElement | null): void {
    if (canvas) {
      this.pageCanvases[pageNumber] = canvas
    } else {
      delete this.pageCanvases[pageNumber]
    }
  }

  async loadPdf(): Promise<any> {
    const loadingTask = pdfjsLib.getDocument(this.pdfUrl)
    const pdf = await loadingTask.promise
    this.numberOfPages = pdf.numPages
    return pdf
  }

  async renderPdf(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.pdfUrl)) {
      return
    }

    await this.renderAllPages()
  }

  async renderPage(page: PDFPageProxy, canvas: HTMLCanvasElement): Promise<void> {
    const defaultViewport = page.getViewport({ scale: 1 })
    const viewportWidth = defaultViewport.width
    const viewportHeight = defaultViewport.height
    this.documentScaler.setViewPortScale(viewportWidth, viewportHeight)

    const viewport = page.getViewport({ scale: 1.3 })
    this.documentHeight = viewport.height

    const context = canvas.getContext("2d")

    if (!context) {
      return
    }

    canvas.width = viewport.width
    canvas.height = viewport.height

    await page.render({ canvas: canvas, canvasContext: context, viewport }).promise
  }

  async renderAllPages(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.pdfUrl)) {
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
}
