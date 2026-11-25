import * as pdfjsLib from "pdfjs-dist"
import { StringUtil } from "~/scripts/utils/String"
import type { PDFPageProxy } from "pdfjs-dist"
import { Error } from "~/scripts/library/Error"
import { PDFDocument, PDFPage } from "pdf-lib"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"

export class ViewDocumentController {
  pdfUrl = ref<string>("")
  filename = ref<string>("")
  isShowing = ref<boolean>(false)
  isRendering = ref<boolean>(false)

  currentPage = ref<number>(1)
  totalPages = ref<number>(1)

  pdfCanvasRef: HTMLCanvasElement | null = null

  pageCanvases: Record<number, HTMLCanvasElement | null> = {}

  language = useLanguage()
  eventManager = useEventManagerStore()

  emitEvents: any | null = null

  isDownloading: Ref<boolean> = ref<boolean>(false)
  isPrinting: Ref<boolean> = ref<boolean>(false)

  constructor(pdfUrl: string, filename: string, emitEvents: any | null) {
    this.emitEvents = emitEvents
    this.setPdfUrl(pdfUrl)
    this.setFilename(filename)
  }

  addEventListeners(): void {
    document.addEventListener("keydown", this.handleKeyDown.bind(this))
  }

  removeEventListeners(): void {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this))
  }

  setFilename(filename: string): void {
    this.filename.value = filename
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

  async onDownloadClicked(): Promise<void> {
    if (this.isDownloading.value) {
      return
    }

    try {
      this.isDownloading.value = true

      if (StringUtil.isNullOrEmpty(this.pdfUrl.value)) {
        let error = new Error()
        error.title = this.language.isMalay()
          ? "Tidak berjaya untuk muat turun dokumen."
          : "Unable to download the document."
        error.message = this.language.isMalay()
          ? "Sila pastikan dokumen ini wujud."
          : "Please check if the document exists."
        throw error
      }

      const response = await fetch(this.pdfUrl.value)
      if (!response.ok) {
        let error = new Error()
        error.title = this.language.isMalay()
          ? "Tidak berjaya untuk muat turun dokumen."
          : "Unable to download the document."
        error.message = this.language.isMalay()
          ? "Sila pastikan dokumen ini wujud."
          : "Please check if the document exists."
        throw error
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.setAttribute("download", this.filename.value)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      }
    } finally {
      this.isDownloading.value = false
    }
  }

  async onPrintClicked(): Promise<void> {
    if (this.isPrinting.value) {
      return
    }

    this.isPrinting.value = true

    try {
      if (StringUtil.isNullOrEmpty(this.pdfUrl.value)) {
        let error = new Error()
        error.title = this.language.isMalay()
          ? "Tidak berjaya untuk muat turun dokumen."
          : "Unable to download the document."
        error.message = this.language.isMalay()
          ? "Sila pastikan dokumen ini wujud."
          : "Please check if the document exists."
        throw error
      }

      const response = await fetch(this.pdfUrl.value)
      if (!response.ok) {
        let error = new Error()
        error.title = this.language.isMalay()
          ? "Tidak berjaya untuk muat turun dokumen."
          : "Unable to download the document."
        error.message = this.language.isMalay()
          ? "Sila pastikan dokumen ini wujud."
          : "Please check if the document exists."
        throw error
      }

      let blob = new Blob([await response.arrayBuffer()], { type: "application/pdf" })
      const blobUrl = URL.createObjectURL(blob)

      const printWindow = window.open(blobUrl, "_blank")
      if (!printWindow) {
        throw "Fail to open new window"
      }

      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
      }
    } catch (e) {
      console.error(e)
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isPrinting.value = false
    }
  }

  get actionTrayElements(): ActionTrayElement[] {
    return [
      new ActionTrayElement("back", this.hide.bind(this), {
        label: new ActionTrayLabel("Back", "Kembali"),
        iconClass: "fa-solid fa-circle-arrow-left",
        isIconStart: true,
      }),
      new ActionTrayElement("download", this.onDownloadClicked.bind(this), {
        label: new ActionTrayLabel("Download", "Muat Turun"),
        isDisabled: this.isDownloading.value,
        iconClass: this.isDownloading.value ? "fa-solid fa-spin fa-spinner" : "",
        isIconStart: this.isDownloading.value,
      }),
      new ActionTrayElement("print", this.onPrintClicked.bind(this), {
        label: new ActionTrayLabel("Print", "Cetak"),
        isDisabled: this.isPrinting.value,
        iconClass: this.isPrinting.value ? "fa-solid fa-spin fa-spinner" : "",
        isIconStart: this.isPrinting.value,
      }),
    ]
  }
}
