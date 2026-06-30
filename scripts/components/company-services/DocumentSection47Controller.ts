import { CompanySection47 } from "~/scripts/models/CompanySection47"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { Company } from "~/scripts/models/Company"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PaymentUtil } from "~/scripts/utils/Payment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"

export class Section47ServiceController extends CompanyServiceController<CompanySection47> {
  companySection47 = ref<CompanySection47>(new CompanySection47())

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanySection47, useCompanySection47Store(), emitEvents)
    this.target = CompanyConstants.TARGET_SECTION_47
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companySection47.value = new CompanySection47(this.companyServiceInitializer.newApplication)
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true //We need to warn users
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
        this.companySection47.value = new CompanySection47(this.companyServiceInitializer.existingApplication)
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companySection47.value as CompanySection47)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companySection47.value = new CompanySection47()
        this.companySection47.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companySection47.value = new CompanySection47(apiRecord.data[0])
      this.isInPreviewMode.value = false
      this.hasOngoingApplication.value = true
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
      let apiRecord = await this.repository.fetchAll(this.lastSubmissionFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.hasSubmittedBefore.value = false
        this.lastApplicationDate.value = ""
        this.hasPastApplications.value = false
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, false)
        return
      }

      let lastApplication = new CompanySection47(apiRecord.data[0])
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

  isPreview(): boolean {
    return this.isInPreviewMode.value
  }

  async onApplicationUpdated(application: CompanySection47): Promise<void> {
    if (this.viewType.value === ViewMode.New) {
      return
    }

    this.companySection47.value = new CompanySection47(application)
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(application)
    }
  }

  setApplicationData(applicationData: CompanySection47): void {
    if (!applicationData) {
      return
    }

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(applicationData)
    }
  }

  async makePayment(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      let companyRepository = useCompanyStore()
      let response = await companyRepository.fetch(this.companyId)
      if (companyRepository.error !== null) {
        throw companyRepository.error
      }

      let company = new Company(response)

      let user = await CurrentUser.get()

      let billingInfo = company.billingInfo()
      billingInfo.email = user.email
      billingInfo.phone = user.phone

      await this.submitApplication()

      let paymentCart = await PaymentUtil.getCart(
        this.companyId,
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        billingInfo,
        this.target,
        this.companySection47.value.id
      )

      this.emitEvents("pay", paymentCart)
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

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companySection47.value.id)) {
      await this.companySection47.value.create(useCompanySection47Store())
    } else {
      await this.companySection47.value.update(useCompanySection47Store())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companySection47.value.id) || !this.hasPaid()) {
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

    let label = this.language.isMalay() ? "Document Not Kept" : "Document Not Kept (Section 47)"
  }

  helpTitle(): string {
    //TODO: Get the copywriting for this
    return this.language.isMalay() ? "Lorem Ipsum" : "Lorem Ipsum"
  }

  helpDescription(): string {
    //TODO: Get the copywriting for this
    if (this.language.isMalay()) {
      return `Lorem Ipsum`
    }

    return `Lorem Ipsum`
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolution under Section 47" : "Resolution under Section 47"
  }

  get serviceWrapperProps() {
    let application = this.viewType.value === ViewMode.New ? new CompanySection47() : this.companySection47.value

    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companySection47.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companySection47.value.id,
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
      CompanySection47,
      useCompanySection47Store()
    )
  }
}
