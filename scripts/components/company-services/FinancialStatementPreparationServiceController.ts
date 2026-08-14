import { CompanySetFinancialYearEnd } from "~/scripts/models/CompanySetFinancialYearEnd"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { CompanyFinancialStatementAuthorisedPerson } from "~/scripts/models/CompanyFinancialStatementAuthorisedPerson"
import { CompanyAuditorAppointment } from "~/scripts/models/CompanyAuditorAppointment"
import { Compliance } from "~/scripts/library/Compliance"
import { Filter } from "~/scripts/library/Filter"
import { FinancialYearEndConstants } from "~/scripts/constants/FinancialYearEnds"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PaymentCartItem } from "~/scripts/models/PaymentCartItem"

export class FinancialStatementPreparationServiceController extends CompanyServiceController<CompanySetFinancialYearEnd> {
  companySetFinancialYearEnd = ref<CompanySetFinancialYearEnd>(new CompanySetFinancialYearEnd())
  appointResponsibleDirector = ref<CompanyFinancialStatementAuthorisedPerson>(
    new CompanyFinancialStatementAuthorisedPerson()
  )
  appointmentOfAuditor = ref<CompanyAuditorAppointment>(new CompanyAuditorAppointment())

  financialPeriodId: Ref<string> = ref<string>("")

  hasMoreThanOneDirector: Ref<boolean> = ref<boolean>(false)

  showSetFye: Ref<boolean> = ref<boolean>(false)
  showAppointDirector: Ref<boolean> = ref<boolean>(false)
  showAppointAuditor: Ref<boolean> = ref<boolean>(false)

  wrapperRef: any | null = null

  setFyeDcrRef: any | null = null
  appointResponsibleDirectorDcrRef: any | null = null
  appointAuditorDcrRef: any | null = null

  isSetFyeCompleted: Ref<boolean> = ref<boolean>(false)
  isAppointResponsiblePersonCompleted: Ref<boolean> = ref<boolean>(false)
  isAppointAuditorCompleted: Ref<boolean> = ref<boolean>(false)

  compliance = ref<Compliance>(new Compliance(""))

  private setFinancialYearEndPricing = ref<ServicePricing>(new ServicePricing())
  private appointResponsiblePersonPricing = ref<ServicePricing>(new ServicePricing())
  private appointmentOfAuditorPricing = ref<ServicePricing>(new ServicePricing())

  constructor(companyId: string, viewType: string, hasMoreThanOneDirector: boolean, emitEvents: any | null) {
    super(companyId, true, false, CompanySetFinancialYearEnd, useCompanySetFinancialYearEndStore(), emitEvents)
    this.target = CompanyConstants.TARGET_PREPARE_FINANCIAL_STATEMENTS

    this.setViewType(viewType)
    this.setHasMoreThanOneDirector(hasMoreThanOneDirector)
    this.initializeData()
  }

  setHasMoreThanOneDirector(hasMoreThanOneDirector: boolean): void {
    this.hasMoreThanOneDirector.value = hasMoreThanOneDirector
  }

  setSetFyeDcrRef(setFyeDcrRef: any): void {
    this.setFyeDcrRef = setFyeDcrRef
  }

  setAppointResponsibleDirectorDcrRef(appointResponsibleDirectorDcrRef: any): void {
    this.appointResponsibleDirectorDcrRef = appointResponsibleDirectorDcrRef
  }

  setAppointAuditorDcrRef(appointAuditorDcrRef: any): void {
    this.appointAuditorDcrRef = appointAuditorDcrRef
  }

