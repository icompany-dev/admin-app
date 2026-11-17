import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { File as UploadedFile } from "~/scripts/models/File"
import { Form } from "~/scripts/models/Form"
import { Toast } from "~/scripts/library/Toast"

export class Section236ThreeController {
  emitEvents: any | null = null

  documentRef: any | null = null

  language = useLanguage()

  companyId: Ref<string> = ref<string>("")

  isShowing: Ref<boolean> = ref<boolean>(false)
  isGenerating: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any) {
    this.emitEvents = emitEvents
    this.companyId.value = companyId
  }

  setCompanyId(companyId: string): void {
    this.companyId.value = companyId
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  show(): void {
    this.isShowing.value = true
  }

  hide(): void {
    this.isShowing.value = false
  }

  async onGenerateClicked(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    this.isGenerating.value = true

    try {
      let pages = await this.documentRef.getPdfPages()

      let filename = `Section 236(3) - Consent to Act as Company Secretary.pdf`
      let pdfBlob = await PdfPaperUtil.getPdfBlob(pages, 19, filename, PaperSize.A4, PaperOrientation.Portrait)
      let file = new File([pdfBlob], filename, { type: "application/pdf" })
      let uploadedFile = new UploadedFile()
      uploadedFile.name = filename
      await uploadedFile.uploadFile(file, useFileStore())

      let form = new Form()
      let dayjs = useDayjs()
      form.companyId = this.companyId.value
      form.type = "business_detail"
      form.fileId = uploadedFile.id
      form.documentDate = dayjs().format("YYYY-MM-DD")
      form.status = "active"
      form.noOfPages = 1
      await form.create(useFormStore())

      let response = await fetch(uploadedFile.url)
      if (response.ok) {
        let blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = blobUrl
        link.setAttribute("download", filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      }

      let toastTitle = this.language.isMalay()
        ? "Dokumen telah dijana dan dimasukkan ke Dokumen Syarikat."
        : "The Document is generated and added to Company Documents."
      let toast = new Toast(toastTitle, "")
      toast.success()

      this.hide()
    } catch (e) {
      //
    } finally {
      this.isGenerating.value = false
    }
  }
}
