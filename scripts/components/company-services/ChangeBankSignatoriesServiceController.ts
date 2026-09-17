import { CompanyChangeBankSignatory } from "~/scripts/models/CompanyChangeBankSignatory"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"
import type { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { Toast } from "~/scripts/library/Toast"

export class ChangeBankSignatoriesServiceController extends CompanyServiceController<CompanyChangeBankSignatory> {
  companyChangeBankSignatory = ref<CompanyChangeBankSignatory>(new CompanyChangeBankSignatory())
  companyBankId: Ref<string> = ref<string>("")

  isUpdatingStatus: Ref<boolean> = ref<boolean>(false)
  isUpdatingDocument: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, companyBankId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyChangeBankSignatory, useCompanyChangeBankSignatoryStore(), emitEvents)
    this.target = CompanyConstants.TARGET_CHANGE_BANK_SIGNATORY
    this.companyBankId.value = companyBankId
    this.setViewType(viewType)
    this.initializeData()
  }

  async setCompanyBankId(companyBankId: string): Promise<void> {
    this.companyBankId.value = companyBankId

    await this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    if (this.viewType.value !== ViewMode.Past) {
      await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])

      if (
        StringUtil.isNullOrEmpty(this.companyChangeBankSignatory.value.id) ||
        this.companyChangeBankSignatory.value.status === StatusConstants.DRAFT ||
        this.companyChangeBankSignatory.value.status === StatusConstants.PENDING
      ) {
        this.viewType.value = ViewMode.New
        this.hasOngoingApplication.value = false
        this.isInPreviewMode.value = true
        this.emitEvents(EmitMessages.GO_TO_NEW)
      } else {
        this.viewType.value = ViewMode.Existing
        this.hasOngoingApplication.value = true
        this.isInPreviewMode.value = false
        this.emitEvents(EmitMessages.GO_TO_EXISTING)
      }
    } else {
      this.isInPreviewMode.value = true
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
      this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
    }

    await this.init(this.companyChangeBankSignatory.value as CompanyChangeBankSignatory)
    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyBankId.value)) {
      return
    }

    try {
      let response = await this.repository.ongoing(this.companyBankId.value)
      if (!response) {
        this.companyChangeBankSignatory.value = new CompanyChangeBankSignatory()
        return
      }

      this.companyChangeBankSignatory.value = new CompanyChangeBankSignatory(response)
      this.hasOngoingApplication.value = !StringUtil.isNullOrEmpty(this.companyChangeBankSignatory.value.id)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error()
        errorMessage.setForFetch()
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

      let lastApplication = new CompanyChangeBankSignatory(apiRecord.data[0])
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async onApplicationUpdated(application: CompanyChangeBankSignatory): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyChangeBankSignatory.value)
    }
  }

  setApplicationData(applicationData: CompanyChangeBankSignatory): void {
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

      if (StringUtil.isNullOrEmpty(this.companyChangeBankSignatory.value.id)) {
        await this.submitApplication()
      }

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companyChangeBankSignatory.value.id
      )
      await makePayment.setPaymentCart()

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        console.error(e)
        let error: Error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyChangeBankSignatory.value.id)) {
      this.companyChangeBankSignatory.value.companyId = this.companyId
      this.companyChangeBankSignatory.value.companyBankId = this.companyBankId.value
      await this.companyChangeBankSignatory.value.create(useCompanyChangeBankSignatoryStore())
    } else {
      await this.companyChangeBankSignatory.value.update(useCompanyChangeBankSignatoryStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyChangeBankSignatory.value.id) || !this.hasPaid()) {
      this.makePayment()
      return
    }
  }

  alertTitle(): string {
    return this.language.isMalay()
      ? "Maklumat Lanjut: Pertukaran Penandatangan Akaun Bank"
      : "Learn More: Change of Bank Account Signatories"
  }

  alertContent(): string {
    return this.language.isMalay() ? "Lorem Ipsum..." : "Lorem Ipsum..."
  }

  slipCaseTitle(): string {
    return this.language.isMalay()
      ? "Resolusi: Tukar Penandatangan Akaun Bank"
      : "Resolution: Change Bank Account Signatories"
  }

  get serviceWrapperProps() {
    let showPasca =
      this.viewType.value === ViewMode.Existing &&
      this.companyChangeBankSignatory.value.status !== StatusConstants.COMPLETED

    let props = new PropsCompanyServiceWrapper(
      this.companyChangeBankSignatory.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyChangeBankSignatory.value.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.isDocumentLocked,
      this.hasSigned(),
      this.userSignatureDate(),
      this.hasDcr.value,
      this.hasMcr.value,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      false,
      false,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      this.isInPreviewMode.value,
      this.isSubmitting.value,
      CompanyChangeBankSignatory,
      useCompanyChangeBankSignatoryStore(),
      false,
      true,
      true
    )

    props.serviceWrapperProps.companyBankId = this.companyBankId.value
    props.isSubmittingDocument = this.isUpdatingDocument.value

    return props
  }

  get resolutionDocumentProps() {
    let props = new PropsResolutionDocument<CompanyChangeBankSignatory>(
      this.companyId,
      this.companyChangeBankSignatory.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )

    props.companyBankId = this.companyBankId.value
    props.isShowTag = this.isShowTags
    props.isReadOnly = false

    return props
  }

  // PASCA
  currentState(): string {
    if (this.companyChangeBankSignatory.value.signatories.length <= 0) {
      return this.language.isMalay() ? "Maklumat Signatories Diperlukan" : "Signatories Information Required"
    }

    return this.language.isMalay() ? "Semua Maklumat Lengkap" : "All Information Completed"
  }

  currentStateSubnote(): string {
    if (this.companyChangeBankSignatory.value.signatories.length <= 0) {
      return this.language.isMalay() ? "Pilih Signatories anda" : "Choose your Signatories"
    }

    return ""
  }

  showSignatories(): boolean {
    return this.companyChangeBankSignatory.value.signatories.length > 0
  }

  signatoriesLabel(): string {
    return this.language.isMalay() ? "Authorised Signatories" : "Authorised Signatories"
  }

  signatories(): string[] {
    if (this.companyChangeBankSignatory.value.signatories.length <= 0) {
      return []
    }

    return this.companyChangeBankSignatory.value.signatories.map((d: CompanyBankSignatory) => {
      return d.name ?? ""
    })
  }

  get isInformationCompleted(): boolean {
    return this.companyChangeBankSignatory.value.signatories.length > 0
  }

  get isShowReadyToSubmit(): boolean {
    return this.isInformationCompleted && !this.isDocumentLocked
  }

  get readyToSubmitLabel(): string {
    return this.language.isMalay() ? "Sedia untuk serah?" : "Ready to submit?"
  }

  get readyToSubmitSublabel(): string {
    return this.language.isMalay()
      ? "Klik '<b>Serah</b>' untuk tandakan permohonan ini sedia untuk diproses."
      : "Click on '<b>Submit</b>' to mark this application as ready for processing."
  }

  get submitLabel(): string {
    return this.language.isMalay() ? "Serah" : "Submit"
  }

  async onSubmitAllInformation(): Promise<void> {
    if (!this.isInformationCompleted) {
      return
    }

    this.isUpdatingStatus.value = true
    this.companyChangeBankSignatory.value.status = StatusConstants.READY
    await this.companyChangeBankSignatory.value.update(useCompanyChangeBankSignatoryStore())
    this.isUpdatingStatus.value = false
  }

  get isDocumentLocked(): boolean {
    return (
      this.companyChangeBankSignatory.value.status !== StatusConstants.PAID &&
      this.companyChangeBankSignatory.value.status !== StatusConstants.DRAFT &&
      this.companyChangeBankSignatory.value.status !== StatusConstants.PENDING
    )
  }

  get status(): string {
    return this.language.isMalay()
      ? "Status Penghantaran Dokumen Sokongan Pembankan"
      : "Banking Supporting Documents Delivery Status"
  }

  get statusSubnote(): string {
    if (this.companyChangeBankSignatory.value.status === StatusConstants.READY) {
      return this.language.isMalay() ? "Permohonan anda sedang diproses." : "Your application is being processed."
    }

    if (this.isDelivered) {
      return this.language.isMalay() ? "Telah Dihantar" : "Delivered"
    }

    return this.language.isMalay()
      ? "Sila sahkan bahawa salinan fizikal yang diperlukan oleh pihak Bank telah dihantar."
      : "Please confirm that the physical copies required by the Bank have been delivered."
  }

  get isDelivered(): boolean {
    return (
      this.companyChangeBankSignatory.value.status !== StatusConstants.DRAFT &&
      this.companyChangeBankSignatory.value.status !== StatusConstants.PENDING &&
      this.companyChangeBankSignatory.value.status !== StatusConstants.PAID
    )
  }

  get deliveryLabel(): string {
    return this.language.isMalay() ? "Telah Dihantar" : "Delivered"
  }

  async onDeliveredClicked(): Promise<void> {
    if (this.companyChangeBankSignatory.value.status !== StatusConstants.PAID) {
      return
    }

    this.isUpdatingStatus.value = true
    this.companyChangeBankSignatory.value.status = StatusConstants.SUBMITTED
    await this.companyChangeBankSignatory.value.update(useCompanyChangeBankSignatoryStore())
    this.isUpdatingStatus.value = false
  }

  get confirmation(): string {
    return this.language.isMalay() ? "Status Pembukaan Akaun Bank" : "Bank Account Opening Status"
  }

  get confirmationSubnote(): string {
    if (this.companyChangeBankSignatory.value.status === StatusConstants.COMPLETED) {
      return this.language.isMalay() ? "Selesai" : "Completed"
    }

    return this.language.isMalay()
      ? "Sila sahkan perkara ini jika Penandatangan Akaun Bank Sdn Bhd anda telah dikemaskini:"
      : "Confirm this if Your Sdn Bhd Bank Account Signatories is updated:"
  }

  get isComplete(): boolean {
    return this.companyChangeBankSignatory.value.status === StatusConstants.COMPLETED
  }

  get completedLabel(): string {
    return this.language.isMalay() ? "Selesai" : "Completed"
  }

  async onCompleteServiceClicked(): Promise<void> {
    if (this.companyChangeBankSignatory.value.status !== StatusConstants.SUBMITTED) {
      return
    }

    try {
      this.isUpdatingStatus.value = true

      let repository = useCompanyChangeBankSignatoryStore()
      await repository.complete(this.companyChangeBankSignatory.value.id)

      let toastTitle = this.language.isMalay()
        ? "Butiran Penandatangan Akaun Bank Sdn Bhd Anda telah dikemaskini."
        : "Details of Your Bank Account Signatories have been updated!"
      let toast = new Toast(toastTitle, "")
      toast.success()

      let router = useRouter()
      router.push({ path: `/sdnbhd/${this.companyId}/banks` })
    } catch (e) {
      let error = new Error()
      error.setForCUD()
      error.handle()
    } finally {
      this.isUpdatingStatus.value = false
    }
  }
}
