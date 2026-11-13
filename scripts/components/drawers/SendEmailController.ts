import { AdminEmail, EmailAttachment } from "~/scripts/models/AdminEmail"
import { BaseDrawerController } from "./BaseDrawerController"
import type { PropsSendEmail } from "~/scripts/props/PropsSendEmail"
import { StringUtil } from "~/scripts/utils/String"
import { DragAndDropFile } from "~/scripts/library/DragAndDropFile"
import { File as UploadedFile } from "~/scripts/models/File"
import { Error } from "~/scripts/library/Error"
import { Toast } from "~/scripts/library/Toast"

export class SendEmailController extends BaseDrawerController {
  adminEmail: Ref<AdminEmail> = ref<AdminEmail>(new AdminEmail())

  recipientEmail: Ref<string> = ref<string>("")

  fileInputRef: any | null = null
  dropZoneRef: any | null = null

  dragAndDropFile = ref<DragAndDropFile>(new DragAndDropFile(null))

  files: Ref<File[]> = ref<File[]>([])
  uploadedFiles = ref<UploadedFile[]>([])

  isUploading: Ref<boolean> = ref<boolean>(false)
  isDragEnter: Ref<boolean> = ref<boolean>(false)

  isSendingEmail: Ref<boolean> = ref<boolean>(false)

  maxSize: number = 10 * 1024 * 1024

  constructor(props: PropsSendEmail, emitEvents: any) {
    super(emitEvents)

    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsSendEmail): void {
    this.adminEmail.value = new AdminEmail()
    this.adminEmail.value.recipients = props.recipients
    this.adminEmail.value.subject = props.subject
    this.adminEmail.value.content = props.content
    this.adminEmail.value.fileAttachments = props.fileAttachments.map((d: any) => {
      return new EmailAttachment(d)
    })
  }

  setFileInputRef(fileInputRef: any): void {
    this.fileInputRef = fileInputRef
  }

  setDropZoneRef(dropZoneRef: any): void {
    this.dropZoneRef = dropZoneRef

    if (this.dropZoneRef) {
      this.dragAndDropFile.value.dropTarget = this.dropZoneRef as HTMLElement

      this.removeEventListeners()
      this.addEventListeners()
    }
  }

  resetValues(): void {
    this.adminEmail.value = new AdminEmail()
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

    this.files.value = this.files.value.concat(Array.from(eventFileInput.files))

    this.postFileSelection()
  }

  addEventListeners(): void {
    if (!this.dropZoneRef) {
      return
    }

    this.dropZoneRef = this.dropZoneRef as HTMLElement

    this.dropZoneRef.addEventListener("dragenter", this.handleDragEnter.bind(this), false)
    this.dropZoneRef.addEventListener("dragover", this.handleDragEnter.bind(this), false)
    this.dropZoneRef.addEventListener("dragleave", this.handleDragLeave.bind(this), false)
    this.dropZoneRef.addEventListener("drop", this.handleDrop.bind(this), false)
  }

  removeEventListeners(): void {
    if (!this.dropZoneRef) {
      return
    }

    this.dropZoneRef = this.dropZoneRef as HTMLElement

    this.dropZoneRef.removeEventListener("dragenter", this.handleDragEnter.bind(this), false)
    this.dropZoneRef.removeEventListener("dragover", this.handleDragEnter.bind(this), false)
    this.dropZoneRef.removeEventListener("dragleave", this.handleDragLeave.bind(this), false)
    this.dropZoneRef.removeEventListener("drop", this.handleDrop.bind(this), false)
  }

  preventDefaults(e: Event): void {
    this.dragAndDropFile.value.preventDefaults(e)
  }

  handleDragEnter(e: DragEvent): void {
    this.dragAndDropFile.value.handleDragEnter(e)
    this.isDragEnter.value = true
  }

  handleDragLeave(e: DragEvent): void {
    this.dragAndDropFile.value.handleDragLeave(e)
    this.isDragEnter.value = false
  }

  async handleDrop(e: DragEvent): Promise<void> {
    this.dragAndDropFile.value.handleDrop(e)

    if (!this.dragAndDropFile.value.files) {
      this.isDragEnter.value = false
      return
    }

    this.files.value = this.files.value.concat(Array.from(this.dragAndDropFile.value.files))

    this.postFileSelection()
    this.isDragEnter.value = false
  }

