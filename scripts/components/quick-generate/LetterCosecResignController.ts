import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { File as UploadedFile } from "~/scripts/models/File"
import { Form } from "~/scripts/models/Form"
import { Toast } from "~/scripts/library/Toast"
import { Director } from "~/scripts/models/Director"

export class LetterCosecResignController {
  emitEvents: any | null = null

  documentRef: any | null = null

  language = useLanguage()

  companyId: Ref<string> = ref<string>("")

  isShowing: Ref<boolean> = ref<boolean>(false)
  isGenerating: Ref<boolean> = ref<boolean>(false)

  isFetchingDirectors: Ref<boolean> = ref<boolean>(false)
  selectedDirectorId: Ref<string> = ref<string>("")
  directors: Ref<Director[]> = ref<Director[]>([])

  constructor(companyId: string, emitEvents: any) {
    this.emitEvents = emitEvents
    this.companyId.value = companyId
    this.fetchDirectors()
  }

  setCompanyId(companyId: string): void {
    this.companyId.value = companyId

    this.fetchDirectors()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  show(): void {
    this.isShowing.value = true
  }

  async fetchDirectors(): Promise<void> {
    this.isFetchingDirectors.value = true

    this.directors.value = []

    try {
      let repository = useDirectorStore()
      let response = await repository.fetchAllForCompany(this.companyId.value)

      this.directors.value = response.map((d: any) => {
        return new Director(d)
      })
    } catch (e) {
      //
    } finally {
      this.isFetchingDirectors.value = false
    }
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
      let promises = []
      promises.push(
        this.documentRef.getPdfPages().then(async (pages: HTMLElement[]) => {
          let filename = `Letter of Resignation as Company Secretary.pdf`
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
        })
      )

      promises.push(
        this.documentRef.getDcrPages().then(async (pages: HTMLElement[]) => {
          let filename = `DCR - Resignation of Company Secretary.pdf`
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
        })
      )

      await Promise.allSettled(promises)

      let toastTitle = this.language.isMalay()
        ? "Dokumen telah dijana dan dimasukkan ke Dokumen Syarikat."
        : "The Documents are generated and added to Company Documents."
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
