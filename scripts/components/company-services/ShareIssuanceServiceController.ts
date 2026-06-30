import { CompanyShareIssuance } from "~/scripts/models/CompanyShareIssuance"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { ShareType } from "~/scripts/constants/Shareholder"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { Filter } from "~/scripts/library/Filter"
import { StatusConstants } from "~/scripts/constants/Status"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { MakePayment } from "~/scripts/library/MakePayment"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { ObjectUtil } from "~/scripts/utils/Object"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class ShareIssuanceServiceController extends CompanyServiceController<CompanyShareIssuance> {
  companyShareIssuance = ref<CompanyShareIssuance>(new CompanyShareIssuance())

  wrapperRef: any | null = null

  isShowingDcr: Ref<boolean> = ref<boolean>(true)

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyShareIssuance, useCompanyShareIssuanceStore(), emitEvents)
    this.target = CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    if (this.viewType.value === ViewMode.Past || this.isLoading.value) {
      return
    }

    this.isLoading.value = true
    this.isInPreviewMode.value = true
    await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
    if (this.companyServiceInitializer.existingApplication) {
      this.viewType.value = ViewMode.Existing
      this.hasOngoingApplication.value = true
      this.isInPreviewMode.value = false
      this.companyShareIssuance.value = new CompanyShareIssuance(this.companyServiceInitializer.existingApplication)
    } else {
      this.viewType.value = ViewMode.New
      this.companyShareIssuance.value = new CompanyShareIssuance(this.companyServiceInitializer.newApplication)
      this.hasOngoingApplication.value = false
    }

    this.init(this.companyShareIssuance.value as CompanyShareIssuance)
    this.isLoading.value = false
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

      if (response.totalRecords <= 0) {
        this.companyShareIssuance.value = new CompanyShareIssuance()
        this.companyShareIssuance.value.companyId = this.companyId
        this.companyShareIssuance.value.sharesToIssue = 1 // minimum to allot
        this.companyShareIssuance.value.shareType = ShareType.Ordinary
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      this.companyShareIssuance.value = new CompanyShareIssuance(response.data[0])
      this.isInPreviewMode.value = false
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

      let lastApplication = new CompanyShareIssuance(response)
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

    nextTick(() => {
      this.companyShareIssuance.value = new CompanyShareIssuance(applicationData)
      if (this.dcrRef) {
        this.dcrRef.updateApplicationContent(this.companyShareIssuance.value)
      }
    })
  }

  async onApplicationUpdated(application: CompanyShareIssuance): Promise<void> {
    await this.companyServiceInitializer.setExistingApplication()
    this.companyShareIssuance.value = new CompanyShareIssuance(this.companyServiceInitializer.existingApplication)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyShareIssuance.value)
    }
  }

  async makePayment(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true
      await this.submitApplication()

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT,
        this.companyShareIssuance.value.id
      )
      await makePayment.setPaymentCart()

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

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyShareIssuance.value.id)) {
      this.companyShareIssuance.value.companyId = this.companyId
      this.companyShareIssuance.value.sharesToIssue = 1
      await this.companyShareIssuance.value.create(useCompanyShareIssuanceStore())
    } else {
      await this.companyShareIssuance.value.update(useCompanyShareIssuanceStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyShareIssuance.value.id) || !this.hasPaid()) {
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

    let label = this.language.isMalay() ? "Cadang Peruntukkan Saham" : "Propose Allotment of Shares"
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Cadang Peruntukkan Saham" : "Propose Allotment of Share"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Resolusi Cadangan Umpukan adalah langkah wajib yang pertama. Resolusi ini belum menerbitkan sebarang saham — ia 
        sekadar memberi kuasa kepada Syarikat untuk memulakan proses dengan mengesahkan bahawa Lembaga Pengarah berhasrat 
        untuk mewujudkan saham baharu dan ingin meneruskan langkah-langkah pematuhan yang diperlukan. Ini adalah kelulusan 
        dalaman yang membolehkan Setiausaha Syarikat menyediakan dan mengedarkan Notis Hak Pradip kepada semua pemegang 
        saham sedia ada.
        <br><br>
        Dengan meluluskan cadangan ini, Lembaga Pengarah memperakui bahawa sebarang umpukan pada masa hadapan mestilah 
        mematuhi Seksyen 85 Akta. Oleh itu, Para Pengarah bersetuju untuk memulakan proses pra-umpukan, yang merangkumi 
        penawaran saham baharu secara berkadar kepada pemegang saham sedia ada dan menunggu maklum balas mereka. Hanya setelah 
        cadangan ini diluluskan, barulah Syarikat boleh beralih ke peringkat seterusnya dalam proses umpukan tersebut.
      `
    }

    return `
      The Resolution to Propose the Allotment is the first mandatory step. This resolution does not issue any shares yet — 
      it simply authorises the Company to begin the process by confirming that the Board intends to create new shares and 
      wishes to proceed with the required compliance steps. It is an internal approval that allows the Company Secretary to 
      prepare and circulate the Notice of Pre-Emptive Rights to all existing shareholders.
      <br><br>
      By passing this proposal, the Board acknowledges that any future allotment must comply with Section 85 of the Act. 
      The Directors are therefore agreeing to initiate the pre-allotment sequence, which includes offering the new shares 
      proportionately to existing shareholders and waiting for their responses. Only after this proposal is approved can the 
      Company move to the next stage of the allotment process.

    `
  }

  isApplicationCreated(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyShareIssuance.value.id)
  }

  isDoneLoading(): boolean {
    let isWrapperDoneLoading = this.wrapperRef !== null && this.wrapperRef.isDoneLoading()
    let isDcrDoneLoading = this.dcrRef !== null && !this.dcrRef.isLoading

    return isDcrDoneLoading && isWrapperDoneLoading
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Peruntukkan Saham" : "Resolution: Propose Allotment of Shares"
  }

  slipCaseContentPoints(): string[] {
    if (this.language.isMalay()) {
      return [
        "Di bawah Seksyen 78 Akta Syarikat 2016, hanya Pengarah yang mempunyai kuasa untuk mencadangkan dan meluluskan umpukan saham.",
        "Resolusi Cadangan Umpukan Saham adalah <b>langkah wajib yang pertama</b>. Ia belum menerbitkan sebarang saham lagi — ia sekadar memberi kuasa kepada Syarikat untuk memulakan proses umpukan dan menyediakan Notis Hak Pradip bagi pemegang saham sedia ada.",
        "Dengan meluluskan resolusi ini, Lembaga Pengarah mengesahkan hasratnya untuk mewujudkan saham baharu dan membenarkan proses tersebut diteruskan ke langkah seterusnya.",
      ]
    }

    return [
      "Under Section 78 of the Companies Act 2016, only Directors have the authority to propose and approve an allotment of shares.",
      "The Resolution to Propose Allotment of Shares is the <b>first required step</b>. It does not issue any shares yet — it simply authorises the Company to begin the allotment process and to prepare the Notice of Pre-Emptive Rights for existing shareholders.",
      "By passing this resolution, the Board of Directors confirm its intention to create new shares and allows the process to proceed to the next step.",
    ]
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Resolusi: Peruntukkan Saham" : "Resolution: Propose Allotment of Shares"
  }

  alertContentPoints(): string[] {
    if (this.language.isMalay()) {
      return [
        "Di bawah Seksyen 78 Akta Syarikat 2016, hanya Pengarah yang mempunyai kuasa untuk mencadangkan dan meluluskan umpukan saham.",
        "Resolusi Cadangan Umpukan Saham adalah <b>langkah wajib yang pertama</b>. Ia belum menerbitkan sebarang saham lagi — ia sekadar memberi kuasa kepada Syarikat untuk memulakan proses umpukan dan menyediakan Notis Hak Pradip bagi pemegang saham sedia ada.",
        "Dengan meluluskan resolusi ini, Lembaga Pengarah mengesahkan hasratnya untuk mewujudkan saham baharu dan membenarkan proses tersebut diteruskan ke langkah seterusnya.",
      ]
    }

    return [
      "Under Section 78 of the Companies Act 2016, only Directors have the authority to propose and approve an allotment of shares.",
      "The Resolution to Propose Allotment of Shares is the <b>first required step</b>. It does not issue any shares yet — it simply authorises the Company to begin the allotment process and to prepare the Notice of Pre-Emptive Rights for existing shareholders.",
      "By passing this resolution, the Board of Directors confirm its intention to create new shares and allows the process to proceed to the next step.",
    ]
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  override handleDisplayedPage(): void {
    let parentComponent = document.querySelector(".documents") as HTMLElement
    if (!parentComponent) {
      return
    }
    let allPapers = parentComponent.querySelectorAll(".paper-wrapper")

    if (this.documentViewMode.value === ViewMode.Preview || this.documentViewMode.value === ViewMode.Enlarged) {
      allPapers.forEach((paper: Element) => {
        let paperElement = paper as HTMLElement
        paperElement.style.display = "block"
      })
      return
    }

    allPapers.forEach((paper: Element, index: number) => {
      let paperElement = paper as HTMLElement
      if (index + 1 === this.currentPage.value) {
        paperElement.style.display = "block"
      } else {
        paperElement.style.display = "none"
      }
    })
  }

  onShowResolutionClicked(): void {
    this.isShowingDcr.value = true
    this.isShowDocumentOptions.value = false
    this.handleDisplayedPage()
  }

  onShowPrnClicked(): void {
    this.isShowingDcr.value = false
    this.isShowDocumentOptions.value = false
    this.handleDisplayedPage()
  }

  prnLabel(): string {
    return this.language.isMalay() ? "Seksyen 85" : "Section 85"
  }

  dcrName(): string {
    return this.language.isMalay() ? "Resolusi" : "Resolution"
  }

  lastShareholderSignatureDate(): string {
    if (!this.application.value || this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    let signatures = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "shareholder"
    })

    if (signatures.length <= 0) {
      return ""
    }

    let sorted = ObjectUtil.sort<SignatureGroup>(signatures, "createdAt", "desc")

    return this.time.formatDateOnlyShort(sorted[0].createdAt ?? "")
  }

  expiryDate(): string {
    if (!this.application.value) {
      return ""
    }

    let expiryDate = this.dayjs(this.companyShareIssuance.value.startDate)
      .add(this.companyShareIssuance.value.noticePeriod, "days")
      .endOf("day")
      .format("YYYY-MM-DD")

    return this.time.formatDateOnlyShort(expiryDate)
  }

  override haveAllSigned(): boolean {
    if (!this.application.value) {
      return false
    }

    let noOfShareholdersSignature = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "shareholder"
    }).length

    return noOfShareholdersSignature === this.totalNumberOfShareholders.value
  }

  isSignedBeforeExpiry(): boolean {
    if (!this.application.value || this.application.value.signatureGroups.length <= 0) {
      return false
    }

    let signatures = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "shareholder"
    })

    if (signatures.length <= 0) {
      return false
    }

    let sorted = ObjectUtil.sort<SignatureGroup>(signatures, "createdAt", "desc")
    let lastSignatureReceived = this.dayjs(sorted[0].createdAt ?? "").endOf("day")
    let expiryDate = this.dayjs(this.companyShareIssuance.value.startDate)
      .add(this.companyShareIssuance.value.noticePeriod, "days")
      .endOf("day")

    return lastSignatureReceived.isBefore(expiryDate)
  }

  noticeStatus(): string {
    if (!this.application.value) {
      return ""
    }

    if (this.haveAllSigned() && this.isSignedBeforeExpiry()) {
      return this.language.isMalay() ? "Maklumbalas Pemegang Saham Diterima" : "Shareholders Responded"
    }

    if (this.hasNoticeExpired()) {
      return this.language.isMalay() ? "Tempoh Notis Tamat" : "Notice Period Ended"
    }

    return this.language.isMalay() ? "Menunggu Tindakan" : "Awaiting Responses"
  }

  noticeStatusSublabel(): string {
    if (!this.application.value) {
      return ""
    }

    if (this.haveAllSigned() && this.isSignedBeforeExpiry()) {
      return this.lastSignatureDate()
    }

    if (this.hasNoticeExpired()) {
      return this.expiryDate()
    }

    return ""
  }

  hasNoticeExpired(): boolean {
    if (!this.hasPaid) {
      return false
    }

    let dayjs = useDayjs()
    let expiryDate = dayjs(this.companyShareIssuance.value.startDate)
      .add(this.companyShareIssuance.value.noticePeriod, "days")
      .endOf("day")
    let today = dayjs().startOf("day")

    return today.isAfter(expiryDate)
  }

  isMajorityReached(): boolean {
    if (!this.application.value) {
      return false
    }

    let totalSigned = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "director"
    }).length

    let percentage = Math.ceil((totalSigned / this.totalNumberOfDirectors.value) * 100)

    return percentage >= 50
  }

  override isStepStatusVisible(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.paidAt !== null && this.isMajorityReached()
  }

  signatureDate(): string {
    if (!this.application.value) {
      return ""
    }

    if (this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    if (this.isMajorityReached()) {
      let shareholderSignatures = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
        return sg.group?.target === "shareholder"
      })

      if (shareholderSignatures.length > 0) {
        let sorted = ObjectUtil.sort<SignatureGroup>(shareholderSignatures, "createdAt", "desc")

        return this.time.formatDateOnlyShort(sorted[0].createdAt ?? "")
      }
    }

    if (this.hasSigned()) {
      return this.userSignatureDate()
    }

    return ""
  }

  confirmationButtonAcceptLabel(): string {
    return this.language.isMalay() ? "Terbit" : "Issue"
  }

  confirmationButtonRevokeLabel(): string {
    return this.language.isMalay() ? "Tarik Balik" : "Withdraw"
  }

  confirmationCopywriting(): string {
    if (this.isConfirmationRequired) {
      return this.language.isMalay()
        ? "PRN telah disampaikan. Klik pada Terbit untuk meneruskan."
        : "PRN have been served. Click on Issue to proceed."
    }

    if (this.isIssued) {
      return this.language.isMalay()
        ? "DCR dan PRN ini sedang berkuat kuasa."
        : "This DCR and PRN are in effect. Issuance is in progress."
    }

    return this.language.isMalay()
      ? "DCR dan PRN ini telah ditarik balik."
      : "This DCR and PRN have been withdrawn. Initiate another to allot new shares."
  }

  async onWithdrawClicked(): Promise<void> {
    // confirmation is needed
  }

  onIssuanceClicked(): void {
    this.emitEvents(EmitMessages.ISSUE, this.companyShareIssuance.value.id)
  }

  get isConfirmationRequired(): boolean {
    return !this.isIssued && !this.isWithdrawn
  }

  get isIssued(): boolean {
    return this.companyShareIssuance.value.status === StatusConstants.ISSUED
  }

  get isWithdrawn(): boolean {
    return this.companyShareIssuance.value.status === StatusConstants.WITHDRAWN
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyShareIssuance() : this.companyShareIssuance.value
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
      this.isMajorityReached(),
      this.hasSigned(),
      this.signatureDate(),
      true, // dcr check
      true, // prn check
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      this.isMajorityReached(),
      false,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      isInPreviewMode,
      this.isSubmitting.value,
      CompanyShareIssuance,
      useCompanyShareIssuanceStore(),
      false,
      true
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyShareIssuance>(
      this.companyId,
      this.companyShareIssuance.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }

  override loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  override loaderSublabel(): string {
    return this.language.isMalay() ? "Resolusi & Notis Anda" : "Resolution & Notices"
  }
}