  postFileSelection(): void {
    try {
      if (!this.areAllBelow2MB) {
        let error = new Error()
        error.setForFileTooBig()
        throw error
      }

      this.uploadedFiles.value = this.files.value.map((f: File) => {
        let uploadedFile = new UploadedFile()
        uploadedFile.name = f.name

        return uploadedFile
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

  removeAttachment(index: number): void {
    this.files.value.splice(index, 1)
  }

  // recipients
  onRecipientCommaKey(event: KeyboardEvent): void {
    if (event.key !== ",") {
      return
    }

    let recipientEmail = this.recipientEmail.value.replace(",", "").trim()
    this.adminEmail.value.recipients.push(recipientEmail)
    setTimeout(() => {
      this.recipientEmail.value = ""
    }, 200)
  }

  onRecipientEmailChanged(): void {
    if (StringUtil.isNullOrEmpty(this.recipientEmail.value)) {
      return
    }

    let emails = this.recipientEmail.value
      .split(",")
      .map((e: string) => {
        return e.trim()
      })
      .filter((e: string) => {
        return !this.adminEmail.value.recipients.includes(e)
      })

    if (emails.length > 0) {
      this.adminEmail.value.recipients = this.adminEmail.value.recipients.concat(emails)
    }

    this.recipientEmail.value = ""
  }

  onRemoveRecipientEmail(index: number): void {
    this.adminEmail.value.recipients.splice(index, 1)
  }

  // attachments
  async prepareAttachments(): Promise<void> {
    if (this.uploadedFiles.value.length <= 0) {
      return
    }

    let fileAttachments: EmailAttachment[] = []
    let promises = this.files.value.map((f: File) => {
      let uploadedFile = new UploadedFile()
      uploadedFile.name = f.name

      return uploadedFile.uploadFile(f, useFileStore()).then((r) => {
        let fileAttachment = new EmailAttachment()
        fileAttachment.url = uploadedFile.url
        fileAttachment.fileName = f.name
        fileAttachment.mimeType = uploadedFile.mimeType
        fileAttachments.push(fileAttachment)
      })
    })

    await Promise.allSettled(promises)

    this.adminEmail.value.fileAttachments = fileAttachments.map((d: any) => {
      return new EmailAttachment(d)
    })
  }

  async onProceedClicked(): Promise<void> {
    if (this.isSendingEmail.value || !this.canProceed) {
      return
    }

    try {
      this.isSendingEmail.value = true

      if (this.files.value.length > 0) {
        await this.prepareAttachments()
      }

      if (!this.canProceed) {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.title = this.language.isMalay()
          ? "Tidak berjaya memuat naik attachments."
          : "Failed to upload the attachments."
        error.message = this.language.isMalay()
          ? "Sila pastikan fail tidak melebihi 2MB."
          : "Please ensure that the files are less than 2MB."
        error.type = Error.ERROR_TYPE_API
        throw error
      }

      await this.adminEmail.value.sendEmail(useAdminEmailStore())

      let recipientsNoun = this.adminEmail.value.recipients.length > 1 ? "recipients" : "recipient"
      let toastTitle = this.language.isMalay()
        ? "Emel telah dihantar ke penerima."
        : `Email is sent to the ${recipientsNoun}.`
      let toast = new Toast(toastTitle, "")
      toast.success()

      this.hide()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isSendingEmail.value = false
    }
  }

  get drawerTitle(): string {
    return this.language.isMalay() ? "Hantar Emel" : "Send Email"
  }

  get canProceed(): boolean {
    return this.adminEmail.value.canSubmit()
  }

  get areAllBelow2MB(): boolean {
    return this.files.value.every((f: File) => {
      return f.size <= this.maxSize
    })
  }

  get anyFileAdded(): boolean {
    return this.files.value.length > 0
  }

  get instructions(): string {
    return this.language.isMalay()
      ? "Letakkan fail anda di sini atau klik untuk layar."
      : "Drop your files here or click to browse."
  }
}
