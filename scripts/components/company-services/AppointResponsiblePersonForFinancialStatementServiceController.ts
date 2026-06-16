import { CompanyFinancialStatementAuthorisedPerson } from "~/scripts/models/CompanyFinancialStatementAuthorisedPerson"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class AppointResponsiblePersonForFinancialStatementServiceController extends CompanyServiceController<CompanyFinancialStatementAuthorisedPerson> {
  companyFinancialStatementAuthorisedPerson = ref<CompanyFinancialStatementAuthorisedPerson>(
    new CompanyFinancialStatementAuthorisedPerson()
  )
  isPartOfBundle = ref<boolean>(false)
  hasMoreThanOneDirector = ref<boolean>(false)

  wrapperRef: any | null = null

  constructor(
    companyId: string,
    isPartOfBundle: boolean,
    hasMoreThanOneDirector: boolean,
    viewType: string,
    emitEvents: any | null
  ) {
    super(
      companyId,
      true,
      false,
      CompanyFinancialStatementAuthorisedPerson,
      useCompanyFinancialStatementAuthorisedPersonStore(),
      emitEvents
    )
    this.target = CompanyConstants.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON

    this.setViewType(viewType)
    this.setIsPartOfBundle(isPartOfBundle)
    this.setHasMoreThanOneDirector(hasMoreThanOneDirector)
    this.initializeData()
  }

  setIsPartOfBundle(isPartOfBundle: boolean): void {
    this.isPartOfBundle.value = isPartOfBundle
  }

  setHasMoreThanOneDirector(hasMoreThanOneDirector: boolean): void {
    this.hasMoreThanOneDirector.value = hasMoreThanOneDirector
  }

  async initializeData(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyFinancialStatementAuthorisedPerson.value = new CompanyFinancialStatementAuthorisedPerson(
          this.companyServiceInitializer.newApplication
        )
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
          this.setViewType(ViewMode.Existing) // this service will not have split existing and new application views
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
        } else {
          this.hasOngoingApplication.value = false
        }
        this.companyFinancialStatementAuthorisedPerson.value = new CompanyFinancialStatementAuthorisedPerson(
          this.companyServiceInitializer.existingApplication
        )
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyFinancialStatementAuthorisedPerson.value as CompanyFinancialStatementAuthorisedPerson)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let response = await this.repository.ongoing(this.companyId)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (!response) {
        this.companyFinancialStatementAuthorisedPerson.value = new CompanyFinancialStatementAuthorisedPerson()
        this.companyFinancialStatementAuthorisedPerson.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      this.companyFinancialStatementAuthorisedPerson.value = new CompanyFinancialStatementAuthorisedPerson(response)
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

      let lastApplication = new CompanyFinancialStatementAuthorisedPerson(response)
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
    this.companyFinancialStatementAuthorisedPerson.value = new CompanyFinancialStatementAuthorisedPerson(
      applicationData
    )
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyFinancialStatementAuthorisedPerson.value)
    }
  }

  async onProceedClicked(): Promise<void> {
    if (!StringUtil.isNullOrEmpty(this.companyFinancialStatementAuthorisedPerson.value.id) && !this.hasPaid()) {
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

    let label = this.language.isMalay()
      ? "Perlantikan Pengarah Bertanggungjawab"
      : "Appointment of Responsible Director"
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Perlantikan Pengarah Bertanggungjawab" : "Appointment of Responsible Director"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Di bawah Akta Syarikat 2016, setiap syarikat mesti mengenal pasti seorang individu khusus untuk memikul tanggungjawab undang-undang ke atas angka-angka 
        kewangan. Resolusi Pengarah (DCR) ini secara rasmi melantik individu tersebut—biasanya Pengarah, Ketua Pegawai Kewangan (CFO), atau Pengurus Kewangan—
        sebagai pegawai yang "bertanggungjawab utama ke atas pengurusan kewangan" syarikat.
        <br><br>
        Pelantikan ini memberi kuasa kepada mereka untuk menandatangani Akuan Berkanun (Statutory Declaration), satu dokumen undang-undang wajib yang mengesahkan 
        bahawa akaun tersebut adalah betul dan benar. Tanpa resolusi ini, Akuan Berkanun tersebut tidak akan sah untuk diserahkan kepada SSM.
        <br><br>
        Walaupun seluruh Lembaga Pengarah mesti menyemak dan meluluskan penyata kewangan, adalah tidak praktikal untuk setiap pengarah menandatangani dokumen 
        akhir. Resolusi ini merekodkan kelulusan Lembaga dan secara rasmi memberi kuasa kepada pengarah tertentu untuk menandatangani Laporan Pengarah dan 
        Penyata oleh Pengarah bagi pihak seluruh Lembaga.
        <br><br>
        Tandatangan ini bertindak sebagai bukti kepada SSM, juruaudit, dan pemegang saham bahawa Lembaga telah bersetuju secara kolektif mengenai kedudukan 
        kewangan syarikat bagi tahun tersebut.
      `
    }

    return `
      Under the Companies Act 2016, every company must identify one specific individual to take legal ownership of the financial figures. This DCR 
      officially appoints this person—usually a Director, CFO, or Finance Manager—as the officer "primarily responsible for the financial management" 
      of the company.
      <br><br>
      This appointment authorizes them to sign the Statutory Declaration, a mandatory legal document confirming that the accounts are correct 
      and true. Without this resolution, the Statutory Declaration would not be valid for submission to SSM.
      <br><br>
      While the entire Board of Directors must review and approve the financial statements, it is not practical for every single director to 
      sign the final documents. This DCR records the Board's approval and formally authorizes specific director to sign the Directors' 
      Report and the Statement by Directors on behalf of the whole Board. 
      <br><br>
      These signatures act as proof to SSM, auditors, and shareholders that the Board has collectively agreed on the company's financial position 
      for that year.
    `
  }

  slipCaseTitle(): string {
    if (!this.isPartOfBundle.value) {
      return this.language.isMalay()
        ? "Resolusi: Tetapan Tarikh Akhir Tahun Kewangan"
        : "Resolution: Set Financial Year End"
    }

    let items = []
    items.push(
      this.language.isMalay() ? "Resolusi: Tetapan Tarikh Akhir Tahun Kewangan" : "Resolution: Set Financial Year End"
    )

    if (this.hasMoreThanOneDirector.value) {
      items.push(
        this.language.isMalay()
          ? "Resolusi: Pelantikan Pengarah Bertanggungjawab"
          : "Resolution: Appoint Responsible Director"
      )
    }

    items.push(this.language.isMalay() ? "Resolusi: Pelantikan Juruaudit" : "Resolution: Appoint Auditor & Audit Firm")

    let list = `
      <ul>
        <li>${items.join("</li><li>")}</li>
      </ul>
    `

    return list
  }

  isApplicationCreated(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyFinancialStatementAuthorisedPerson.value.id)
  }

  isDoneLoading(): boolean {
    let isWrapperDoneLoading = this.wrapperRef !== null && this.wrapperRef.isDoneLoading()
    let isDcrDoneLoading = this.dcrRef !== null && !this.dcrRef.isLoading

    return isDcrDoneLoading && isWrapperDoneLoading
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New
        ? new CompanyFinancialStatementAuthorisedPerson()
        : this.companyFinancialStatementAuthorisedPerson.value

    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
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
      CompanyFinancialStatementAuthorisedPerson,
      useCompanyFinancialStatementAuthorisedPersonStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyFinancialStatementAuthorisedPerson>(
      this.companyId,
      this.companyFinancialStatementAuthorisedPerson.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false,
      this.companyFinancialStatementAuthorisedPerson.value.financialPeriodId ?? ""
    )
  }
}
