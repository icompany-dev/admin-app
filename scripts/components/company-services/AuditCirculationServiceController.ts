import { CompanyAuditCirculation } from "~/scripts/models/CompanyAuditCirculation"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { ObjectUtil } from "~/scripts/utils/Object"

export class AuditCirculationServiceController extends CompanyServiceController<CompanyAuditCirculation> {
  companyAuditCirculation = ref<CompanyAuditCirculation>(new CompanyAuditCirculation())

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAuditCirculation, useCompanyAuditCirculationStore(), emitEvents)
    this.target = CompanyConstants.TARGET_AUDIT_CIRCULATION

    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    if (this.viewType.value !== ViewMode.Past) {
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
      if (this.companyServiceInitializer.existingApplication) {
        this.isInPreviewMode.value = false
        this.hasOngoingApplication.value = true
        this.companyAuditCirculation.value = new CompanyAuditCirculation(
          this.companyServiceInitializer.existingApplication
        )
        this.viewType.value = ViewMode.Existing
      } else {
        this.isInPreviewMode.value = true
        this.hasOngoingApplication.value = false
        this.companyAuditCirculation.value = new CompanyAuditCirculation(this.companyServiceInitializer.newApplication)
        this.viewType.value = ViewMode.New
      }
    } else {
      this.isInPreviewMode.value = true
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
      this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
    }

    this.init(this.companyAuditCirculation.value as CompanyAuditCirculation)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let response = await this.repository.ongoing(this.companyId)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (!response) {
        this.companyAuditCirculation.value = new CompanyAuditCirculation()
        this.companyAuditCirculation.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      this.companyAuditCirculation.value = new CompanyAuditCirculation(response)
      this.hasOngoingApplication.value = true
      this.viewType.value = ViewMode.Existing
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchOngoing()
        errorMessage.handle()
      }
    }
  }

  async fetchPreviousSubmission(): Promise<void> {
    try {
      let response = await this.repository.latestCompleted(this.companyId)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (!response) {
        this.hasSubmittedBefore.value = false
        this.lastApplicationDate.value = ""
        this.hasPastApplications.value = false
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, false)
        return
      }

      let lastApplication = new CompanyAuditCirculation(response)
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchLatest()
        errorMessage.handle()
      }
    }
  }

  onWrapperMinimized(applicationData: any): void {
    if (!applicationData) {
      return
    }

    this.companyAuditCirculation.value = new CompanyAuditCirculation(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAuditCirculation.value)
    }
  }

  async onApplicationUpdated(application: CompanyAuditCirculation): Promise<void> {
    if (this.viewType.value === ViewMode.New) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAuditCirculation.value)
    }
  }

  setApplicationData(applicationData: CompanyAuditCirculation): void {
    if (!applicationData) {
      return
    }

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(applicationData)
    }
  }

  async onProceedClicked(): Promise<void> {
    if (!StringUtil.isNullOrEmpty(this.companyAuditCirculation.value.id) && !this.hasPaid()) {
      this.emitEvents("pay")
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef

    this.setOptionButtons()
  }

  setOptionButtons(): void {
    if (!this.wrapperRef) {
      return
    }

    let label = this.language.isMalay() ? "Pengedaran dan Serah Simpan" : "ACirculation and Lodgment"
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Pengedaran dan Serah Simpan" : "Circulation and Lodgement"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        <b>Pengedaran</b> hanyalah tindakan mengagihkan penyata kewangan Sdn Bhd anda kepada pemegang saham dan pengarah. 
        Ia memastikan pemegang taruh utama dimaklumkan mengenai prestasi Sdn Bhd sebelum sebarang penyerahan rasmi dibuat.
        <br><br>
        Penyata kewangan perlu diedarkan dalam tempoh <b>6 bulan dari Tarikh Akhir Tahun Kewangan anda</b>.
        <br><br>
        <b>Serah Simpan</b> pula adalah langkah rasmi menyerahkan laporan yang sama kepada pihak penguasa, iaitu SSM, untuk 
        rekod mereka.
        <br><br>
        Penyata kewangan perlu diserah simpan dalam tempoh <b>30 hari dari tarikh edaran</b>.
      `
    }

    return `
      <b>Circulation</b> is simply the act of distributing your Sdn Bhd's financial statements to shareholders and directors. 
      It ensures that the key stakeholders are informed about the Sdn Bhd's performance before any official filings are made.
      <br><br>
      The statements must be circulated within <b>6 months of your Financial Year End</b>.
      <br><br>
      <b>Lodgement</b> is the official step of submitting that same report to the government regulator, SSM, for their records.
      <br><br>
      Financial statements must be lodged within <b>30 days of the circulation date</b>.
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Edar Penyata Kewangan" : "Resolution: Circulate Financial Statements"
  }

  isApplicationCreated(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyAuditCirculation.value.id)
  }

  isDoneLoading(): boolean {
    let isWrapperDoneLoading = this.wrapperRef !== null && this.wrapperRef.isDoneLoading()
    let isDcrDoneLoading = this.dcrRef !== null && !this.dcrRef.isLoading

    return isDcrDoneLoading && isWrapperDoneLoading
  }

  isMajorityReached(): boolean {
    if (!this.application.value) {
      return false
    }

    let totalSigned = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "director"
    }).length

    let percentage = Math.ceil((totalSigned / this.totalNumberOfDirectors.value) * 100)

    return percentage >= 50
  }

  override isStepStatusVisible(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.paidAt !== null //&& this.isMajorityReached()
  }

  signatureDate(): string {
    if (!this.application.value) {
      return ""
    }

    if (this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    if (this.isMajorityReached()) {
      let shareholderSignatures = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
        return sg.group?.target === "director"
      })

      if (shareholderSignatures.length > 0) {
        let sorted = ObjectUtil.sort<SignatureGroup>(shareholderSignatures, "createdAt", "desc")

        return this.time.formatDateOnlyShort(sorted[0].createdAt ?? "")
      }
    }

    if (this.hasSigned()) {
      return this.userSignatureDate()
    }

    return ""
  }

  override processingLabel(): string {
    return this.language.isMalay() ? "Sedang diedarkan" : "Circulation in Progress"
  }

  get serviceWrapperProps() {
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyAuditCirculation.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyAuditCirculation.value.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.haveAllSigned(),
      this.hasSigned(),
      this.signatureDate(),
      this.hasDcr.value,
      this.hasMcr.value,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      false,
      true,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      this.isInPreviewMode.value,
      this.isSubmitting.value,
      CompanyAuditCirculation,
      useCompanyAuditCirculationStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAuditCirculation>(
      this.companyId,
      this.companyAuditCirculation.value.id,
      this.companyAuditCirculation.value as CompanyAuditCirculation,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false,
      this.companyAuditCirculation.value.financialPeriodId ?? ""
    )
  }
}