  async initializeData(): Promise<void> {
    await this.initializeCompliance()

    this.financialPeriodId.value = this.compliance.value.currentFinancialPeriod.id

    await Promise.all([
      this.fetchOngoingSetFye(),
      this.fetchOngoingAppointResponsibleDirector(),
      this.fetchOngoingAppointmentOfAuditor(),
    ])

    await this.fetchPrice()
    this.price.value = 0
    if (!this.isSetFyeCompleted.value) {
      this.price.value += this.setFinancialYearEndPricing.value.baseGrandTotal
    }

    if (!this.isAppointResponsiblePersonCompleted.value) {
      this.price.value += this.appointResponsiblePersonPricing.value.baseGrandTotal
    }

    if (!this.isAppointAuditorCompleted.value) {
      this.price.value += this.appointmentOfAuditorPricing.value.baseGrandTotal
    }

    this.init(this.companySetFinancialYearEnd.value as CompanySetFinancialYearEnd)

    await nextTick(() => {
      this.setTotalPages()
      this.handleDisplayedPage()
    })
  }

  async initializeCompliance(): Promise<void> {
    this.compliance.value.companyId = this.companyId
    await this.compliance.value.init()
  }

  async fetchOngoingSetFye(): Promise<void> {
    let repository = useCompanySetFinancialYearEndStore()
    this.isSetFyeCompleted.value = false

    if (this.compliance.value.hasSetFinancialYearEnd) {
      this.isSetFyeCompleted.value = true

      let response = await repository.latestCompleted(this.companyId)
      if (response) {
        this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd(response)
        return
      }

      this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd()
      let financialPeriod = this.compliance.value.currentFinancialPeriod
      this.companySetFinancialYearEnd.value.financialYearEndDate = financialPeriod.endDate
      this.companySetFinancialYearEnd.value.financialPeriodEndDate = financialPeriod.endDate
      this.companySetFinancialYearEnd.value.financialPeriodStartDate = financialPeriod.startDate

      return
    }

    let response = await repository.ongoing(this.companyId)

    this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd(response)
  }

  async fetchOngoingAppointResponsibleDirector(): Promise<void> {
    this.isAppointResponsiblePersonCompleted.value = false

    if (!this.hasMoreThanOneDirector.value) {
      this.isAppointResponsiblePersonCompleted.value = true // not required
      return
    }

    let repository = useCompanyFinancialStatementAuthorisedPersonStore()
    let response = await repository.latestCompleted(this.companyId)
    if (!response) {
      response = await repository.ongoing(this.companyId)
    } else {
      this.isAppointResponsiblePersonCompleted.value = true
    }

    this.appointResponsibleDirector.value = new CompanyFinancialStatementAuthorisedPerson(response)
    this.financialPeriodId.value = this.appointResponsibleDirector.value.financialPeriodId ?? ""
  }

  async fetchOngoingAppointmentOfAuditor(): Promise<void> {
    this.isAppointAuditorCompleted.value = false

    let companyAuditorRepository = useCompanyAuditorStore()
    let filter = new Filter()
    filter.companyId = this.companyId
    filter.orderBy = "created_at"
    filter.sortOrder = "desc"
    let existingAuditorResponse = await companyAuditorRepository.fetchAll(filter)
    if (existingAuditorResponse.totalRecords > 0) {
      this.isAppointAuditorCompleted.value = true
      return
    }

    let repository = useCompanyAuditorAppointmentStore()
    let response = await repository.fetchLast(this.companyId)

    this.appointmentOfAuditor.value = new CompanyAuditorAppointment(response)
  }

