import { CompanyConstants } from "~/scripts/constants/Company"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { StatusConstants } from "~/scripts/constants/Status"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { Compliance } from "~/scripts/library/Compliance"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { MakePayment } from "~/scripts/library/MakePayment"
import { Application } from "~/scripts/models/Application"
import { Company } from "~/scripts/models/Company"
import { CompanyAuditCirculation } from "~/scripts/models/CompanyAuditCirculation"
import { CompanyAuditorAppointment } from "~/scripts/models/CompanyAuditorAppointment"
import { CompanyFinancialPeriod } from "~/scripts/models/CompanyFinancialPeriod"
import { CompanyFinancialStatementAuthorisedPerson } from "~/scripts/models/CompanyFinancialStatementAuthorisedPerson"
import { CompanyFinancialStatementSetup } from "~/scripts/models/CompanyFinancialStatementSetup"
import { CompanySetFinancialYearEnd } from "~/scripts/models/CompanySetFinancialYearEnd"
import { Director } from "~/scripts/models/Director"
import { File } from "~/scripts/models/File"
import type { IApplication } from "~/scripts/models/IApplication"
import { PaymentCartItem } from "~/scripts/models/PaymentCartItem"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { ServicePricingMandatory } from "~/scripts/models/ServicePricingMandatory"
import { Shareholder } from "~/scripts/models/Shareholder"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { User } from "~/scripts/models/User"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { StringUtil } from "~/scripts/utils/String"

