import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyShareholderAllotmentStore } from "~/stores/CompanyShareholderAllotments"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"
import { AllotShares } from "~/scripts/library/AllotShares"
import { CompanyShareAuthorization } from "~/scripts/models/CompanyShareAuthorization"
import { SignatureGroup, SignatureGroupGroup, SignatureGroupTarget } from "~/scripts/models/SignatureGroup"
import { ActivityLogger } from "~/scripts/library/ActivityLogger"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"

export class AllotmentOfSharesController
  extends ServiceController
  implements IServiceController<CompanyShareholderAllotment, ReturnType<typeof useCompanyShareholderAllotmentStore>>
{
  application = ref<CompanyShareholderAllotment>(new CompanyShareholderAllotment())
  applicationId: string | null = null
  repository = useCompanyShareholderAllotmentStore()
  companyRepository = useCompanyStore()

  allotShares = ref<AllotShares>(new AllotShares("", ""))

  showMcrFirst = ref<boolean>(false)

  isLoading: Ref<boolean> = ref<boolean>(false)

  noticeRef: any | null = null
  allotRef: any | null = null

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES, companyId, emitEvents)

    this.allotShares.value.companyId = this.companyId

    this.init()
  }

  async init(): Promise<void> {
    this.isLoading.value = true
    await this.allotShares.value.init()

    if (!StringUtil.isNullOrEmpty(this.allotShares.value.existingApplication.id)) {
      this.isInPreviewMode.value = false
      this.application.value = new CompanyShareholderAllotment(this.allotShares.value.existingApplication)
      this.applicationId = this.allotShares.value.existingApplication.id
      this.targetId = this.allotShares.value.existingApplication.id
    } else {
      this.isInPreviewMode.value = true
      this.application.value = new CompanyShareholderAllotment()
      this.applicationId = ""
      this.targetId = ""
    }
    this.isLoading.value = false
  }

  setNoticeRef(noticeRef: any): void {
    this.noticeRef = noticeRef
  }

  setAllotRef(allotRef: any): void {
    this.allotRef = allotRef
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  onDcrChanged(): void {
    if (!this.dcrRef || !this.mcrRef) {
      return
    }

    let updatedData = this.dcrRef.getApplicationData()
    this.mcrRef.updateApplicationContent(updatedData)
  }

  async onSignedMcr(signatureData: string): Promise<void> {
    this.signatureFile.value = signatureData

    await this.onSubmitMcrClicked()
  }

  async onSubmitClicked(): Promise<void> {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication()
      this.application.value = new CompanyShareholderAllotment(updatedData)
      this.application.value.id = this.applicationId ?? ""
    }

    try {
      this.emitEvents("back", this.application)

      await this.onUpdate()

      if (this.isADirector.value || this.isAShareholder.value) {
        await this.submitSignature()
      }

      this.emitEvents("applicationUpdated", this.application)
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

  async onSubmitMcrClicked(): Promise<void> {
    try {
      this.emitEvents("back", this.application)

      if (this.mcrRef) {
        let updatedData = this.mcrRef.getApplication()
        let companyShareAuthorization = new CompanyShareAuthorization(updatedData)
        if (StringUtil.isNullOrEmpty(companyShareAuthorization.id)) {
          await companyShareAuthorization.create(useCompanyShareAuthorizationStore())
        } else {
          await companyShareAuthorization.update(useCompanyShareAuthorizationStore())
        }
        await this.allotShares.value.fetchExistingAuthorization()
      }

      if (this.isAShareholder.value) {
        await Promise.all([this.submitSignature(), this.submitMcrSignature()])
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

  async submitMcrSignature(): Promise<void> {
    if (!this.signatureFile.value) {
      return
    }

    if (!this.isAShareholder) {
      return
    }

    let activityLogger = new ActivityLogger()
    await activityLogger.init()
    let signaturePromises = []
    let role =
      this.isADirector && this.isAShareholder ? "Director & Shareholder" : this.isADirector ? "Director" : "Shareholder"

    let signatureDate = this.time.currentDataTimeForSignature()
    if (this.isAShareholder.value && this.mcrRef) {
      if (!this.existingSignatureAsShareholder.value) {
        let newSignatureGroup = new SignatureGroup()
        newSignatureGroup.target = new SignatureGroupTarget(
          this.allotShares.value.existingShareAuthorization.id ?? "",
          CompanyConstants.TARGET_SHAREHOLDER_SHARE_AUTHORIZATION
        )
        newSignatureGroup.group = new SignatureGroupGroup(this.shareholderId.value ?? "", "shareholder")
        signaturePromises.push(
          newSignatureGroup.update(
            this.signatureFile.value ?? "",
            this.fileRepository,
            this.signatureRepository,
            signatureDate
          )
        )
      }
    }

    await Promise.all(signaturePromises)
      .then(() => {
        activityLogger.addSignLog(this.companyId, role, this.target, this.targetId ?? "", "success")
      })
      .catch(() => {
        activityLogger.addSignLog(this.companyId, role, this.target, this.targetId ?? "", "failed")
      })
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
    // await this.application.remove(this.repository)
    this.emitEvents("back")
  }

  helpTitle(): string {
    return this.language.isMalay()
      ? `Resolusi Pengarah & Pemegang Saham untuk Memperuntuk Saham Baharu`
      : "DCR & MCR to Allot New Shares"
  }

  helpDescription(): string {
    //Get more details for help
    return this.language.isMalay()
      ? `Resolusi ini memerlukan:
        <ul>
          <li>Sekurang-kurangnya satu (1) <b>Cadangan Nama</b>. Ketersediaan nama adalah tertakluk kepada SSM.</li>
          <li><b>Resolusi Khas</b> mesti mencapai majoriti sekurang-kurangnya <b>75%</b> daripada Pemegang Saham.</li>
        </ul>
        Anda boleh Beli & Muat Turun Profil Korporat SSM sebagai pengesahan perubahan (pilihan).
        `
      : `This resolution requires:
          <ul>
            <li>At least one (1) <b>Proposed Name</b>. The availability of name is subjected to SSM.</li>
            <li>The <b>Special Resolution</b> must reach a majority of at least <b>75%</b> of the Shareholders.</li>
          </ul>
          You can Purchase & Download SSM Corporate Profile as confirmation of the change (optional).
        `
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
            20,
            "Directors' Resolution - Propose Allotment of Shares.pdf",
            PaperSize.A4,
            PaperOrientation.Portrait
          )
        )
      }

      if (this.mcrRef) {
        let mcrPages = await this.mcrRef.getPdfPages()
        promises.push(
          PdfPaperUtil.generatePdfFile(
            mcrPages,
            20,
            "Members' Resolution - Authority to Allot Shares.pdf",
            PaperSize.A4,
            PaperOrientation.Portrait
          )
        )
      }

      if (this.noticeRef) {
        let noticePages = await this.noticeRef.getPdfPages()
        promises.push(
          PdfPaperUtil.generatePdfFile(
            noticePages,
            20,
            "Section 85 - Preemptive Rights Notices.pdf",
            PaperSize.A4,
            PaperOrientation.Portrait
          )
        )
      }

      if (this.allotRef) {
        let allotPages = await this.allotRef.getPdfPages()
        promises.push(
          PdfPaperUtil.generatePdfFile(
            allotPages,
            20,
            "Directors' Resolution - Allotment of Shares.pdf",
            PaperSize.A4,
            PaperOrientation.Portrait
          )
        )
      }

      if (promises.length <= 0) {
        return
      }

      await Promise.all(promises)
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
      return "READY TO SHIP"
    }

    return "DRAFT"
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyShareholderAllotment>(
      this.companyId,
      this.applicationId,
      this.application.value as CompanyShareholderAllotment,
      this.isShowWatermark,
      this.watermarkText,
      false,
      false
    )
  }

  get mcrResolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyShareAuthorization>(
      this.companyId,
      this.allotShares.value.existingShareAuthorization.id,
      null,
      this.isShowWatermark,
      this.watermarkText,
      this.isInPreviewMode.value,
      false
    )
  }

  get isShowMcrFirst(): boolean {
    let route = useRoute()
    if (route.fullPath.includes("shareholders")) {
      return true
    }

    return false
  }

  get hasSignedAsDirector(): boolean {
    if (!this.isADirector.value) {
      return true
    }

    return this.application.value.signatureGroups.some((sg: SignatureGroup) => {
      return sg.group?.target === "director" && sg.group?.id === this.directorId.value
    })
  }

  get hasSignedAsShareholder(): boolean {
    if (!this.isAShareholder.value) {
      return true
    }

    return this.application.value.signatureGroups.some((sg: SignatureGroup) => {
      return sg.group?.target === "shareholder" && sg.group?.id === this.shareholderId.value
    })
  }

  get issuanceId(): string {
    return this.allotShares.value.existingIssuance.id
  }
}
