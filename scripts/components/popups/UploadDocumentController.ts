import { File as UploadedFile } from "~/scripts/models/File"
import { Form } from "~/scripts/models/Form"
import { Error } from "~/scripts/library/Error"
import { SelectOption } from "~/scripts/types/SelectOption"
import { BasePopupController } from "./BasePopupController"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import type { PropsUploadDocument } from "~/scripts/props/PropsUploadDocument"
import { PropsPopup } from "~/scripts/props/PropsPopup"

export class UploadDocumentController extends BasePopupController {
  companyId: Ref<string> = ref<string>("")

  fileInputRef: any | null = null

  files: Ref<File[]> = ref<File[]>([])
  uploadedFiles = ref<UploadedFile[]>([])
  forms = ref<Form[]>([])

  canUploadImage: Ref<boolean> = ref<boolean>(false)
  canUploadPdf: Ref<boolean> = ref<boolean>(false)

  isUploading: Ref<boolean> = ref<boolean>(false)

  maxSize: number = 2 * 1024 * 1024

  constructor(props: PropsUploadDocument, emitEvents: any) {
    super(emitEvents)

    this.companyId.value = props.companyId
    this.canUploadImage.value = props.canUploadImage
    this.canUploadPdf.value = props.canUploadPdf
  }

  setFileInputRef(fileInputRef: any): void {
    this.fileInputRef = fileInputRef
  }

  onPropsChange(props: PropsUploadDocument): void {
    this.companyId.value = props.companyId
    this.canUploadImage.value = props.canUploadImage
    this.canUploadPdf.value = props.canUploadPdf
  }

  onUploadClicked(): void {
    if (!this.fileInputRef) {
      return
    }

    this.fileInputRef.click()
  }

  handleFileSelected(event: Event): void {
    const eventFileInput = event.target as HTMLInputElement
    if (!eventFileInput.files || eventFileInput.files.length <= 0) {
      return
    }

    this.files.value = Array.from(eventFileInput.files)

    this.postFileSelection()
  }

  postFileSelection(): void {
    try {
      if (!this.areAllBelow2MB) {
        let error = new Error()
        error.setForFileTooBig()
        throw error
      }

      if (!this.areCorrectFileTypes) {
        let error = new Error()
        error.setForIncorrectFileTypeImageAndPdf()
        throw error
      }

      this.uploadedFiles.value = this.files.value.map((f: File) => {
        let uploadedFile = new UploadedFile()
        uploadedFile.name = f.name

        return uploadedFile
      })

      this.forms.value = this.files.value.map((f: File) => {
        let newForm = new Form()

        newForm.companyId = this.companyId.value
        return newForm
      })
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFailedUpload()
        error.handle()
      }
    }
  }

  async onProceedClicked(): Promise<void> {
    if (this.isUploading.value) {
      return
    }

    await this.uploadFiles()

    this.hide()
  }

  async uploadFiles(): Promise<void> {
    if (this.isUploading.value) {
      return
    }

    try {
      this.isUploading.value = true

      if (!this.areAllBelow2MB) {
        let error = new Error()
        error.setForFileTooBig()
        throw error
      }

      if (!this.areCorrectFileTypes) {
        let error = new Error()
        error.setForIncorrectFileTypeImageAndPdf()
        throw error
      }

      let promises: any[] = []
      this.uploadedFiles.value.forEach((d: UploadedFile, index: number) => {
        let file = this.files.value[index] ?? null

        if (!file) {
          return
        }

        promises.push(d.uploadFile(file, useFileStore()))
      })

      await Promise.all(promises)

      promises = []
      this.forms.value.forEach((f: Form, index: number) => {
        let uploadedFile = this.uploadedFiles.value[index] ?? null
        if (!uploadedFile) {
          return
        }

        f.fileId = uploadedFile.id

        promises.push(f.create(useFormStore()))
      })

      await Promise.all(promises)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFailedUpload()
        error.handle()
      }
    } finally {
      this.isUploading.value = false
    }
  }

  filenameFor(index: number): string {
    let file = this.files.value[index] ?? null

    if (!file) {
      return ""
    }

    return file.name
  }

  documentNameFor(index: number): string {
    let uploadedFile = this.uploadedFiles.value[index] ?? null
    if (!uploadedFile) {
      return ""
    }

    return uploadedFile.name
  }

  onDocumentNameInput(index: number, event: Event): void {
    let uploadedFile = this.uploadedFiles.value[index] ?? null
    if (!uploadedFile) {
      return
    }

    let target = event.target as HTMLInputElement
    uploadedFile.name = target.value
  }

  onRemove(index: number): void {
    this.forms.value.splice(index, 1)
    this.uploadedFiles.value.splice(index, 1)
    this.files.value.splice(index, 1)
  }

  get areAllBelow2MB(): boolean {
    return this.files.value.every((f: File) => {
      return f.size <= this.maxSize
    })
  }

  get areCorrectFileTypes(): boolean {
    return this.files.value.every((f: File) => {
      const type = f.type

      if (this.canUploadImage && type.startsWith("image/")) {
        return true
      }

      if (this.canUploadPdf && type === "application/pdf") {
        return true
      }

      return false
    })
  }

  get documentTypes(): SelectOption[] {
    return [
      new SelectOption("statutory", "statutory", this.language.isMalay() ? "Dokumen Berkanun" : "Statutory Document"),
      new SelectOption("resolution", "resolution", this.language.isMalay() ? "Resolusi" : "Resolutions"),
      new SelectOption("loans", "loans", this.language.isMalay() ? "Pinjaman" : "Loans"),
      new SelectOption("others", "others", this.language.isMalay() ? "Others" : "Others"),
    ]
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    if (this.language.isMalay()) {
      return `Muat Naik Dokumen`
    }

    return `Upload Documents`
  }

  get instructions(): string {
    return this.language.isMalay()
      ? "Letakkan fail anda di sini atau klik untuk layar."
      : "Drop your files here or click to browse."
  }

  get cta(): string {
    if (this.language.isMalay()) {
      return `
        Ingin teruskan?
      `
    }

    return `
      Would you like to continue?
    `
  }

  get fileToAccept(): string {
    let filesType: string[] = []

    if (this.canUploadImage.value) {
      filesType.push("image/*")
    }

    if (this.canUploadPdf.value) {
      filesType.push(".pdf")
    }

    return filesType.join(", ")
  }

  get anyFileAdded(): boolean {
    return this.files.value.length > 0
  }

  get uploadedFilenameLabel(): string {
    return this.language.isMalay() ? "Nama Fail Asal" : "Original Filename"
  }

  override get popupProps(): PropsPopup {
    let props = new PropsPopup(
      this.title,
      this.heading,
      this.cta,
      this.isCompliance.value,
      this.hasCta.value,
      this.hasActionButtons.value
    )

    props.cssClass = "upload-document"

    return props
  }
}
