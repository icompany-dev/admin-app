import { CompanySwitchOut } from "~/scripts/models/CompanySwitchOut"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanySwitchOutStore } from "~/stores/CompanySwitchOuts"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"

export class LetterOfCosecResignController
  extends ServiceController
  implements IServiceController<CompanySwitchOut, ReturnType<typeof useCompanySwitchOutStore>>
{
  application = ref<CompanySwitchOut>(new CompanySwitchOut())
  applicationId: string | null = null
  repository = useCompanySwitchOutStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  letterRef: any | null = null

  constructor(
    companyId: string,
    isInPreviewMode: boolean,
    emitEvents: any | null,
    applicationId: string | null = null
  ) {
    super(CompanyConstants.TARGET_COSEC_RESIGNATION, companyId, emitEvents)

    this.isInPreviewMode.value = isInPreviewMode

    // if (!StringUtil.isNullOrEmpty(applicationId)) {
    //   this.applicationId = applicationId
    //   this.fetchApplication(applicationId ?? "")
    // }
  }

  setLetterRef(letterRef: any): void {
    this.letterRef = letterRef
  }

  async fetchApplication(id: string): Promise<void> {
    // let response = await this.repository.fetch(id)
    // if (!this.repository.error) {
    //   this.application.value = new CompanySwitchOut(response)
    //   this.applicationId = id
    //   this.targetId = id
    // }
  }

  async setApplication(companyId: string): Promise<void> {
    this.application.value = new CompanySwitchOut()
    this.application.value.companyId = companyId

    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  async onSubmitClicked(): Promise<void> {
    if (this.isADirector.value) {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application.value = new CompanySwitchOut(updatedData)
        this.application.value.id = this.applicationId ?? ""
      }
    }

    try {
      this.emitEvents("back", this.application.value)

      await this.onUpdate()

      if (this.isADirector.value || this.isAShareholder.value) {
        await this.submitSignature()
      }

      this.emitEvents("applicationUpdated", this.application.value)
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async onCreate(): Promise<void> {
    await this.application.value.create(this.repository)
    this.applicationId = this.application.value.id
    this.targetId = this.application.value.id
  }

  async onUpdate(): Promise<void> {
    await this.application.value.update(this.repository)
  }

  async onRemove(): Promise<void> {
    if (this.applicationId === null) {
      this.emitEvents("back")
    }
    // TODO: update function
    // Must ask for confirmation before it proceeds to delete
    // await this.application.value.remove(this.repository)
    this.emitEvents("back")
  }

  override async onDownloadClicked(): Promise<void> {
    if (this.isDownloading.value) {
      return
    }

    this.isDownloading.value = true
    this.setActionTrayElements()
    try {
      let promises = []

      if (this.dcrRef) {
        let dcrPages = await this.dcrRef.getPdfPages()
        promises.push(
          PdfPaperUtil.generatePdfFile(
            dcrPages,
            19,
            "DCR - Resignation of Company Secretary.pdf",
            PaperSize.A4,
            PaperOrientation.Portrait
          )
        )
      }

      if (this.letterRef) {
        let letterPages = await this.letterRef.getPdfPages()
        promises.push(
          PdfPaperUtil.generatePdfFile(
            letterPages,
            19,
            "Letter Resignation of Company Secretary.pdf",
            PaperSize.A4,
            PaperOrientation.Portrait
          )
        )
      }

      if (this.mcrRef) {
        let dcrPages = await this.mcrRef.getPdfPages()
        promises.push(
          PdfPaperUtil.generatePdfFile(
            dcrPages,
            19,
            "Letter to Transfer and Handover of Secretarial Documents.pdf",
            PaperSize.A4,
            PaperOrientation.Portrait
          )
        )
      }

      if (promises.length <= 0) {
        return
      }

      await Promise.allSettled(promises)
    } catch (e) {
      console.error(e)
    } finally {
      this.isDownloading.value = false
      this.setActionTrayElements()
    }
  }

  get isShowWatermark(): boolean {
    if (
      this.application.value.status === StatusConstants.DRAFT ||
      this.application.value.status === StatusConstants.PENDING
    ) {
      return true
    }

    return this.application.value.signatureGroups.length <= 0
  }

  get watermarkText(): string {
    if (!this.isShowWatermark) {
      return ""
    }

    if (
      this.application.value.status === StatusConstants.DRAFT ||
      this.application.value.status === StatusConstants.PENDING
    ) {
      return "PREVIEW"
    }

    if (this.application.value.status === StatusConstants.READY) {
      return "READY FOR DELIVERY"
    }

    return "DRAFT"
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanySwitchOut>(
      this.companyId,
      this.applicationId,
      this.application.value as CompanySwitchOut,
      this.isShowWatermark,
      this.watermarkText,
      this.isInPreviewMode.value,
      false
    )
  }
}
