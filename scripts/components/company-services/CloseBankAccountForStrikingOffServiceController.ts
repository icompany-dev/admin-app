import { CompanyBankAccountClosure } from "~/scripts/models/CompanyBankAccountClosure"
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

export class CloseBankAccountForStrikingOffServiceController extends CompanyServiceController<CompanyBankAccountClosure> {
  companyBankAccountClosure = ref<CompanyBankAccountClosure>(new CompanyBankAccountClosure())
  companyBankId: Ref<string | null> = ref<string | null>(null)
  companyBank = ref<CompanyBank | null>(null)

  isUpdatingStatus: Ref<boolean> = ref<boolean>(false)

  wrapperRef: any | null = null
  fileInput: any | null = null

  constructor(companyId: string, companyBankId: string | null, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyBankAccountClosure, useCompanyBankAccountClosureStore(), emitEvents)
    this.target = CompanyConstants.TARGET_CLOSE_BANK_ACCOUNT
    this.companyBankId.value = companyBankId

    this.setViewType(viewType)
    this.initializeData()
  }

  setFileInput(fileInput: any): void {
    this.fileInput = fileInput
  }

  async setCompanyBankId(companyBankId: string | null): Promise<void> {
    this.companyBankId.value = companyBankId

    await this.fetchCompanyBank()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    if (this.viewType.value !== ViewMode.Past) {
      this.hasOngoingApplication.value = true
      this.isInPreviewMode.value = false
      this.viewType.value = ViewMode.Existing
      await Promise.all([this.fetchPrice(), this.fetchOngoingApplication(), this.fetchCompanyBank()])
    } else {
      this.isInPreviewMode.value = true
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
      this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
    }

    this.init(this.companyBankAccountClosure.value as CompanyBankAccountClosure)
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
        this.companyBankAccountClosure.value = new CompanyBankAccountClosure()
        this.companyBankAccountClosure.value.companyId = this.companyId
        this.companyBankAccountClosure.value.companyBankId = this.companyBankId.value
        this.companyBankAccountClosure.value.status = StatusConstants.PAID
        return
      }

      if (this.companyBankId.value !== null && !StringUtil.isNullOrEmpty(this.companyBankId.value)) {
        let matchedApplication = apiRecord.data.find((d: any) => {
          let record = new CompanyBankAccountClosure(d)

          return record.companyBankId === this.companyBankId.value
        })

        if (!matchedApplication) {
          this.companyBankAccountClosure.value = new CompanyBankAccountClosure()
          this.companyBankAccountClosure.value.companyId = this.companyId
          this.companyBankAccountClosure.value.companyBankId = this.companyBankId.value
          this.companyBankAccountClosure.value.status = StatusConstants.PAID
          return
        }

        this.companyBankAccountClosure.value = new CompanyBankAccountClosure(matchedApplication)
      } else {
        this.companyBankAccountClosure.value = new CompanyBankAccountClosure(apiRecord.data[0])
      }
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error(Error.ERROR_TYPE_API, "Unable to fetch registered address amendment for company")
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

      let lastApplication = new CompanyBankAccountClosure(apiRecord.data[0])
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error(Error.ERROR_TYPE_API, "Unable to fetch registered address amendment for company")
        errorMessage.handle()
      }
    }
  }

  async fetchCompanyBank(): Promise<void> {
    if (!this.companyBankId.value || StringUtil.isNullOrEmpty(this.companyBankId.value)) {
      this.companyBank.value = null
      return
    }

    let repository = useCompanyBankStore()
    let response = await repository.fetch(this.companyBankId.value)
    if (response) {
      this.companyBank.value = new CompanyBank(response)
    }
  }

  async onApplicationUpdated(application: CompanyBankAccountClosure): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyBankAccountClosure.value)
    }
  }

  setApplicationData(applicationData: CompanyBankAccountClosure): void {
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

      if (StringUtil.isNullOrEmpty(this.companyBankAccountClosure.value.id)) {
        await this.submitApplication()
      }

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companyBankAccountClosure.value.id
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
    if (StringUtil.isNullOrEmpty(this.companyBankAccountClosure.value.id)) {
      this.companyBankAccountClosure.value.companyId = this.companyId
      this.companyBankAccountClosure.value.companyBankId = this.companyBankId.value
      this.companyBankAccountClosure.value.bankName = this.companyBank.value
        ? this.companyBank.value.bank.name.toUpperCase()
        : "-"
      this.companyBankAccountClosure.value.bankBranch = this.companyBank.value
        ? this.companyBank.value.bankBranch.name.toUpperCase()
        : "-"
      this.companyBankAccountClosure.value.bankAddress = this.companyBank.value
        ? this.companyBank.value.bankBranch.address.toUpperCase()
        : "-"
      this.companyBankAccountClosure.value.bankAccountNo = this.companyBank.value
        ? this.companyBank.value.accountNumber
        : "-"
      this.companyBankAccountClosure.value.transferToBeneficiary = "-"
      this.companyBankAccountClosure.value.transferToBankName = "-"
      this.companyBankAccountClosure.value.transferToBankAccountNo = "-"

      await this.companyBankAccountClosure.value.create(useCompanyBankAccountClosureStore())
    } else {
      await this.companyBankAccountClosure.value.update(useCompanyBankAccountClosureStore())
    }
  }

  override onBackButtonClicked(): void {
    if (this.isSubmitting.value) {
      return
    }

    this.emitEvents("back")
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyBankAccountClosure.value.id) || !this.hasPaid()) {
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
      this.companyBankAccountClosure.value.status !== StatusConstants.DRAFT &&
      this.companyBankAccountClosure.value.status !== StatusConstants.PENDING &&
      this.companyBankAccountClosure.value.status !== StatusConstants.PAID
    )
  }

  get status(): string {
    return this.language.isMalay() ? "Status Penghantaran Dokumen" : "Documents Delivery Status"
  }

  get statusSubnote(): string {
    if (this.companyBankAccountClosure.value.status === StatusConstants.READY) {
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
    if (this.companyBankAccountClosure.value.status !== StatusConstants.PAID) {
      return
    }

    this.isUpdatingStatus.value = true
    this.companyBankAccountClosure.value.status = StatusConstants.SUBMITTED
    await this.companyBankAccountClosure.value.update(useCompanyBankAccountClosureStore())
    this.isUpdatingStatus.value = false
  }

  get confirmation(): string {
    return this.language.isMalay() ? "Status Penutupan Akaun Bank" : "Bank Account Closure Status"
  }

  get confirmationSubnote(): string {
    if (this.companyBankAccountClosure.value.status === StatusConstants.COMPLETED) {
      return this.language.isMalay() ? "Selesai" : "Completed"
    }

    return this.language.isMalay()
      ? "Muat naik Dokumen Pengesahan dari Bank"
      : "Upload Confirmation Document from the Bank"
  }

  get isComplete(): boolean {
    return this.companyBankAccountClosure.value.status === StatusConstants.COMPLETED
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
      this.companyBankAccountClosure.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyBankAccountClosure.value.id,
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
      CompanyBankAccountClosure,
      useCompanyBankAccountClosureStore()
    )

    props.serviceStepProps.isPascaInPasca = true

    return props
  }

  get resolutionDocumentProps() {
    let props = new PropsResolutionDocument<CompanyBankAccountClosure>(
      this.companyId,
      this.companyBankAccountClosure.value.id,
      null,
      this.showWatermark(),
      "DRAFT",
      this.isInPreviewMode.value,
      false
    )

    props.companyBankId = this.companyBankId.value

    return props
  }
}
