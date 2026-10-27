import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import type { PropsIdentificationDocumentWatermark } from "~/scripts/props/PropsIdentificationDocumentWatermark"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"
import * as pdfjsLib from "pdfjs-dist"
import { PDFCanvasItem } from "~/scripts/types/PDFCanvasItem"
import type { PDFPageProxy } from "pdfjs-dist"

export class IdentificationDocumentWatermarkController {
  emitEvents: any | null = null

  companyName: Ref<string> = ref<string>("")
  companyRegistrationNumber: Ref<string> = ref<string>("")
  identificationFileUrl: Ref<string> = ref<string>("")
  altIdentificationFileUrl: Ref<string | null> = ref<string | null>(null)
  markerText: Ref<string> = ref<string>("")
  paperOrientation: Ref<PaperOrientation> = ref<PaperOrientation>(PaperOrientation.Landscape)
  paperSize: Ref<PaperSize> = ref<PaperSize>(PaperSize.A4)

  documentRef: any | null = null

  numberOfPages = ref<number>(1)
  canvases: Record<string, PDFCanvasItem> = {}

  pdfCanvas: HTMLCanvasElement | null = null
  currentPage = ref<number>(1)
  pageCanvases: Record<number, HTMLCanvasElement | null> = {}

  constructor(props: PropsIdentificationDocumentWatermark, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
  }

  async setDataFromProps(props: PropsIdentificationDocumentWatermark): Promise<void> {
    this.companyName.value = props.companyName
    this.companyRegistrationNumber.value = props.companyRegistrationNumber
    this.identificationFileUrl.value = props.identificationFileUrl
    this.altIdentificationFileUrl.value = props.altIdentificationFileUrl
    this.markerText.value = props.markerText
    this.paperOrientation.value = props.paperOrientation
    this.paperSize.value = props.paperSize

    await this.renderAllPages()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  setPageCanvas(pageNumber: number, canvas: HTMLCanvasElement | null): void {
    if (canvas) {
      this.pageCanvases[pageNumber] = canvas
    } else {
      delete this.pageCanvases[pageNumber]
    }
  }

  async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    let pages = await PdfPaperUtil.getPdfElements(this.documentRef)

    return pages
  }

  async loadPdf() {
    const loadingTask = pdfjsLib.getDocument(this.identificationFileUrl.value)
    const pdf = await loadingTask.promise
    this.numberOfPages.value = pdf.numPages
    return pdf
  }

  async renderPdf(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.identificationFileUrl.value)) {
      return
    }

    await this.renderAllPages()
  }

  async renderPage(page: PDFPageProxy, canvas: HTMLCanvasElement): Promise<void> {
    const defaultViewport = page.getViewport({ scale: 1 })
    const viewportWidth = defaultViewport.width
    const viewportHeight = defaultViewport.height

    const viewport = page.getViewport({ scale: 1 })

    const context = canvas.getContext("2d")

    if (!context) {
      return
    }

    canvas.width = viewport.width
    canvas.height = viewport.height

    await page.render({ canvas: canvas, canvasContext: context, viewport }).promise
  }

  async renderAllPages(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.identificationFileUrl.value) || !this.isPdfFile) {
      return
    }

    const pdf = await this.loadPdf()
    await nextTick()

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

  get hasAltIdentificationFile(): boolean {
    return !StringUtil.isNullOrEmpty(this.altIdentificationFileUrl.value)
  }

  get isPdfFile(): boolean {
    return StringUtil.contains(this.identificationFileUrl.value, "pdf")
  }
}
