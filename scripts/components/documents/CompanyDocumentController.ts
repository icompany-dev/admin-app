import { CompanyDocument } from "~/scripts/types/CompanyDocument"
import * as pdfjsLib from "pdfjs-dist"
import { StringUtil } from "~/scripts/utils/String"
import type { PropsDocument } from "~/scripts/props/PropsDocument"
import { PaperOrientation } from "~/scripts/constants/Paper"

export class CompanyDocumentController {
  companyDocument = ref<CompanyDocument>(new CompanyDocument("", false, "", null, false, new Date()))

  time = useLocalTime()
  language = useLanguage()
  emitEvents: any | null = null

  isEnlarged = ref<boolean>(false)
  pdfCanvasRef: HTMLCanvasElement | null = null

  canvasScale = ref<number>(1)

  isRendering = ref<boolean>(false)
  urlsToRender = ref<string[]>([])
  renderedUrl = ref<string[]>([])

  paperOrientation: Ref<string> = ref<string>(PaperOrientation.Portrait)

  private currentLoadingTask: any = null

  constructor(props: PropsDocument, emitEvents: any | null) {
    this.companyDocument.value = new CompanyDocument(
      props.id,
      props.isSelected,
      props.documentName,
      props.fileUrl,
      props.isFromMyData,
      props.documentDate,
      "",
      1, // Check this again.
      props.isDisabled
    )

    this.emitEvents = emitEvents
    this.paperOrientation.value = props.paperOrientation

    this.addToUrlsToRender(props.fileUrl ?? "")

    this.setIsEnlarged(props.isShowEnlarged)
    this.setCanvasScale(props.canvasScale)

    this.renderPdf()
  }

  setId(id: string): void {
    this.companyDocument.value.id = id
  }

  setIsSelected(isSelected: boolean): void {
    this.companyDocument.value.isSelected = isSelected
  }

  setDocumentName(documentName: string): void {
    this.companyDocument.value.documentName = documentName
  }

  async setIsEnlarged(isEnlarged: boolean): Promise<void> {
    this.isEnlarged.value = isEnlarged
    await this.renderPdf()
  }

  async setFileUrl(fileUrl: string | null): Promise<void> {
    this.companyDocument.value.fileUrl = fileUrl

    this.addToUrlsToRender(fileUrl ?? "")

    await this.renderPdf()
  }

  setIsFromMyData(isFromMyData: boolean): void {
    this.companyDocument.value.isFromMyData = isFromMyData
  }

  setDocumentDate(documentDate: Date): void {
    this.companyDocument.value.documentDate = documentDate
  }

  setIsDisabled(isDisabled: boolean): void {
    this.companyDocument.value.isDisabled = isDisabled
  }

  async setCanvasScale(scale: number): Promise<void> {
    this.canvasScale.value = scale
    await this.renderPdf()
  }

  async setPdfCanvasRef(pdfCanvasRef: HTMLCanvasElement | null): Promise<void> {
    if (this.pdfCanvasRef) {
      return
    }

    this.pdfCanvasRef = pdfCanvasRef
    await this.renderPdf()
  }

  addToUrlsToRender(fileUrl: string): void {
    if (StringUtil.isNullOrEmpty(fileUrl)) {
      return
    }

    let isAdded = this.urlsToRender.value.some((d: string) => {
      return d === fileUrl
    })

    if (!isAdded) {
      this.urlsToRender.value.push(fileUrl)
    }
  }

  onIsSelectedClicked(): void {
    this.emitEvents("isSelectedChanged", !this.companyDocument.value.isSelected)
  }

  documentDate(): string {
    return this.time.formatDateOnlyFull(this.companyDocument.value.documentDate.toLocaleString())
  }

  async renderPdf(): Promise<void> {
    if (this.isRendering.value || !this.pdfCanvasRef) {
      return
    }

    try {
      if (this.urlsToRender.value.length <= 0) {
        return
      }
      let urlToRender = this.urlsToRender.value.shift()
      if (!urlToRender) {
        return
      }

      this.isRendering.value = true
      this.currentLoadingTask = pdfjsLib.getDocument(urlToRender)
      const pdf = await this.currentLoadingTask.promise
      const page = await pdf.getPage(1)

      let viewport = page.getViewport({ scale: this.canvasScale.value })
      const context = this.pdfCanvasRef.getContext("2d")

      if (!context || !this.pdfCanvasRef) {
        this.pdfCanvasRef.width = this.paperOrientation.value === PaperOrientation.Portrait ? 148 : 210
        this.pdfCanvasRef.height = this.paperOrientation.value === PaperOrientation.Portrait ? 210 : 148
        return
      }

      context.clearRect(0, 0, this.pdfCanvasRef.width, this.pdfCanvasRef.height)

      this.pdfCanvasRef.width = viewport.width
      this.pdfCanvasRef.height = viewport.height

      if (this.paperOrientation.value === PaperOrientation.Portrait && viewport.height !== 210) {
        this.pdfCanvasRef.width = 148
        this.pdfCanvasRef.height = 210
      } else if (this.paperOrientation.value === PaperOrientation.Landscape && viewport.height !== 148) {
        this.pdfCanvasRef.width = 210
        this.pdfCanvasRef.height = 148
      }

      await page.render({
        canvas: this.pdfCanvasRef,
        canvasContext: context,
        viewport,
      }).promise

      this.renderedUrl.value.push(urlToRender)
    } catch (e) {
      console.error(e)
    } finally {
      this.isRendering.value = false
      this.currentLoadingTask = null

      if (this.urlsToRender.value.length > 0) {
        this.renderPdf()
      }
    }
  }

  isPreviewNotAvailable() {
    return this.companyDocument.value.isFromMyData || !this.companyDocument.value.fileUrl
  }

  previewNotAvailable(): string {
    if (this.companyDocument.value.isFromMyData) {
      return this.language.isMalay() ? "Dapatkan dari SSM?" : "Purchase this from SSM?"
    }

    return this.language.isMalay() ? "Dokumen Gagal Dipaparkan" : "Preview Not Available"
  }

  onDocumentClicked(): void {
    if (this.companyDocument.value.isFromMyData || StringUtil.isNullOrEmpty(this.companyDocument.value.fileUrl)) {
      return
    }

    this.emitEvents("isViewingDocument")
  }

  destroy(): void {
    this.urlsToRender.value = []

    if (this.currentLoadingTask) {
      this.currentLoadingTask.destroy()
      this.currentLoadingTask = null
    }

    this.pdfCanvasRef = null
  }
}
