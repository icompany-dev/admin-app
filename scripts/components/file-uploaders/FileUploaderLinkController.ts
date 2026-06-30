import { File } from "~/scripts/models/File"
import { useFileStore } from "#imports"
import { useLanguage } from "~/composables/useLanguage"
import { StringUtil } from "~/scripts/utils/String"
import { ref, type Ref } from "vue"
import { Error } from "~/scripts/library/Error"

export class FileUploaderLinkController {
  file = ref<File>(new File())
  fileInput: Ref<any> | null = null
  fileRepository = useFileStore()
  placeholderString = ref<string>("Upload Document")

  language = useLanguage()

  emitEvents: any | null = null

  constructor(placeholderString: string | null = null, emitEvents: any | null, file: File | null = null) {
    this.emitEvents = emitEvents
    this.file.value = new File()
    if (!StringUtil.isNullOrEmpty(placeholderString)) {
      this.placeholderString.value = placeholderString ?? ""
    }

    if (file !== null) {
      this.setFile(file)
    }
  }

  setFile(file: File): void {
    this.file.value = new File(file)
  }

  setFileInput(fileInput: any): void {
    this.fileInput = fileInput
  }

  onSelectFileClicked(): void {
    if (this.fileInput && this.fileInput.value) {
      this.fileInput.value.click()
    }
  }

  async handleDocumentUpload(event: Event): Promise<void> {
    const eventFileInput = event.target as HTMLInputElement
    if (!eventFileInput.files || eventFileInput.files.length <= 0) {
      return
    }

    const fileToUpload: globalThis.File = eventFileInput.files[0]

    // Check size
    const maxSize = 2 * 1024 * 1024 // Max 2MB
    if (fileToUpload.size > maxSize) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForFileTooBig()
      errorMessage.handle()
      return
    }

    // File type
    const type = fileToUpload.type
    if (!type.startsWith("image/") && type !== "application/pdf") {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForIncorrectFileTypeImageAndPdf()
      errorMessage.handle()
      return
    }

    await this.file.value.uploadFile(fileToUpload, this.fileRepository)
    this.emitEvents("fileUploaded", this.file.value.id)
  }

  onRemoveFileClicked(): void {
    this.file.value = new File()
    this.emitEvents("fileRemoved")
  }

  buttonCopywriting(): string {
    if (this.fileRepository.isLoading) {
      return "Uploading file ..."
    }

    if (!StringUtil.isNullOrEmpty(this.file.value.id)) {
      return this.file.value.name.length > 20 ? this.file.value.name.substring(0, 20) : this.file.value.name
    }

    return this.placeholderString.value
  }

  buttonIcon(): string {
    if (this.fileRepository.isLoading) {
      return "fa-spinner fa-spin"
    }

    if (!StringUtil.isNullOrEmpty(this.file.value.id)) {
      if (this.file.value.type === "image") {
        return "fa-image"
      } else {
        return "fa-file-pdf"
      }
    }

    return "fa-upload"
  }

  isFileUploaded(): boolean {
    return !StringUtil.isNullOrEmpty(this.file.value.id)
  }
}
