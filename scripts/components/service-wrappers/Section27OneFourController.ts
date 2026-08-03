import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { CompanyConstants } from "~/scripts/constants/Company"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"

export class Section27OneFourController {
  applicationIncorporationId: Ref<string> = ref<string>("")
  applicationNameReservationId: Ref<string> = ref<string>("")
  applicationNameReservation: Ref<ApplicationNameReservation> = ref<ApplicationNameReservation>(
    new ApplicationNameReservation()
  )

  language = useLanguage()
  repository = useApplicationNameReservationStore()

  target: string = CompanyConstants.TARGET_APPLICATION_INCORPORATE_SECTION27

  isLoading: Ref<boolean> = ref<boolean>(false)
  isUpdating: Ref<boolean> = ref<boolean>(false)
  isUpdated: Ref<boolean> = ref<boolean>(false)

  documentRef: any | null = null

  emitEvents: any | null = null

  constructor(applicationIncorporationId: string, applicationNameReservationId: string, emitEvents: any) {
    this.applicationIncorporationId.value = applicationIncorporationId
    this.applicationNameReservationId.value = applicationNameReservationId
    this.emitEvents = emitEvents
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async init(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      if (StringUtil.isNullOrEmpty(this.applicationNameReservationId.value)) {
        this.applicationNameReservation.value = new ApplicationNameReservation()
      } else {
        await this.fetchApplication()
      }
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async setApplicationNameReservationId(applicationNameReservationId: string): Promise<void> {
    this.applicationNameReservationId.value = applicationNameReservationId

    await this.fetchApplication()
  }

  async setApplicationIncorporationId(applicationIncorporationId: string): Promise<void> {
    this.applicationIncorporationId.value = applicationIncorporationId
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationNameReservationId.value)) {
      this.applicationNameReservation.value = new ApplicationNameReservation()
      return
    }

    let response = await this.repository.fetch(this.applicationNameReservationId.value)
    if (this.repository.error !== null) {
      throw this.repository.error
    }

    this.applicationNameReservation.value = new ApplicationNameReservation(response)
  }

  async onApplicationUpdated(): Promise<void> {
    await this.fetchApplication()
  }

  async onDownloadClicked(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    let pages: HTMLElement[] = await this.documentRef.getPdfPages()

    if (pages.length <= 0) {
      return
    }

    await PdfPaperUtil.generatePdfFile(pages, 20, "Section 27(1)(4).pdf", PaperSize.A4, PaperOrientation.Portrait)
  }

  onBackClicked(): void {
    this.emitEvents("back")
  }

  get actionTrayElements(): ActionTrayElement[] {
    return [
      new ActionTrayElement("back", this.onBackClicked.bind(this), {
        label: new ActionTrayLabel("Back", "Kembali"),
        isIconStart: true,
        iconClass: "fa-solid fa-circle-arrow-left",
      }),
      new ActionTrayElement("download", this.onDownloadClicked.bind(this), {
        label: new ActionTrayLabel("Download", "Muat Turun"),
      }),
    ]
  }
}
