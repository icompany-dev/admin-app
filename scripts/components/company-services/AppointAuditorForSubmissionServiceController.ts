import { CompanyAuditorAppointment } from "~/scripts/models/CompanyAuditorAppointment"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { Filter } from "~/scripts/library/Filter"
import { CompanyAuditor } from "~/scripts/models/CompanyAuditor"
import type { PaymentCartItem } from "~/scripts/models/PaymentCartItem"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"
import { StatusConstants } from "~/scripts/constants/Status"

export class AppointAuditorForSubmissionServiceController extends CompanyServiceController<CompanyAuditorAppointment> {
  companyAuditorAppointment = ref<CompanyAuditorAppointment>(new CompanyAuditorAppointment())

  wrapperRef: any | null = null

  auditorPartnerRef: any | null = null

  currentAuditor = ref<CompanyAuditor | null>(null)

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAuditorAppointment, useCompanyAuditorAppointmentStore(), emitEvents)
    this.target = CompanyConstants.TARGET_AUDITOR_APPOINTMENT
    this.setViewType(viewType)
    this.setActionTrayElements()
    this.initializeData()
  }

  setAuditorPartnerRef(auditorPartnerRef: any | null): void {
    this.auditorPartnerRef = auditorPartnerRef
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyAuditorAppointment.value = new CompanyAuditorAppointment(
          this.companyServiceInitializer.newApplication
        )
        await Promise.all([this.fetchPrice(), this.fetchOngoingApplication(), this.fetchExistingAuditor()])
        if (this.hasOngoingApplication.value) {
          this.isInPreviewMode.value = false
          this.emitEvents(EmitMessages.GO_TO_EXISTING)
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        this.hasOngoingApplication.value = true
        await this.fetchOngoingApplication()
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyAuditorAppointment.value as CompanyAuditorAppointment)

    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let response = await this.repository.ongoing(this.companyId)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (!response) {
        this.companyAuditorAppointment.value = new CompanyAuditorAppointment()
        this.hasOngoingApplication.value = false
        this.emitEvents(EmitMessages.NO_EXISTING_APPLICATION)
        return
      }

      this.companyAuditorAppointment.value = new CompanyAuditorAppointment(response)
      this.hasOngoingApplication.value = true
      this.viewType.value = ViewMode.Existing
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error(Error.ERROR_TYPE_API, "Unable to fetch ongoing application for company")
        errorMessage.handle()
      }
    }
  }

  async fetchExistingAuditor(): Promise<void> {
    this.currentAuditor.value = null

    let repository = useCompanyAuditorStore()
    let filter = new Filter()
    filter.companyId = this.companyId
    filter.orderBy = "created_at"
    filter.sortOrder = "desc"

    let response = await repository.fetchAll(filter)
    if (repository.error !== null) {
      throw repository.error
    }

    if (response.totalRecords <= 0) {
      return
    }

    this.currentAuditor.value = new CompanyAuditor(response.data[0])
  }

  async onApplicationUpdated(application: CompanyAuditorAppointment): Promise<void> {
    if (!application) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAuditorAppointment.value)
    }
  }

  setApplicationData(applicationData: CompanyAuditorAppointment): void {
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

      if (StringUtil.isNullOrEmpty(this.companyAuditorAppointment.value.id)) {
        await this.submitApplication()
      }

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companyAuditorAppointment.value.id
      )

      await makePayment.setPaymentCart()

      if (this.currentAuditor.value === null) {
        let paymentCartItem = makePayment.paymentCart.items.find((pci: PaymentCartItem) => {
          return pci.targetType === this.target && pci.targetId === this.companyAuditorAppointment.value.id
        })

        if (paymentCartItem && !this.hasAppointedAuditor) {
          let servicePricingId = "7e5a1d4c-ca05-4fb0-bd91-d708beaf7fab" // first auditor appointment
          let repository = useServicePricingStore()
          let response = await repository.fetch(servicePricingId)
          if (!repository.error) {
            paymentCartItem.servicePricingId = servicePricingId
            paymentCartItem.servicePricing = new ServicePricing(response)
          }
        }
      }

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
    if (StringUtil.isNullOrEmpty(this.companyAuditorAppointment.value.id)) {
      this.companyAuditorAppointment.value.companyId = this.companyId
      await this.companyAuditorAppointment.value.create(useCompanyAuditorAppointmentStore())
    } else {
      await this.companyAuditorAppointment.value.update(useCompanyAuditorAppointmentStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAuditorAppointment.value.id)) {
      await this.makePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  override setActionTrayElements(): void {
    const { $previousPath } = useNuxtApp()

    this.actionTrayElements.value = [
      new ActionTrayElement("1", this.onViewAuditorsClicked.bind(this), {
        label: new ActionTrayLabel("Find an Auditor", "Cari JuruAudit"),
      }),
      new ActionTrayElement("2", () => {}, {
        label: new ActionTrayLabel("Learn More", "Maklumat Lanjut"),
      }),
    ]

    if ($previousPath.value === `/sdnbhd/${this.companyId}/financial-statements`) {
      let backItem = new ActionTrayElement("0", this.onBackToPageButtonClicked.bind(this), {
        label: new ActionTrayLabel("Back", "Kembali"),
        iconClass: "fa-solid fa-arrow-left",
        isIconStart: true,
      })

      this.actionTrayElements.value = [backItem, ...this.actionTrayElements.value]
    }
  }

  override showActionTray(): boolean {
    return this.viewType.value !== ViewMode.Past && !this.isLoading.value
    // return this.hasPaid() && StringUtil.isNullOrEmpty(this.companyAuditorAppointment.value.auditorPartnerId)
  }

  onViewAuditorsClicked(): void {
    if (this.auditorPartnerRef) {
      this.auditorPartnerRef.show()
    }
  }

  onBackToPageButtonClicked(): void {
    this.emitEvents("back")
  }

  onAuditorPartnerSelected(selectedPartnerId: string): void {
    this.eventManager.setSelectedAuditorPartnerId(selectedPartnerId)

    if (this.wrapperRef) {
      this.wrapperRef.handleDocumentClicked()
    }
  }

  onCancelAuditorPartnerSelection(): void {
    this.eventManager.setSelectedAuditorPartnerId(null)
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Pelantikan Juruaudit" : "Appointment Of Auditor"
  }

  helpDescription(): string {
    //TODO: Get the copywriting for this
    if (this.language.isMalay()) {
      return `Lorem Ipsum`
    }

    return `Lorem Ipsum`
  }

  slipCaseTitle(): string {
    if (!this.hasAppointedAuditor) {
      return this.language.isMalay() ? "Resolusi: Perlantikan Juruaudit" : "Resolution: Appointment of Auditor"
    }

    return this.language.isMalay() ? "Resolusi: Tukar Juruaudit" : "Resolution: Change of Auditor"
  }

  override loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  override loaderSublabel(): string {
    return this.language.isMalay() ? "Resolusi Anda" : "Resolution"
  }

  get hasAppointedAuditor(): boolean {
    return this.currentAuditor.value !== null && !StringUtil.isNullOrEmpty(this.currentAuditor.value.id)
  }

  get serviceWrapperProps() {
    let props = new PropsCompanyServiceWrapper(
      this.companyAuditorAppointment.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyAuditorAppointment.value.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      true,
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
      this.isInPreviewMode.value,
      this.isSubmitting.value,
      CompanyAuditorAppointment,
      useCompanyAuditorAppointmentStore()
    )

    props.serviceStepProps.isPascaInPasca = true

    return props
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAuditorAppointment>(
      this.companyId,
      this.companyAuditorAppointment.value.id,
      this.companyAuditorAppointment.value as CompanyAuditorAppointment,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
