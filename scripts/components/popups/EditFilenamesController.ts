import type { PropsEditFilenames } from "~/scripts/props/PropsEditFilenames"
import { BasePopupController } from "./BasePopupController"
import { File } from "~/scripts/models/File"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { Toast } from "~/scripts/library/Toast"

export class EditFilenamesController extends BasePopupController {
  files: Ref<File[]> = ref<File[]>([])
  originalFiles: Ref<File[]> = ref<File[]>([])

  isUpdating: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsEditFilenames, emitEvents: any | null) {
    super(emitEvents)

    this.isCompliance.value = false

    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsEditFilenames): void {
    this.files.value = props.files.map((f: File) => {
      return new File(f)
    })

    this.originalFiles.value = props.files.map((f: File) => {
      return new File(f)
    })
  }

  onProceedClicked(): void {
    //
  }

  getOriginalFileName(fileId: string): string {
    let file =
      this.originalFiles.value.find((f: File) => {
        return f.id === fileId
      }) ?? null

    return file?.name ?? "(Unknown Name)"
  }

  async onUpdate(): Promise<void> {
    if (!this.canProceed) {
      let error = new Error()
      error.type = Error.ERROR_TYPE_DATA
      error.title = this.language.isMalay()
        ? "Sila semak semula kerja anda. Ada nama dokumen yang kosong."
        : "Please check your changes again. You missed out on some document names."
      error.message = this.language.isMalay()
        ? "Nama dokumen tidak boleh dibiar kosong."
        : "Document names cannot be empty."
      error.handle()
      return
    }

    if (this.isUpdating.value) {
      return
    }

    try {
      this.isUpdating.value = true

      let repository = useFileStore()
      let promises = this.files.value
        .filter((f: File) => {
          return !StringUtil.isNullOrEmpty(f.id) && !StringUtil.isNullOrEmpty(f.name)
        })
        .map((f: File) => {
          return f.update(repository)
        })

      await Promise.allSettled(promises)

      let toastTitle = this.language.isMalay()
        ? "Nama Dokumen telah dikemaskini."
        : "The Document Names have been updated."
      let toastMessage = this.language.isMalay()
        ? "Sila tunggu sementara kami paut semula dokumen."
        : "Please wait while we retrieve the documents again."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      this.hide()
      this.emitEvents(EmitMessages.PROCEED)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdating.value = false
    }
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Kemaskini Nama Dokumen` : `Update Document Name`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    // if (this.language.isMalay()) {s
    //   return `
    //    Sila jangan muat semula muka ini. Kami sedang ${this.actionName.value}.
    //   `
    // }

    return `
    `
  }

  get oldName(): string {
    return this.language.isMalay() ? "Nama Dokumen" : "Document Name"
  }

  get newName(): string {
    return this.language.isMalay() ? "Nama Baharu" : "New Name"
  }

  get canProceed(): boolean {
    return this.files.value.every((f: File) => {
      return !StringUtil.isNullOrEmpty(f.name)
    })
  }
}
