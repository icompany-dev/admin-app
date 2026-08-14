import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { CompanyConstants } from "~/scripts/constants/Company"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"
import { PropsLetterChangeReassignCosec } from "~/scripts/props/PropsLetterChangeReassignCosec"
import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"

export class LetterToExistingCosecController {
  applicationSwitchId: Ref<string> = ref<string>("")
  application: Ref<ApplicationSwitch> = ref<ApplicationSwitch>(new ApplicationSwitch())

  directorName: Ref<string> = ref<string>("")

  language = useLanguage()
  repository = useApplicationNameReservationStore()

  target: string = CompanyConstants.TARGET_APPLICATION_SWITCH_LETTER

  isLoading: Ref<boolean> = ref<boolean>(false)
  isUpdating: Ref<boolean> = ref<boolean>(false)
  isUpdated: Ref<boolean> = ref<boolean>(false)

  documentRef: any | null = null

  emitEvents: any | null = null

  constructor(applicationIncorporationId: string, emitEvents: any) {
    this.applicationSwitchId.value = applicationIncorporationId
    this.emitEvents = emitEvents

    this.init()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async init(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      await this.fetchApplication()
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

  async setApplicationSwitchId(applicationIncorporationId: string): Promise<void> {
    this.applicationSwitchId.value = applicationIncorporationId
    await this.fetchApplication()
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationSwitchId.value)) {
      return
    }

    try {
      this.isLoading.value = true

      let repository = useApplicationSwitchStore()
      let response = await repository.fetch(this.applicationSwitchId.value)

      this.application.value = new ApplicationSwitch(response)

      if (this.application.value.signatureGroups.length > 0) {
        const firstSignatureGroup = this.application.value.signatureGroups[0]
        const email = firstSignatureGroup.email
        const userRepository = useUserStore()
        const userWhoSigned = await userRepository.fetchByEmail(email)
        if (userWhoSigned) {
          this.directorName.value = userWhoSigned.name
          return
        }
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

    await PdfPaperUtil.generatePdfFile(
      pages,
      20,
      "Letter of Reassignment of Company Secretary.pdf",
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

  get signatureUrl(): string {
    if (this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    return this.application.value.signatureGroups[0].signature?.url || ""
  }

  get signatureDate(): string {
    if (this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    let time = useLocalTime()

    return time.formatDateOnlyFull(this.application.value.signatureGroups[0].createdAt ?? "") || ""
  }

  get letterChangeReassignCosecProps(): PropsLetterChangeReassignCosec {
    return new PropsLetterChangeReassignCosec(
      this.application.value.name ?? "", //companyName
      this.application.value.registrationNumberNew, //registrationNumberNew
      this.application.value.registrationNumberOld, //registrationNumberOld
      this.application.value.secretaryCompanyName, //cosecCompanyName
      this.application.value.cosecAddressLine1(), //cosecAddressLine1
      this.application.value.cosecAddressLine2(), //cosecAddressLine2
      this.application.value.cosecAddressPostcode(), //cosecAddressPostCode
      this.application.value.cosecAddressCity(), //cosecAddressCity
      this.application.value.cosecAddressState(), //cosecAddressState
      this.application.value.secretaryName, //cosecName
      this.application.value.secretaryEmail, //cosecEmail
      this.application.value.secretaryPhone, //cosecPhone
      this.directorName.value, //directorName
      false, //isDocumentEditable
      true, //isReadonly
      this.signatureUrl, //signatureUrl
      this.signatureDate, //documentDate
      true, //areValuesValid
      "", //validationMessage
      !StringUtil.isNullOrEmpty(this.signatureUrl), //hasSigned
      false, //isSignatureEditable
      false, //isSignatureHidden
      false, //isInPreviewMode
      false, //showWatermark
      "" //watermarkText
    )
  }
}
