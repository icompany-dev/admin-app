import { CompanyManagementAccount } from "~/scripts/models/CompanyManagementAccount"
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
import { CompanyBank } from "~/scripts/models/CompanyBank"
import { StatusConstants } from "~/scripts/constants/Status"
import { File } from "~/scripts/models/File"
import { Form } from "~/scripts/models/Form"

export class ManagementAccountForStrikingOffServiceController extends CompanyServiceController<CompanyManagementAccount> {
  companyManagementAccount = ref<CompanyManagementAccount>(new CompanyManagementAccount())

  isUpdatingStatus: Ref<boolean> = ref<boolean>(false)

  financialYearEndDate: Ref<string> = ref<string>("")
  financialYearStartDate: Ref<string> = ref<string>("")

  wrapperRef: any | null = null
  fileInput: any | null = null

  constructor(
    companyId: string,
    viewType: string,
    financialYearStartDate: string,
    financialYearEndDate: string,
    emitEvents: any | null
  ) {
    super(companyId, true, false, CompanyManagementAccount, useCompanyManagementAccountStore(), emitEvents)
    this.target = CompanyConstants.TARGET_MANAGEMENT_ACCOUNT

    this.setViewType(viewType)
    this.setFinancialYearStartDate(financialYearStartDate)
    this.setFinancialYearEndDate(financialYearEndDate)
    this.initializeData()
  }

  setFinancialYearStartDate(financialYearStartDate: string): void {
    this.financialYearStartDate.value = financialYearStartDate
  }

