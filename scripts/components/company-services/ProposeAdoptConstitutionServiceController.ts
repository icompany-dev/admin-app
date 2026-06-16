import { CompanyAmendmentConstitution } from "~/scripts/models/CompanyAmendmentConstitution"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { Company } from "~/scripts/models/Company"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { Filter } from "~/scripts/library/Filter"
import { StatusConstants } from "~/scripts/constants/Status"
import { ConstitutionAmendmentTypes } from "~/scripts/constants/AmendmentTypes"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { PaymentCart } from "~/scripts/models/PaymentCart"
import { BillingInfo } from "~/scripts/models/BillingInfo"
import { PaymentCartItem } from "~/scripts/models/PaymentCartItem"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class ProposeAdoptConstitutionServiceController extends CompanyServiceController<CompanyAmendmentConstitution> {
  companyAmendmentConstitution = ref<CompanyAmendmentConstitution>(new CompanyAmendmentConstitution())
  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAmendmentConstitution, useCompanyAmendmentConstitutionStore(), emitEvents)
    this.target = CompanyConstants.TARGET_AMENDMENT_CONSTITUTION
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyAmendmentConstitution.value = new CompanyAmendmentConstitution(
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
        await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyAmendmentConstitution.value as CompanyAmendmentConstitution)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let filter = new Filter()
      filter.companyId = this.companyId
      filter.statuses = [
        StatusConstants.PAID,
        StatusConstants.DRAFT,
        StatusConstants.PENDING,
        StatusConstants.RESPONDED,
        StatusConstants.ONGOING,
      ]
      filter.orderBy = "created_at"
      filter.sortOrder = "desc"
      let response = await this.repository.fetchAll(filter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      let ongoingAdoption = response.data.filter((d: any) => {
        return d.type === ConstitutionAmendmentTypes.Adopt
      })

      if (response.totalRecords <= 0 || ongoingAdoption.length <= 0) {
        this.companyAmendmentConstitution.value = new CompanyAmendmentConstitution()
        this.companyAmendmentConstitution.value.companyId = this.companyId
        this.companyAmendmentConstitution.value.type = ConstitutionAmendmentTypes.Adopt
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      this.companyAmendmentConstitution.value = new CompanyAmendmentConstitution(ongoingAdoption[0])
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

      let lastApplication = new CompanyAmendmentConstitution(response)
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
    this.companyAmendmentConstitution.value = new CompanyAmendmentConstitution(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAmendmentConstitution.value)
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

      const paymentCartRepository = usePaymentCartStore()
      let paymentCart: PaymentCart | null = await paymentCartRepository.fetchByEntity(
        this.companyId,
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY
      )

      if (!paymentCart || StringUtil.isNullOrEmpty(paymentCart.id)) {
        paymentCart = new PaymentCart()
        paymentCart.entityType = PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY
        paymentCart.entityId = this.companyId
        paymentCart.billingInfo = new BillingInfo(billingInfo)
      }

      if (
        !paymentCart.isItemInCart(
          CompanyConstants.TARGET_AMENDMENT_CONSTITUTION,
          this.companyAmendmentConstitution.value.id
        )
      ) {
        let newPaymentCartItem = new PaymentCartItem()
        newPaymentCartItem.targetType = CompanyConstants.TARGET_AMENDMENT_CONSTITUTION
        newPaymentCartItem.targetId = this.companyAmendmentConstitution.value.id

        let servicePricingRepository = useServicePricingStore()
        let servicePricing: ServicePricing | null = await servicePricingRepository.fetchDefault(
          CompanyConstants.TARGET_ADOPT_A_CONSTITUTION
        )

        if (!servicePricing || StringUtil.isNullOrEmpty(servicePricing.id)) {
          servicePricing = new ServicePricing()
        } else {
          newPaymentCartItem.servicePricingId = servicePricing.id
          newPaymentCartItem.servicePricing = new ServicePricing(servicePricing)
          paymentCart.items.push(newPaymentCartItem)
        }
      }

      paymentCart.redirectUrl = `${window.location.href}?request_id=${this.companyAmendmentConstitution.value.id}&tab=adopt-a-consti`

      if (StringUtil.isNullOrEmpty(paymentCart.id) && paymentCart.canSubmit()) {
        await paymentCart.create(paymentCartRepository)
      }

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
    if (StringUtil.isNullOrEmpty(this.companyAmendmentConstitution.value.id)) {
      await this.companyAmendmentConstitution.value.create(useCompanyAmendmentConstitutionStore())
    } else {
      await this.companyAmendmentConstitution.value.update(useCompanyAmendmentConstitutionStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAmendmentConstitution.value.id) || !this.hasPaid()) {
      await this.makePayment()
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

    let label = this.language.isMalay() ? "Perlembagaan" : "Constitution"
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Perlembagaan" : "Constitution"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Resolusi Cadangan Terima Pakai Perlembagaan adalah...
      `
    }

    return `
      The Resolution to Propose the Adoption of Constitution is the first mandatory step. ...
    `
  }

  isApplicationCreated(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyAmendmentConstitution.value.id)
  }

  isDoneLoading(): boolean {
    let isWrapperDoneLoading = this.wrapperRef !== null && this.wrapperRef.isDoneLoading()
    let isDcrDoneLoading = this.dcrRef !== null && !this.dcrRef.isLoading

    return isDcrDoneLoading && isWrapperDoneLoading
  }

  slipCaseTitle(): string {
    let items = []
    if (this.language.isMalay()) {
      items = ["Resolution: Cadangan Terima Pakai Perlembagaan.", "Resolution: Terima Pakai Perlembagaan."]
    }

    items = ["Resolution: Propose Adoption of Constitution", "Resolution: Adopt Constitution"]

    let list = `
      <ul>
        <li>${items.join("</li><li>")}</li>
      </ul>
    `

    return list
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New
        ? new CompanyAmendmentConstitution()
        : this.companyAmendmentConstitution.value
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
      CompanyAmendmentConstitution,
      useCompanyAmendmentConstitutionStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAmendmentConstitution>(
      this.companyId,
      this.companyAmendmentConstitution.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
