import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { CompanyConstants } from "~/scripts/constants/Company"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"

export class Section236ThreeController {
  companyName: Ref<string> = ref<string>("")
  registrationNumberNew: Ref<string> = ref<string>("")
  registrationNumberOld: Ref<string> = ref<string>("")

  language = useLanguage()
  repository = useApplicationNameReservationStore()

  target: string = CompanyConstants.TARGET_APPLICATION_INCORPORATE_SECTION27

  isLoading: Ref<boolean> = ref<boolean>(false)
  isUpdating: Ref<boolean> = ref<boolean>(false)
  isUpdated: Ref<boolean> = ref<boolean>(false)

  documentRef: any | null = null

  emitEvents: any | null = null

  constructor(companyName: string, registrationNumberNew: string, registrationNumberOld: string, emitEvents: any) {
    this.companyName.value = companyName
    this.registrationNumberNew.value = registrationNumberNew
    this.registrationNumberOld.value = registrationNumberOld

    this.emitEvents = emitEvents
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }
  setCompanyName(companyName: string): void {
    this.companyName.value = companyName
  }
  setRegistrationNumberNew(registrationNumberNew: string): void {
    this.registrationNumberNew.value = registrationNumberNew
  }
  setRegistrationNumberOld(registrationNumberOld: string): void {
    this.registrationNumberOld.value = registrationNumberOld
  }

  async onDownloadClicked(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    let pages: HTMLElement[] = await this.documentRef.getPdfPages()

    if (pages.length <= 0) {
      return
    }

    await PdfPaperUtil.generatePdfFile(
      pages,
      20,
      `${this.companyName.value} Section 236(2).pdf`,
      PaperSize.A4,
      PaperOrientation.Portrait
    )
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