  setFinancialYearEndDate(financialYearEndDate: string): void {
    this.financialYearEndDate.value = financialYearEndDate
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    if (this.viewType.value !== ViewMode.Past) {
      this.hasOngoingApplication.value = true
      this.isInPreviewMode.value = false
      this.viewType.value = ViewMode.Existing
      await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])
    } else {
      this.isInPreviewMode.value = true
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
      this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
    }

    this.init(this.companyManagementAccount.value as CompanyManagementAccount)
    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      this.ongoingFilter.statuses.push(StatusConstants.SUBMITTED)
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      this.hasOngoingApplication.value = true
      this.isInPreviewMode.value = false
      this.viewType.value = ViewMode.Existing

      if (apiRecord.totalRecords <= 0) {
        this.companyManagementAccount.value = new CompanyManagementAccount()
        this.companyManagementAccount.value.companyId = this.companyId
        this.companyManagementAccount.value.status = StatusConstants.PAID
        return
      }

      this.companyManagementAccount.value = new CompanyManagementAccount(apiRecord.data[0])
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error(Error.ERROR_TYPE_API, "Unable to fetch registered address amendment for company")
        errorMessage.handle()
      }
    }
  }

  async onApplicationUpdated(application: CompanyManagementAccount): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyManagementAccount.value)
    }
  }

  setApplicationData(applicationData: CompanyManagementAccount): void {
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

      if (StringUtil.isNullOrEmpty(this.companyManagementAccount.value.id)) {
        await this.submitApplication()
      }

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companyManagementAccount.value.id
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
    if (StringUtil.isNullOrEmpty(this.companyManagementAccount.value.id)) {
      this.companyManagementAccount.value.companyId = this.companyId
      await this.companyManagementAccount.value.create(useCompanyManagementAccountStore())
    } else {
      await this.companyManagementAccount.value.update(useCompanyManagementAccountStore())
    }
  }

  override onBackButtonClicked(): void {
    if (this.isSubmitting.value) {
      return
    }

    this.emitEvents("back")
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyManagementAccount.value.id) || !this.hasPaid()) {
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

    let label = this.language.isMalay() ? "Tukar Alamat Berdaftar" : "Change Registered Address"
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Tukar Alamat Berdaftar" : "Change Registered Address"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `Apabila sesebuah syarikat menukar alamat berdaftar, syarikat
        tersebut perlu memberitahu SSM (Suruhanjaya Syarikat Malaysia) mengenai
        perubahan itu dalam tempoh empat belas hari dari tarikh kuat kuasa perubahan.
        <br><br>
        Alamat berdaftar adalah alamat rasmi syarikat yang didaftarkan dengan SSM,
        di mana semua surat-menyurat rasmi dan notis undang-undang akan dihantar.
        Pemberitahuan pertukaran alamat berdaftar hendaklah dibuat dalam borang dan
        cara yang ditetapkan oleh Arahan Amalan SSM. Merupakan suatu kesalahan
        di bawah Seksyen 591 Akta Syarikat 2016 untuk memberikan maklumat palsu atau
        mengelirukan kepada Pendaftar.`
    }

    return `When a company changes its registered address, it must notify
      SSM (Companies Commission of Malaysia) of the change within fourteen days
      from the effective date of the change.
      <br><br>
      The registered address is the company's official address registered with SSM,
      where all official correspondence and legal notices will be sent.
      The notification of change in registered address is to be done in the form
      and manner specified by SSM's Practice Directive. It is an offense
      under Section 591 of the Companies Act 2016 to provide false or misleading
      information to the Registrar.`
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Maklumat Lanjut: Penutupan Akaun Bank" : "Learn More: Terminate Bank Account"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        //
      `
    }

    return `
      // 
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Penutupan Akaun Bank" : "Resolution: Terminate Bank Account"
  }

  //PASCA
  get isDelivered(): boolean {
    return (
      this.companyManagementAccount.value.status !== StatusConstants.DRAFT &&
      this.companyManagementAccount.value.status !== StatusConstants.PENDING &&
      this.companyManagementAccount.value.status !== StatusConstants.PAID
    )
  }

  get status(): string {
    return this.language.isMalay() ? "Status Penghantaran Dokumen" : "Documents Delivery Status"
  }

  get statusSubnote(): string {
    if (this.companyManagementAccount.value.status === StatusConstants.READY) {
      return this.language.isMalay() ? "Permohonan anda sedang diproses." : "Your application is being processed."
    }

    if (this.isDelivered) {
      return this.language.isMalay() ? "Telah Dihantar" : "Delivered"
    }

    return this.language.isMalay()
      ? "Sila sahkan bahawa salinan fizikal yang diperlukan oleh pihak Bank telah dihantar."
      : "Please confirm that the physical copies required by the Bank have been delivered."
  }

  get deliveryLabel(): string {
    return this.language.isMalay() ? "Telah Dihantar" : "Delivered"
  }

  async onDeliveredClicked(): Promise<void> {
    if (this.companyManagementAccount.value.status !== StatusConstants.PAID) {
      return
    }

    this.isUpdatingStatus.value = true
    this.companyManagementAccount.value.status = StatusConstants.SUBMITTED
    await this.companyManagementAccount.value.update(useCompanyManagementAccountStore())
    this.isUpdatingStatus.value = false
  }

  get confirmation(): string {
    return this.language.isMalay() ? "Status Penutupan Akaun Bank" : "Bank Account Closure Status"
  }

  get confirmationSubnote(): string {
    if (this.companyManagementAccount.value.status === StatusConstants.COMPLETED) {
      return this.language.isMalay() ? "Selesai" : "Completed"
    }

    return this.language.isMalay()
      ? "Muat naik Dokumen Pengesahan dari Bank"
      : "Upload Confirmation Document from the Bank"
  }

  get isComplete(): boolean {
    return this.companyManagementAccount.value.status === StatusConstants.COMPLETED
  }

  get completedLabel(): string {
    return this.language.isMalay() ? "Muat Naik" : "Upload"
  }

  async onCompleteServiceClicked(): Promise<void> {
    this.isUpdatingStatus.value = true
    if (this.fileInput) {
      this.fileInput.click()
    }
  }

  async uploadAndComplete(event: Event): Promise<void> {
    const eventFileInput = event.target as HTMLInputElement
    if (!eventFileInput.files || eventFileInput.files.length <= 0) {
      return
    }

    const fileToUpload: globalThis.File = eventFileInput.files[0]

    // Check size
    const maxSize = 2 * 1024 * 1024 // Max 2MB
    if (fileToUpload.size > maxSize) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForFileTooBig()
      errorMessage.handle()
      return
    }

    // File type
    const type = fileToUpload.type
    if (!type.startsWith("image/") && type !== "application/pdf") {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForIncorrectFileTypeImageAndPdf()
      errorMessage.handle()
      return
    }

    let file = new File()
    await file.uploadFile(fileToUpload, useFileStore())

    let form = new Form()
    form.companyId = this.companyId
    form.type = "business_detail"
    form.fileId = file.id
    form.status = "active"

    await form.create(useFormStore())

    this.isUpdatingStatus.value = false
  }

  get serviceWrapperProps() {
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    let props = new PropsCompanyServiceWrapper(
      this.companyManagementAccount.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyManagementAccount.value.id,
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
      false,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      isInPreviewMode,
      this.isSubmitting.value,
      CompanyManagementAccount,
      useCompanyManagementAccountStore()
    )

    props.serviceWrapperProps.financialYearStartDate = this.financialYearStartDate.value
    props.serviceWrapperProps.financialYearEndDate = this.financialYearEndDate.value
    props.serviceStepProps.isPascaInPasca = true

    return props
  }

  get resolutionDocumentProps() {
    let props = new PropsResolutionDocument<CompanyManagementAccount>(
      this.companyId,
      this.companyManagementAccount.value.id,
      null,
      this.showWatermark(),
      "DRAFT",
      this.isInPreviewMode.value,
      false
    )

    return props
  }
}
