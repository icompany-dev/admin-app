import { CompanySetFinancialYearEnd } from "~/scripts/models/CompanySetFinancialYearEnd"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { Compliance } from "~/scripts/library/Compliance"
import { FinancialYearEndConstants } from "~/scripts/constants/FinancialYearEnds"

export class SetFinancialYearEndServiceController extends CompanyServiceController<CompanySetFinancialYearEnd> {
  companySetFinancialYearEnd = ref<CompanySetFinancialYearEnd>(new CompanySetFinancialYearEnd())

  applicationType: Ref<string> = ref<string>(FinancialYearEndConstants.AMENDMENT_TYPE_SET)

  isPartOfBundle = ref<boolean>(false)
  hasMoreThanOneDirector = ref<boolean>(false)

  wrapperRef: any | null = null

  type: Ref<string> = ref<string>("set")

  constructor(
    companyId: string,
    viewType: string,
    isPartOfBundle: boolean,
    hasMoreThanOneDirector: boolean,
    emitEvents: any | null
  ) {
    super(companyId, true, false, CompanySetFinancialYearEnd, useCompanySetFinancialYearEndStore(), emitEvents)
    this.target = CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END

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
    this.isLoading.value = true
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd(
          this.companyServiceInitializer.newApplication
        )
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication(), this.setType()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
          this.setViewType(ViewMode.Existing) // this service will not have split existing and new application views
        }
        this.companySetFinancialYearEnd.value.type = this.type.value
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
        } else {
          this.hasOngoingApplication.value = false
        }
        this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd(
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

    this.init(this.companySetFinancialYearEnd.value as CompanySetFinancialYearEnd)

    this.isLoading.value = false
  }

  async setType(): Promise<void> {
    let compliance = new Compliance("")
    compliance.companyId = this.companyId
    await compliance.checkFinancialYearEnd()
    this.type.value = compliance.hasSetFinancialYearEnd
      ? FinancialYearEndConstants.AMENDMENT_TYPE_CHANGE
      : FinancialYearEndConstants.AMENDMENT_TYPE_SET
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let response = await this.repository.ongoing(this.companyId)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (!response) {
        this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd()
        this.companySetFinancialYearEnd.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd(response)
      this.isInPreviewMode.value = true
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
        return
      }

      let lastApplication = new CompanySetFinancialYearEnd(response)
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
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

    this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companySetFinancialYearEnd.value)
    }
  }

  async onApplicationUpdated(application: CompanySetFinancialYearEnd): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companySetFinancialYearEnd.value)
    }
  }

  async makePayment(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      if (StringUtil.isNullOrEmpty(this.companySetFinancialYearEnd.value.id)) {
        await this.submitApplication()
      }

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companySetFinancialYearEnd.value.id
      )
      await makePayment.setPaymentCart()

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        console.error(e)
        let error: Error = new Error(Error.ERROR_TYPE_API, "Unable to proceed with payment. Please try again")
        error.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companySetFinancialYearEnd.value.id)) {
      this.companySetFinancialYearEnd.value.companyId = this.companyId
      await this.companySetFinancialYearEnd.value.create(useCompanySetFinancialYearEndStore())
    } else {
      await this.companySetFinancialYearEnd.value.update(useCompanySetFinancialYearEndStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companySetFinancialYearEnd.value.id) || !this.hasPaid()) {
      this.makePayment()
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

    let label = this.language.isMalay() ? "Tarikh Akhir Tahun Kewangan" : "Financial Year End"
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Tarikh Akhir Tahun Kewangan" : "Financial Year End"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Tarikh Akhir Tahun Kewangan anda menandakan tarikh penutupan akaun syarikat anda dan menetapkan garis masa untuk pemfailan audit, cukai, dan SSM.
        <br><br>
        Tarikh tersebut mesti ditetapkan dalam tempoh 18 bulan dari tarikh pemerbadanan dan dikekalkan konsisten setiap tahun melainkan diubah melalui resolusi.
        <br><br>
        Para Pengarah bertanggungjawab untuk memastikan semua penyata kewangan disediakan dan dihantar/didaftar dalam tempoh masa yang ditetapkan.
        <br><br>
        Permohonan ini adalah keperluan oleh SSM dan adalah mandatori apabila tiba masanya, walaupun syarikat Sdn Bhd anda tidak aktif atau tiada Akaun Bank.
        <br>
        Tarikh Akhir Tahun Kewangan mesti ditetapkan terlebih dahulu sebelum sebarang penyata kewangan disediakan.
      `
    }

    return `
      Your Financial Year End marks the closing date of your company's accounts and sets the timeline for audit, tax, and SSM filings.
      <br><br>
      It must be fixed within 18 months from incorporation and remain consistent each year unless changed by resolution.
      <br><br>
      Directors are responsible for ensuring all financial statements are prepared and lodged within the prescribed timeframe.
      <br><br>
      This Application is required by SSM and is mandatory when it is due even if your Sdn Bhd is not active or without a Bank Account.
      <br>
      A Financial Year End must be set first before any financial statement is prepared.
    `
  }

  slipCaseTitle(): string {
    if (!this.isPartOfBundle.value) {
      if (this.companySetFinancialYearEnd.value.type === FinancialYearEndConstants.AMENDMENT_TYPE_SET) {
        return this.language.isMalay()
          ? "Resolusi: Tetapan Tarikh Akhir Tahun Kewangan"
          : "Resolution: Setting Up Financial Year End"
      } else {
        return this.language.isMalay()
          ? "Resolusi: Tukar Tarikh Akhir Tahun Kewangan"
          : "Resolution: Change Financial Year End"
      }
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

  override loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  override loaderSublabel(): string {
    return this.language.isMalay() ? "Resolusi Anda" : "Resolution"
  }

  isApplicationCreated(): boolean {
    return !StringUtil.isNullOrEmpty(this.companySetFinancialYearEnd.value.id)
  }

  isDoneLoading(): boolean {
    let isWrapperDoneLoading = this.wrapperRef !== null && this.wrapperRef.isDoneLoading()
    let isDcrDoneLoading = this.dcrRef !== null && !this.dcrRef.isLoading

    return isDcrDoneLoading && isWrapperDoneLoading
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanySetFinancialYearEnd() : this.companySetFinancialYearEnd.value
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
      CompanySetFinancialYearEnd,
      useCompanySetFinancialYearEndStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanySetFinancialYearEnd>(
      this.companyId,
      this.companySetFinancialYearEnd.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false,
      null,
      null,
      [],
      null,
      this.companySetFinancialYearEnd.value.type
    )
  }
}
