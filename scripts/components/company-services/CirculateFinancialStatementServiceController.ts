import { CompanyAuditCirculation } from "~/scripts/models/CompanyAuditCirculation"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"

export class CirculateFinancialStatementServiceController extends CompanyServiceController<CompanyAuditCirculation> {
  companyAuditCirculation = ref<CompanyAuditCirculation>(new CompanyAuditCirculation())

  financialPeriodId: Ref<string> = ref<string>("")

  wrapperRef: any | null = null

  constructor(companyId: string, financialPeriodId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAuditCirculation, useCompanyAuditCirculationStore(), emitEvents)
    this.target = CompanyConstants.TARGET_AUDIT_CIRCULATION

    this.financialPeriodId.value = financialPeriodId

    this.setViewType(viewType)
    this.initializeData()
  }

  async setFinancialPeriodId(financialPeriodId: string): Promise<void> {
    this.financialPeriodId.value = financialPeriodId

    await this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    try {
      if (this.viewType.value !== ViewMode.Past) {
        this.isInPreviewMode.value = false
        this.hasOngoingApplication.value = true

        await this.fetchOngoingApplication()

        if (StringUtil.isNullOrEmpty(this.companyAuditCirculation.value.id)) {
          this.companyAuditCirculation.value.companyId = this.companyId
          this.companyAuditCirculation.value.financialPeriodId = this.financialPeriodId.value
          this.companyAuditCirculation.value.status = StatusConstants.PAID
          await this.companyAuditCirculation.value.create(useCompanyAuditCirculationStore())
        }
      } else {
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
      }

      this.init(this.companyAuditCirculation.value as CompanyAuditCirculation)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let repository = useCompanyAuditCirculationStore()
      let response = await repository.byFinancialPeriod(this.companyId, this.financialPeriodId.value)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      this.companyAuditCirculation.value = new CompanyAuditCirculation(response)
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

  onWrapperMinimized(applicationData: any): void {
    if (!applicationData) {
      return
    }

    this.companyAuditCirculation.value = new CompanyAuditCirculation(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAuditCirculation.value)
    }
  }

  async onApplicationUpdated(): Promise<void> {
    await this.fetchOngoingApplication()
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
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Pengedaran dan Serah Simpan" : "Circulation and Lodgement"
  }

  alertContent(): string {
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

  override onBackButtonClicked(): void {
    this.emitEvents("back")
  }

  isDoneLoading(): boolean {
    let isWrapperDoneLoading = this.wrapperRef !== null && this.wrapperRef.isDoneLoading()
    let isDcrDoneLoading = this.dcrRef !== null && !this.dcrRef.isLoading

    return isDcrDoneLoading && isWrapperDoneLoading
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyAuditCirculation() : this.companyAuditCirculation.value

    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    let props = new PropsCompanyServiceWrapper(
      application,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      application.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.haveAllSigned(),
      this.hasSigned(),
      this.userSignatureDate(),
      this.hasDcr.value,
      this.hasMcr.value,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      false,
      true,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      isInPreviewMode,
      this.isSubmitting.value,
      CompanyAuditCirculation,
      useCompanyAuditCirculationStore()
    )

    props.serviceStepProps.isPascaInPasca = true

    return props
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
      this.financialPeriodId.value
    )
  }
}