  onWrapperMinimized(applicationData: any): void {
    this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companySetFinancialYearEnd.value)
    }
  }

  async submitSetFinancialYearEndApplication(): Promise<void> {
    if (this.isSetFyeCompleted.value) {
      return
    }

    if (StringUtil.isNullOrEmpty(this.companySetFinancialYearEnd.value.id)) {
      this.companySetFinancialYearEnd.value.companyId = this.companyId
      this.companySetFinancialYearEnd.value.type = FinancialYearEndConstants.AMENDMENT_TYPE_SET
      await this.companySetFinancialYearEnd.value.create(useCompanySetFinancialYearEndStore())
    } else {
      await this.companySetFinancialYearEnd.value.update(useCompanySetFinancialYearEndStore())
    }
  }

  async submitAppointResponsiblePersonApplication(): Promise<void> {
    if (this.isAppointResponsiblePersonCompleted.value || !this.hasMoreThanOneDirector.value) {
      return
    }

    if (StringUtil.isNullOrEmpty(this.appointResponsibleDirector.value.id)) {
      this.appointResponsibleDirector.value.companyId = this.companyId
      this.appointResponsibleDirector.value.financialPeriodId = this.financialPeriodId.value
      await this.appointResponsibleDirector.value.create(useCompanyFinancialStatementAuthorisedPersonStore())
    } else {
      await this.appointResponsibleDirector.value.update(useCompanyFinancialStatementAuthorisedPersonStore())
    }
  }

  async submitAppointmentOfAuditorApplication(): Promise<void> {
    if (this.isAppointAuditorCompleted.value) {
      return
    }

    if (StringUtil.isNullOrEmpty(this.appointmentOfAuditor.value.id)) {
      this.appointmentOfAuditor.value.companyId = this.companyId
      await this.appointmentOfAuditor.value.create(useCompanyAuditorAppointmentStore())
    } else {
      await this.appointmentOfAuditor.value.update(useCompanyAuditorAppointmentStore())
    }
  }

  async onMakePayment(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      await Promise.all([
        this.submitSetFinancialYearEndApplication(),
        this.submitAppointResponsiblePersonApplication(),
        this.submitAppointmentOfAuditorApplication(),
      ])

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        ""
      )
      await makePayment.setPaymentCart()

      if (!this.isSetFyeCompleted.value) {
        let newPaymentCartItem = new PaymentCartItem()
        newPaymentCartItem.servicePricingId = this.setFinancialYearEndPricing.value.id
        newPaymentCartItem.servicePricing = new ServicePricing(this.setFinancialYearEndPricing.value)
        newPaymentCartItem.targetType = CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END
        newPaymentCartItem.targetId = this.companySetFinancialYearEnd.value.id

        makePayment.paymentCart.items.push(newPaymentCartItem)
      }

      if (!this.isAppointResponsiblePersonCompleted.value) {
        let newPaymentCartItem = new PaymentCartItem()
        newPaymentCartItem.servicePricingId = this.appointResponsiblePersonPricing.value.id
        newPaymentCartItem.servicePricing = new ServicePricing(this.appointResponsiblePersonPricing.value)
        newPaymentCartItem.targetType = CompanyConstants.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON
        newPaymentCartItem.targetId = this.appointResponsibleDirector.value.id

        makePayment.paymentCart.items.push(newPaymentCartItem)
      }

      if (!this.isAppointAuditorCompleted.value) {
        let newPaymentCartItem = new PaymentCartItem()
        newPaymentCartItem.servicePricingId = this.appointmentOfAuditorPricing.value.id
        newPaymentCartItem.servicePricing = new ServicePricing(this.appointmentOfAuditorPricing.value)
        newPaymentCartItem.targetType = CompanyConstants.TARGET_AUDITOR_APPOINTMENT
        newPaymentCartItem.targetId = this.appointmentOfAuditor.value.id

        makePayment.paymentCart.items.push(newPaymentCartItem)
      }

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForMakePayment()
        errorMessage.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  hasAnyIncomplete(): boolean {
    return (
      !this.isSetFyeCompleted.value ||
      !this.isAppointResponsiblePersonCompleted.value ||
      !this.isAppointAuditorCompleted.value
    )
  }

  hasAnyToPay(): boolean {
    return (
      StringUtil.isNullOrEmpty(this.companySetFinancialYearEnd.value.id) ||
      StringUtil.isNullOrEmpty(this.appointResponsibleDirector.value.id) ||
      StringUtil.isNullOrEmpty(this.appointmentOfAuditor.value.id)
    )
  }

  async onProceedClicked(): Promise<void> {
    if (this.hasAnyIncomplete() && this.hasAnyToPay()) {
      await this.onMakePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  override handleDisplayedPage(): void {
    // return
  }

  override async setTotalPages(): Promise<void> {
    await nextTick()

    let totalPages = 0

    if (this.setFyeDcrRef) {
      totalPages += this.setFyeDcrRef.totalPages()
    }

    if (this.appointAuditorDcrRef) {
      totalPages += this.appointAuditorDcrRef.totalPages()
    }

    if (this.appointResponsibleDirectorDcrRef) {
      totalPages += this.appointResponsibleDirectorDcrRef.totalPages()
    }

    if (totalPages === 0) {
      totalPages = 1
    }

    this.totalPages.value = totalPages
  }

  override async fetchPrice(): Promise<void> {
    await Promise.all([
      this.setSetFinancialYearEndPricing(),
      this.setAppointResponsiblePersonPricing(),
      this.setAppointmentOfAuditorPricing(),
    ])
  }

  async setSetFinancialYearEndPricing(): Promise<void> {
    let pricingId: string = "2d7f187f-03e8-41f6-baf2-25384dadb9f1"
    let repository = useServicePricingStore()
    let response = await repository.fetch(pricingId)

    if (!response || repository.error !== null) {
      return
    }

    this.setFinancialYearEndPricing.value = new ServicePricing(response)
  }

  async setAppointResponsiblePersonPricing(): Promise<void> {
    let pricingId: string = "6f99cf05-e547-41ac-8d74-5afc948d404b"
    let repository = useServicePricingStore()
    let response = await repository.fetch(pricingId)

    if (!response || repository.error !== null) {
      return
    }

    this.appointResponsiblePersonPricing.value = new ServicePricing(response)
  }

  async setAppointmentOfAuditorPricing(): Promise<void> {
    let pricingId: string = "23c337fc-9971-49a2-851c-48e2f5d8104b"
    let repository = useServicePricingStore()
    let response = await repository.fetch(pricingId)

    if (!response || repository.error !== null) {
      return
    }

    this.appointmentOfAuditorPricing.value = new ServicePricing(response)
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
    return this.language.isMalay()
      ? "Resolusi bagi Menyediakan Penyata Kewangan"
      : "Resolutions for Financial Statement Preparation"
  }

  isApplicationCreated(): boolean {
    return !StringUtil.isNullOrEmpty(this.companySetFinancialYearEnd.value.id)
  }

  isDoneLoading(): boolean {
    let isWrapperDoneLoading = this.wrapperRef !== null && this.wrapperRef.isDoneLoading()
    let isDcrDoneLoading = this.dcrRef !== null && !this.dcrRef.isLoading

    return isDcrDoneLoading && isWrapperDoneLoading
  }

  get serviceWrapperProps() {
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companySetFinancialYearEnd.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companySetFinancialYearEnd.value.id,
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

  get setFyeResolutionDocumentProps() {
    let isInPreviewMode = this.isSetFyeCompleted.value ? false : this.isInPreviewMode.value
    return new PropsResolutionDocument<CompanySetFinancialYearEnd>(
      this.companyId,
      this.companySetFinancialYearEnd.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      isInPreviewMode,
      false
    )
  }

  get appointAuditorResolutionDocumentProps() {
    let isInPreviewMode = this.isAppointAuditorCompleted.value ? false : this.isInPreviewMode.value
    return new PropsResolutionDocument<CompanyAuditorAppointment>(
      this.companyId,
      this.appointmentOfAuditor.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      isInPreviewMode,
      false
    )
  }

  get appointResponsibleResolutionDocumentProps() {
    let isInPreviewMode = this.isAppointResponsiblePersonCompleted.value ? false : this.isInPreviewMode.value
    return new PropsResolutionDocument<CompanyFinancialStatementAuthorisedPerson>(
      this.companyId,
      this.appointResponsibleDirector.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      isInPreviewMode,
      false,
      this.financialPeriodId.value
    )
  }
}