export class SubmitFinancialStatementServiceController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())

  currentUser: Ref<User> = ref<User>(new User())

  companyFinancialPeriod = ref<CompanyFinancialPeriod>(new CompanyFinancialPeriod())
  companyFinancialStatementSetup = ref<CompanyFinancialStatementSetup>(new CompanyFinancialStatementSetup())
  companySetFinancialYearEnd = ref<CompanySetFinancialYearEnd>(new CompanySetFinancialYearEnd())
  companyAuditorAppointment = ref<CompanyAuditorAppointment>(new CompanyAuditorAppointment())
  companyFinancialStatementAuthorisedPerson = ref<CompanyFinancialStatementAuthorisedPerson>(
    new CompanyFinancialStatementAuthorisedPerson()
  )
  companyAuditCirculation = ref<CompanyAuditCirculation>(new CompanyAuditCirculation())

  compliance = ref<Compliance>(new Compliance(""))
  directors: Ref<Director[]> = ref<Director[]>([])
  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])
  documentViewMode: Ref<string> = ref<string>(ViewMode.Shrouded)

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)
  isSubmitting: Ref<boolean> = ref<boolean>(false)
  isMakingPayment: Ref<boolean> = ref<boolean>(false)
  isShowInfo: Ref<boolean> = ref<boolean>(false)
  isSubmittingAudited: Ref<boolean> = ref<boolean>(false)
  isDownloadingFinancialStatements: Ref<boolean> = ref<boolean>(false)

  existingFinancialStatement: Ref<File | null> = ref<File | null>(null)

  isShowSetFyeService: Ref<boolean> = ref<boolean>(false)
  isShowAppointAuditorService: Ref<boolean> = ref<boolean>(false)
  isShowAuditCirculationService: Ref<boolean> = ref<boolean>(false)
  isShowExtensionOfTimeService: Ref<boolean> = ref<boolean>(false)

  currentStep: Ref<number> = ref<number>(1)

  price: Ref<number> = ref<number>(499)
  priceForUnaudited: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())
  priceForAudited: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())
  priceForSetFYE: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())
  priceForAppointAuditor: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())
  priceForAuthorisedPerson: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())

  isHideAffirmationDetails: Ref<boolean> = ref<boolean>(false)
  isHideStatusDetails: Ref<boolean> = ref<boolean>(false)

  actionTrayElements: Ref<ActionTrayElement[]> = ref<ActionTrayElement[]>([])

  paymentConfirmationRef: any | null = null

  language = useLanguage()
  eventManager = useEventManagerStore()

  constructor(companyId: string, emitEvents: any) {
    this.companyId.value = companyId

    this.emitEvents = emitEvents

    this.initializeData()
    this.setActionTrayElements()
  }

  async initializeData(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      this.currentUser.value = await CurrentUser.get()
      await Promise.all([
        this.fetchOngoingFinancialStatementSetup(),
        this.fetchCompany(),
        this.checkCompliance(),
        this.fetchPrices(),
        this.fetchDirectors(),
        this.fetchFinancialPeriod(),
      ])

      await Promise.all([
        this.fetchOngoingSetFYE(),
        this.fetchOngoingAppointmentOfAuditor(),
        this.fetchOngoingAuthorisedPerson(),
        // this.fetchOngoingAuditCirculation(),
      ])

      this.isSubmittingAudited.value = this.companyFinancialPeriod.value.isSubmittingAudited ?? false

      if (this.canHideAffirmationStatusDetails) {
        this.isHideAffirmationDetails.value = true
        this.isHideStatusDetails.value = false
      }
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  setPaymentConfirmationRef(paymentConfirmationRef: any): void {
    this.paymentConfirmationRef = paymentConfirmationRef
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    await this.initializeData()
  }

  async fetchOngoingFinancialStatementSetup(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useCompanyFinancialStatementSetupStore()
    let response = await repository.ongoing(this.companyId.value)

    this.companyFinancialStatementSetup.value = new CompanyFinancialStatementSetup(response)

    if (!StringUtil.isNullOrEmpty(this.companyFinancialStatementSetup.value.id)) {
      this.emitEvents(EmitMessages.GO_TO_EXISTING)
    }
  }

  async fetchFinancialPeriod(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    // get the one that has just past
    let repository = useCompanyFinancialPeriodStore()
    let filter = new Filter()
    filter.companyId = this.companyId.value
    filter.orderBy = "end_date"
    filter.sortOrder = "desc"

    let response = await repository.fetchAll(filter)

    if (response.totalRecords <= 0) {
      return
    }

    let dayjs = useDayjs()
    let today = dayjs()
    response.data.forEach((d: any) => {
      if (!StringUtil.isNullOrEmpty(this.companyFinancialPeriod.value.id)) {
        return
      }

      let record = new CompanyFinancialPeriod(d)
      let endDate = dayjs(record.endDate)

      if (endDate.isBefore(today)) {
        this.companyFinancialPeriod.value = new CompanyFinancialPeriod(record)
      }
    })
  }

  async fetchCompany(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }
    let repository = useCompanyStore()
    let response = await repository.fetch(this.companyId.value)
    this.company.value = new Company(response)
  }

  async checkCompliance(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    this.compliance.value.companyId = this.companyId.value
    await this.compliance.value.init()
  }

  async fetchPrices(): Promise<void> {
    let repository = useServicePricingStore()
    let unauditedServicePricingId = "08a7a4f9-2286-4144-aeaa-7a9ec7130543"
    let auditedServicePricingId = "4b4acbd6-66a6-47ba-a97d-808c40a14d24"
    let setFyesServicePricingId = "2d7f187f-03e8-41f6-baf2-25384dadb9f1"
    let appointAuditorServicePricingId = "7e5a1d4c-ca05-4fb0-bd91-d708beaf7fab"
    let authorisedPersonServicePricingId = "6f99cf05-e547-41ac-8d74-5afc948d404b"

    let promises = [
      repository.fetch(unauditedServicePricingId).then((response) => {
        if (!response) {
          return
        }
        this.priceForUnaudited.value = new ServicePricing(response)
      }),
      repository.fetch(auditedServicePricingId).then((response) => {
        if (!response) {
          return
        }
        this.priceForAudited.value = new ServicePricing(response)
      }),

      repository.fetch(setFyesServicePricingId).then((response) => {
        if (!response) {
          return
        }
        this.priceForSetFYE.value = new ServicePricing(response)
      }),

      repository.fetch(appointAuditorServicePricingId).then((response) => {
        if (!response) {
          return
        }
        this.priceForAppointAuditor.value = new ServicePricing(response)
      }),

      repository.fetch(authorisedPersonServicePricingId).then((response) => {
        if (!response) {
          return
        }
        this.priceForAuthorisedPerson.value = new ServicePricing(response)
      }),
    ]

    await Promise.all(promises)
  }

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useDirectorStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)

    if (repository.error !== null) {
      throw repository.error
    }

    this.directors.value = response.map((d: any) => {
      return new Director(d)
    })
  }

  async fetchOngoingSetFYE(): Promise<void> {
    if (
      StringUtil.isNullOrEmpty(this.companyId.value) ||
      StringUtil.isNullOrEmpty(this.companyFinancialStatementSetup.value.setFyeId)
    ) {
      return
    }

    let repository = useCompanySetFinancialYearEndStore()
    let response = await repository.fetch(this.companyFinancialStatementSetup.value.setFyeId ?? "")

    if (repository.error !== null) {
      throw repository.error
    }

    this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd(response)

    if (
      this.companySetFinancialYearEnd.value.status === StatusConstants.DRAFT ||
      this.companySetFinancialYearEnd.value.status === StatusConstants.PENDING
    ) {
      this.companySetFinancialYearEnd.value.status = StatusConstants.PAID

      if (StringUtil.isNullOrEmpty(this.companySetFinancialYearEnd.value.id)) {
        return
      }
      await this.companySetFinancialYearEnd.value.update(repository)
    }
  }

  async fetchOngoingAppointmentOfAuditor(): Promise<void> {
    if (
      StringUtil.isNullOrEmpty(this.companyId.value) ||
      StringUtil.isNullOrEmpty(this.companyFinancialStatementSetup.value.auditorAppointmentId)
    ) {
      return
    }

    let repository = useCompanyAuditorAppointmentStore()
    let response = await repository.fetch(this.companyFinancialStatementSetup.value.auditorAppointmentId ?? "")

    if (repository.error !== null) {
      throw repository.error
    }

    this.companyAuditorAppointment.value = new CompanyAuditorAppointment(response)

    if (
      this.companyAuditorAppointment.value.status === StatusConstants.DRAFT ||
      this.companyAuditorAppointment.value.status === StatusConstants.PENDING
    ) {
      this.companyAuditorAppointment.value.status = StatusConstants.PAID

      if (!this.companyAuditorAppointment.value.canSubmit()) {
        return
      }

      await this.companyAuditorAppointment.value.update(repository)
    }
  }

  async fetchOngoingAuthorisedPerson(): Promise<void> {
    if (
      StringUtil.isNullOrEmpty(this.companyId.value) ||
      StringUtil.isNullOrEmpty(this.companyFinancialStatementSetup.value.authorisedPersonId)
    ) {
      return
    }

    let repository = useCompanyFinancialStatementAuthorisedPersonStore()
    let response = await repository.fetch(this.companyFinancialStatementSetup.value.authorisedPersonId ?? "")

    if (repository.error !== null) {
      throw repository.error
    }

    this.companyFinancialStatementAuthorisedPerson.value = new CompanyFinancialStatementAuthorisedPerson(response)

    if (
      this.companyFinancialStatementAuthorisedPerson.value.status === StatusConstants.DRAFT ||
      this.companyFinancialStatementAuthorisedPerson.value.status === StatusConstants.PENDING
    ) {
      this.companyFinancialStatementAuthorisedPerson.value.status = StatusConstants.PAID
      this.companyFinancialStatementAuthorisedPerson.value.financialPeriodId = this.companyFinancialPeriod.value.id

      if (!this.companyFinancialStatementAuthorisedPerson.value.canSubmit()) {
        return
      }

      await this.companyFinancialStatementAuthorisedPerson.value.update(repository)
    }
  }

  async fetchOngoingAuditCirculation(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useCompanyAuditCirculationStore()
    let response = await repository.ongoing(this.companyId.value)

    if (repository.error !== null) {
      throw repository.error
    }

    this.companyAuditCirculation.value = new CompanyAuditCirculation(response)
  }

  showWatermark(application: IApplication): boolean {
    if (this.documentViewMode.value === ViewMode.Shrouded) {
      return false
    }

    if (application === null) {
      return false
    }

    if (application.status === StatusConstants.READY) {
      return true
    }

    return (
      this.isInPreviewMode ||
      (application !== null && application !== undefined && application.signatureGroups.length <= 0)
    )
  }

  watermarkText(application: IApplication): string {
    if (!application) {
      return ""
    }

    if (this.isInPreviewMode || StringUtil.isNullOrEmpty(application.id)) {
      return "PREVIEW"
    }

    if (application.status === StatusConstants.READY) {
      return "READY FOR DELIVERY"
    }

    if (application.signatureGroups.length <= 0) {
      return "DRAFT"
    }

    return ""
  }

  onViewModeChanged(viewMode: string): void {
    this.documentViewMode.value = viewMode
  }

  setActionTrayElements(): void {
    this.actionTrayElements.value = [
      new ActionTrayElement("2-0", this.onBackButtonClicked.bind(this), {
        label: new ActionTrayLabel("Back", "Kembali"),
        iconClass: "fa-solid fa-arrow-left",
        isIconStart: true,
      }),
      new ActionTrayElement("2-1", this.onMoreInfoClicked.bind(this), {
        label: new ActionTrayLabel("Learn More", "Maklumat Lanjut"),
      }),
    ]
  }

  onBackButtonClicked(): void {
    if (this.isSubmitting.value) {
      return
    }

    let router = useRouter()
    router.back()
  }

  onMoreInfoClicked(): void {
    this.isShowInfo.value = !this.isShowInfo.value
    this.eventManager.setIsDisablePage(this.isShowInfo.value)
  }

  async onProceedClicked(): Promise<void> {
    if (!this.paymentConfirmationRef) {
      this.isSubmittingAudited.value = true
      await this.makePayment()
      return
    }

    this.paymentConfirmationRef.show()
  }

  async onSubmitAuditedFinancialStatements(): Promise<void> {
    this.isSubmittingAudited.value = true
    await this.makePayment()
  }

  async onSubmitUnauditedFinancialStatements(): Promise<void> {
    this.isSubmittingAudited.value = false
    await this.makePayment()
  }

  async submitApplication(): Promise<void> {
    if (!StringUtil.isNullOrEmpty(this.companyFinancialStatementSetup.value.id)) {
      return
    }

    this.companyFinancialStatementSetup.value = new CompanyFinancialStatementSetup()
    this.companyFinancialStatementSetup.value.companyId = this.companyId.value

    if (!this.hasSetFirstFYE) {
      this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd()
      this.companySetFinancialYearEnd.value.companyId = this.companyId.value
      await this.companySetFinancialYearEnd.value.create(useCompanySetFinancialYearEndStore())
      this.companyFinancialStatementSetup.value.setFyeId = this.companySetFinancialYearEnd.value.id
    }

    if (this.isSubmittingAudited.value) {
      if (!this.compliance.value.hasAppointedAuditor) {
        this.companyAuditorAppointment.value = new CompanyAuditorAppointment()
        this.companyAuditorAppointment.value.companyId = this.companyId.value
        await this.companyAuditorAppointment.value.create(useCompanyAuditorAppointmentStore())
        this.companyFinancialStatementSetup.value.auditorAppointmentId = this.companyAuditorAppointment.value.id
      }
    }

    this.companyFinancialStatementAuthorisedPerson.value = new CompanyFinancialStatementAuthorisedPerson()
    this.companyFinancialStatementAuthorisedPerson.value.companyId = this.companyId.value
    this.companyFinancialStatementAuthorisedPerson.value.financialPeriodId = this.companyFinancialPeriod.value.id
    await this.companyFinancialStatementAuthorisedPerson.value.create(
      useCompanyFinancialStatementAuthorisedPersonStore()
    )
    this.companyFinancialStatementSetup.value.authorisedPersonId =
      this.companyFinancialStatementAuthorisedPerson.value.id

    if (!StringUtil.isNullOrEmpty(this.companyFinancialPeriod.value.id)) {
      this.companyFinancialPeriod.value.isSubmittingAudited = this.isSubmittingAudited.value
      await this.companyFinancialPeriod.value.updateSubmission(useCompanyFinancialPeriodStore())
    }

    if (StringUtil.isNullOrEmpty(this.companyFinancialStatementSetup.value.id)) {
      await this.companyFinancialStatementSetup.value.create(useCompanyFinancialStatementSetupStore())
    } else {
      await this.companyFinancialStatementSetup.value.update(useCompanyFinancialStatementSetupStore())
    }
  }

  async makePayment(): Promise<void> {
    if (this.isMakingPayment.value) {
      return
    }

    try {
      this.isMakingPayment.value = true

      await this.submitApplication()

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId.value,
        "company_financial_statement_setup",
        this.companyFinancialStatementSetup.value.id
      )

      await makePayment.setPaymentCart()

      let paymentCartItem = makePayment.paymentCart.items.find((pci: PaymentCartItem) => {
        return (
          pci.targetType === "company_financial_statement_setup" &&
          pci.targetId === this.companyFinancialStatementSetup.value.id
        )
      })

      if (!paymentCartItem) {
        paymentCartItem = new PaymentCartItem()
        paymentCartItem.targetType = "company_financial_statement_setup"
        paymentCartItem.targetId = this.companyFinancialStatementSetup.value.id
        makePayment.paymentCart.items.push(paymentCartItem)
      }

      let servicePricing = this.isSubmittingAudited.value ? this.priceForAudited.value : this.priceForUnaudited.value

      let cosecFees = servicePricing.config.cosecServiceFee

      if (!this.hasSetFirstFYE) {
        let newMandatoryServicePricing = new ServicePricingMandatory()
        newMandatoryServicePricing.mandatoryServiceId = this.priceForSetFYE.value.id
        newMandatoryServicePricing.mandatoryServicePrice = this.priceForSetFYE.value
        newMandatoryServicePricing.basePrice = 19
        servicePricing.mandatoryServices.push(newMandatoryServicePricing)

        cosecFees = cosecFees - 19
      }

      if (this.isSubmittingAudited.value && !this.compliance.value.hasAppointedAuditor) {
        let newMandatoryServicePricing = new ServicePricingMandatory()
        newMandatoryServicePricing.mandatoryServiceId = this.priceForAppointAuditor.value.id
        newMandatoryServicePricing.mandatoryServicePrice = this.priceForAppointAuditor.value
        newMandatoryServicePricing.basePrice = 19 // just for the resolution
        servicePricing.mandatoryServices.push(newMandatoryServicePricing)
        cosecFees = cosecFees - 19
      }

      servicePricing.config.cosecServiceFee = cosecFees // adjusted to keep the price at default

      paymentCartItem.servicePricing = servicePricing
      paymentCartItem.servicePricingId = servicePricing.id

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForMakePayment()
        error.handle()
      }

      console.error(e)
    } finally {
      this.isMakingPayment.value = false
    }
  }

  async handlePostDelete(): Promise<void> {
    if (this.eventManager.isItemRemovedFromCart) {
      await this.initializeData()
      this.eventManager.setIsItemRemovedFromCart(false)
    }
  }

  onOpenSetFyeClicked(): void {
    if (this.isShowHiddenDocuments) {
      return
    }

    this.isShowSetFyeService.value = true
  }

  onCloseSetFyeClicked(): void {
    this.isShowSetFyeService.value = false
  }

  onOpenAppointAuditorService(): void {
    if (this.isShowHiddenDocuments) {
      return
    }

    this.isShowAppointAuditorService.value = true
  }

  onCloseAppointAuditorService(): void {
    this.isShowAppointAuditorService.value = false
  }

  onAffirmationDetailsClicked(): void {
    this.isHideAffirmationDetails.value = !this.isHideAffirmationDetails.value

    this.isHideStatusDetails.value = !this.isHideAffirmationDetails.value
  }

  onStatusDetailsClicked(): void {
    this.isHideStatusDetails.value = !this.isHideStatusDetails.value

    this.isHideAffirmationDetails.value = !this.isHideStatusDetails.value
  }

  onReuploadClicked(): void {
    this.existingFinancialStatement.value = this.companyFinancialPeriod.value.financialStatement
      ? new File(this.companyFinancialPeriod.value.financialStatement)
      : null
    this.companyFinancialPeriod.value.financialStatement = null
    this.companyFinancialPeriod.value.financialStatementId = null
  }

  onCancelReuploadClicked(): void {
    this.companyFinancialPeriod.value.financialStatement = this.existingFinancialStatement.value
      ? new File(this.existingFinancialStatement.value)
      : null
    this.companyFinancialPeriod.value.financialStatementId = this.existingFinancialStatement.value?.id ?? null
  }

  async onUploadFinancialStatement(fileId: string): Promise<void> {
    try {
      this.companyFinancialPeriod.value.financialStatementId = fileId
      this.companyFinancialPeriod.value.financialStatementStatus = "uploaded"

      let repository = useCompanyFinancialPeriodStore()
      await this.companyFinancialPeriod.value.updateFinancialStatement(repository)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForCUD()
        error.handle()
      }
    }
  }

  async onDownloadFinancialStatements(): Promise<void> {
    if (!this.hasUploadedFinancialStatement) {
      let error = new Error(Error.ERROR_TYPE_DATA, "")
      error.title = this.language.isMalay()
        ? "Anda belum muat naik Penyata Kewangan"
        : "You have not uploaded any Financial Statements"
      error.message = this.language.isMalay()
        ? "Muat Naik untuk edar Penyata Kewangan."
        : "Upload to circulate the Financial Statements."
      error.handle()
      return
    }

    try {
      this.isDownloadingFinancialStatements.value = true

      const response = await fetch(this.financialStatementUrl)
      if (!response.ok) {
        let error = new Error(Error.ERROR_TYPE_API, "")
        //
        throw error
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.setAttribute("download", this.financialStatementFilename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      }
    } finally {
      this.isDownloadingFinancialStatements.value = false
    }
  }

  onOpenAuditCirculationService(): void {
    if (this.isShowHiddenDocuments) {
      return
    }

    this.isShowAuditCirculationService.value = true
  }

  onCloseAuditCirculationService(): void {
    this.isShowAuditCirculationService.value = false
  }

  onOpenExtensionOfTimeService(): void {
    if (this.isShowHiddenDocuments) {
      return
    }

    this.isShowExtensionOfTimeService.value = true
  }

  onCloseExtensionOfTimeService(): void {
    this.isShowExtensionOfTimeService.value = false
  }

  //copywriting
  slipCaseTitle(): string {
    return this.language.isMalay() ? "Serah Simpan Penyata Kewangan" : "Lodgement of Financial Statements"
  }

  backButtonLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  proceedButtonLabel(): string {
    return this.language.isMalay() ? "Tambah ke Beg" : "Add to Bag"
  }

  hoveredProceedButtonLabel(): string {
    return this.language.isMalay() ? `dari RM${this.price.value}` : `from RM${this.price.value}`
  }

  learnMoreLabel(): string {
    return this.language.isMalay() ? "Maklumat Lanjut" : "Learn More"
  }

  // getters
  get showCornerButton(): boolean {
    return this.viewType === ViewMode.New
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Setting Up"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Penyerahan Penyata Kewangan" : "Lodgement of Financial Statements"
  }

  get viewType(): string {
    return !this.hasOngoingApplication ? ViewMode.New : ViewMode.Existing // change this to reflect the current state
  }

  get hasOngoingApplication(): boolean {
    return (
      this.companyFinancialStatementSetup.value.status !== StatusConstants.DRAFT &&
      this.companyFinancialStatementSetup.value.status !== StatusConstants.PENDING
    )
  }

  get hasPaid(): boolean {
    return (
      this.companyFinancialStatementSetup.value.status !== StatusConstants.DRAFT &&
      this.companyFinancialStatementSetup.value.status !== StatusConstants.PENDING
    )
  }

  get isInPreviewMode(): boolean {
    return !this.hasPaid
  }

  get numberOfDirectors(): number {
    return this.directors.value.length
  }

  get numberOfShareholders(): number {
    return this.shareholders.value.length
  }

  get isShowSetFYE(): boolean {
    return !this.hasSetFirstFYE
  }

  get isShowAppointAuthorisedPerson(): boolean {
    return this.hasSetFirstFYE && this.numberOfDirectors > 1
  }

  get isShowAuditCirculation(): boolean {
    return this.hasSetFirstFYE && this.numberOfDirectors <= 1
  }

  get activeApplication(): IApplication {
    return this.companyFinancialStatementAuthorisedPerson.value
  }

  get activeTarget(): string {
    return CompanyConstants.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON
  }

  get hasSetFirstFYE(): boolean {
    return this.compliance.value.hasSetFinancialYearEnd
  }

  get hasCompletedAllSetup(): boolean {
    if (!this.hasPaid) {
      return false
    }

    if (this.isSubmittingAudited.value && !this.compliance.value.hasAppointedAuditor) {
      return false
    }

    return (
      this.hasPaid &&
      this.hasSetFirstFYE &&
      this.hasSetAuthorisedPersons &&
      this.companyFinancialStatementAuthorisedPerson.value.signatureGroups.length >= 0.5 * this.numberOfDirectors
    )
  }

  // props getters
  get serviceWrapperProps(): PropsCompanyServiceWrapper {
    let application = new CompanyAuditCirculation()
    if (this.hasPaid) {
      application.id = this.companyFinancialStatementSetup.value.id
      application.status = this.activeApplication.status
      application.paidAt = this.companyFinancialStatementSetup.value.paidAt
    }

    let props = new PropsCompanyServiceWrapper(
      this.companyFinancialStatementAuthorisedPerson.value, // application: IApplication,
      this.companyId.value, // companyId: string,
      this.activeTarget, // target: string,
      this.slipCaseTitle(), // slipCaseTitle: string,
      this.viewType, // viewType: string,
      this.hasOngoingApplication, // hasOngoingApplication: boolean,
      false, // hasPastApplications: boolean,
      this.companyFinancialStatementAuthorisedPerson.value.id, // targetId: string | null = null,
      1, // currentPage: number | null = null,
      1, // totalPages: number | null = null,
      "dcr", // earMarkText: string | null = null,
      true, // showServiceSteps: boolean | null = null,
      this.hasPaid, // hasPaid: boolean | null = null,
      this.price.value, // price: number | null = null,
      false, // haveAllSigned: boolean | null = null,
      false, // hasUserSigned: boolean | null = null,
      null, // signatureDate: string | null = null,
      true, // isDcr: boolean | null = null,
      false, // isMcr: boolean | null = null,
      this.numberOfDirectors, // numberOfDirectors: number | null = null,
      this.numberOfShareholders, // numberOfShareholders: number | null = null,
      false, // canSkipToConfirmation: boolean | null = null,
      false, // useDefaultConfirmation: boolean | null = null,
      this.backButtonLabel(), // backButtonLabel: string | null = null,
      this.proceedButtonLabel(), // proceedButtonLabel: string | null = null,
      this.hoveredProceedButtonLabel(), // hoveredProceedButtonLabel: string | null = null,
      this.isInPreviewMode, // isInPreviewMode: boolean | null = null,
      this.isMakingPayment.value, // isMakingPayment: boolean | null,
      CompanySetFinancialYearEnd, // applicationClassType: new (data: any) => Application,
      useCompanySetFinancialYearEndStore(), // repository: IRepositoryStore,
      false, // isByShareholder: boolean = false,
      false, // hasMajorityRule: boolean = false,
      true // hasCustomAffirmation: boolean = false
    )

    props.serviceStepProps.target = "company_financial_statement_setup"

    return props
  }

  get setFyeDocumentProps(): PropsResolutionDocument<CompanySetFinancialYearEnd> {
    let props = new PropsResolutionDocument<CompanySetFinancialYearEnd>(
      this.companyId.value, //companyId
      this.companySetFinancialYearEnd.value.id, //applicationId
      this.companySetFinancialYearEnd.value as CompanySetFinancialYearEnd, //application
      this.showWatermark(this.companySetFinancialYearEnd.value), //showWatermark
      this.watermarkText(this.companySetFinancialYearEnd.value), //watermarkText
      this.isInPreviewMode,
      false //isByShareholder
    )

    return props
  }

  get authorisedPersonDocumentProps(): PropsResolutionDocument<CompanyFinancialStatementAuthorisedPerson> {
    let props = new PropsResolutionDocument<CompanyFinancialStatementAuthorisedPerson>(
      this.companyId.value, //companyId
      this.companyFinancialStatementAuthorisedPerson.value.id, //applicationId
      this.companyFinancialStatementAuthorisedPerson.value as CompanyFinancialStatementAuthorisedPerson, //application
      this.showWatermark(this.companyFinancialStatementAuthorisedPerson.value), //showWatermark
      this.watermarkText(this.companyFinancialStatementAuthorisedPerson.value), //watermarkText
      this.isInPreviewMode,
      false //isByShareholder
    )

    return props
  }

  get auditCirculationDocumentProps(): PropsResolutionDocument<CompanyAuditCirculation> {
    let props = new PropsResolutionDocument<CompanyAuditCirculation>(
      this.companyId.value, //companyId
      this.companyAuditCirculation.value.id, //applicationId
      this.companyAuditCirculation.value as CompanyAuditCirculation, //application
      this.showWatermark(this.companyAuditCirculation.value), //showWatermark
      this.watermarkText(this.companyAuditCirculation.value), //watermarkText
      this.isInPreviewMode,
      false //isByShareholder
    )

    props.financialPeriodId = this.companyFinancialPeriod.value.id

    return props
  }

  // document getters
  get isShowHiddenDocuments(): boolean {
    return (
      this.isShowSetFyeService.value ||
      this.isShowAppointAuditorService.value ||
      this.isShowAuditCirculationService.value ||
      this.isShowExtensionOfTimeService.value
    )
  }

  get isShowingHiddenDocuments(): boolean {
    return (
      this.isShowSetFyeService.value ||
      this.isShowAppointAuditorService.value ||
      this.isShowAuditCirculationService.value ||
      this.isShowExtensionOfTimeService.value
    )
  }

  get isShowActionTray(): boolean {
    return this.viewType === ViewMode.Existing
  }

  get isShowSetFyeServiceDocument(): boolean {
    if (this.isShowSetFyeService.value) {
      return true
    }

    return !this.isShowHiddenDocuments
  }

  // pasca
  get financialYearEnd(): string {
    return this.language.isMalay() ? "Tarikh Tahun Kewangan" : "Financial Year End"
  }

  get fyeDates(): string {
    if (!this.hasSetFirstFYE) {
      return ""
    }

    let dayjs = useDayjs()
    let time = useLocalTime()

    let startDate = time.formatDateOnlyShort(this.companyFinancialPeriod.value.startDate)
    let endDate = time.formatDateOnlyShort(this.companyFinancialPeriod.value.endDate)

    return `${startDate} - ${endDate}`
  }

  get setFyeLabel(): string {
    return this.language.isMalay() ? "Tetapkan FYE" : "Set FYE"
  }

  get appointedAuditor(): string {
    return this.language.isMalay() ? "Juruaudit" : "Appointed Auditor"
  }

  get auditorDetails(): string {
    if (!this.compliance.value.hasAppointedAuditor) {
      return ""
    }

    return this.compliance.value.appointedAuditor.auditorCompanyName
  }

  get appointAuditorLabel(): string {
    return this.language.isMalay() ? "Lantik Juruaudit" : "Appoint Auditor"
  }

  get pendingLabel(): string {
    return this.language.isMalay() ? "Tertangguh" : "Pending"
  }

  get viewMoreLabel(): string {
    return this.language.isMalay() ? "Papar Lagi" : "View More"
  }

  get viewLessLabel(): string {
    return this.language.isMalay() ? "Papar Kurang" : "View Less"
  }

  get authorisedPersonLabel(): string {
    return this.language.isMalay() ? "Perlantikan Orang Bertanggungjawab" : "Appointment of Responsible Persons"
  }

  get authorisedPersonDirectorRange(): number[] {
    return Array.from({ length: this.numberOfDirectors }, (_, i) => i)
  }

  get authorisedPersonNumberOfDirectorSignatures(): number {
    let directorSignatures = this.companyFinancialStatementAuthorisedPerson.value.signatureGroups.filter(
      (sg: SignatureGroup) => {
        return sg.group?.target === "director"
      }
    )

    return directorSignatures.length
  }

  get directorsLabel(): string {
    return this.language.isMalay() ? "Pengarah" : this.numberOfDirectors > 1 ? "Directors" : "Director"
  }

  get membersLabel(): string {
    return this.language.isMalay() ? "Pemegang Saham" : "Members"
  }

  get notRequiredLabel(): string {
    return this.language.isMalay() ? "Tidak Diperlukan" : "Not Required"
  }

  get hasSetAuthorisedPersons(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyFinancialStatementAuthorisedPerson.value.authorisedForReports) &&
      !StringUtil.isNullOrEmpty(this.companyFinancialStatementAuthorisedPerson.value.authorisedForStatutory)
    )
  }

  get authorisedForSignatoryLabel(): string {
    return this.language.isMalay()
      ? "Bagi Penyata Kewangan dan Akuan Berkanun"
      : "For Financial Statements and Statutory Declarations"
  }

  get authorisedForSignatory(): string {
    if (StringUtil.isNullOrEmpty(this.companyFinancialStatementAuthorisedPerson.value.authorisedForStatutory)) {
      return this.language.isMalay() ? "Lantik Orang Bertanggungjawab" : "Appoint Responsible Person"
    }

    return this.companyFinancialStatementAuthorisedPerson.value.authorisedForStatutory?.toUpperCase() ?? ""
  }

  get authorisedForReportsLabel(): string {
    return this.language.isMalay()
      ? "Bagi Laporan Pengarah & Penyata oleh Pengarah"
      : "For Directors' Report & Statement by Directors"
  }

  get authorisedForReports(): string {
    if (
      this.companyFinancialStatementAuthorisedPerson.value.authorisedForReports === null ||
      StringUtil.isNullOrEmpty(this.companyFinancialStatementAuthorisedPerson.value.authorisedForReports)
    ) {
      return this.language.isMalay() ? "Lantik Orang Bertanggungjawab" : "Appoint Responsible Persons"
    }

    let fragments = this.companyFinancialStatementAuthorisedPerson.value.authorisedForReports.split(",")

    if (fragments.length <= 1) {
      return fragments[0]
    }

    return `${fragments[0]}<br>${fragments[1]}`
  }

  get hasUploadedFinancialStatement(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyFinancialPeriod.value.financialStatementId)
  }

  get financialStatements(): string {
    return this.language.isMalay() ? "Penyata Tahunan" : "Financial Statement"
  }

  get uploadFinancialStatementLabel(): string {
    return this.language.isMalay() ? "Muat Naik Penyata Kewangan" : "Upload Financial Statement"
  }

  get reuploadLabel(): string {
    return this.language.isMalay() ? "Muat Naik Semula" : "Re-Upload"
  }

  get downloadLabel(): string {
    return this.language.isMalay() ? "Muat Turun" : "Download"
  }

  get cancelLabel(): string {
    return this.language.isMalay() ? "Batal" : "Cancel"
  }

  get financialStatementFile(): File {
    return this.companyFinancialPeriod.value.financialStatement ?? new File()
  }

  get financialStatementUrl(): string {
    if (!this.hasUploadedFinancialStatement || !this.companyFinancialPeriod.value.financialStatement) {
      return ""
    }

    return this.companyFinancialPeriod.value.financialStatement?.url ?? ""
  }

  get financialStatementFilename(): string {
    if (!this.hasUploadedFinancialStatement || !this.companyFinancialPeriod.value.financialStatement) {
      return ""
    }

    return `${this.companyFinancialPeriod.value.financialStatement.name}.${this.companyFinancialPeriod.value.financialStatement.extension}`
  }

  get auditCirculationLabel(): string {
    return this.language.isMalay() ? "Edaran Penyata Kewangan" : "Circulation of Financial Statements"
  }

  get initiateCirculation(): string {
    return this.language.isMalay() ? "Mulakan" : "Initiate"
  }

  get circulationDeadlineLabel(): string {
    return this.language.isMalay() ? "Edar sebelum" : "Circulate by"
  }

  get circulationDeadline(): string {
    if (StringUtil.isNullOrEmpty(this.companyFinancialPeriod.value.endDate)) {
      return ""
    }

    let dayjs = useDayjs()
    let time = useLocalTime()

    let sixMonthsLater = dayjs(this.companyFinancialPeriod.value.endDate).add(6, "months").format("YYYY-MM-DD")

    return time.formatDateOnlyShort(sixMonthsLater)
  }

  get lodgementDeadlineLabel(): string {
    return this.language.isMalay() ? "Serah sebelum" : "Lodge by"
  }

  get lodgementDeadline(): string {
    if (StringUtil.isNullOrEmpty(this.circulationDeadline)) {
      return ""
    }

    let dayjs = useDayjs()
    let time = useLocalTime()

    let thirtyDaysLater = dayjs(this.circulationDeadline).add(30, "days").format("YYYY-MM-DD")

    return time.formatDateOnlyShort(thirtyDaysLater)
  }

  get eotLabel(): string {
    return this.language.isMalay() ? "Lanjutan Masa" : "Extension of Time"
  }

  get applyEotLabel(): string {
    return this.language.isMalay() ? "Mohon EOT" : "Apply EOT"
  }

  get canHideAffirmationStatusDetails(): boolean {
    return this.companyFinancialStatementAuthorisedPerson.value.signatureGroups.length > 0
  }
}
