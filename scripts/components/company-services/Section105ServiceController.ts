import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { ShareType } from "~/scripts/constants/Shareholder"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { Filter } from "~/scripts/library/Filter"
import { StatusConstants } from "~/scripts/constants/Status"
import { CompanyShareTransferDetail } from "~/scripts/models/CompanyShareTransferDetail"
import type { Shareholder } from "~/scripts/models/Shareholder"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class Section105ServiceController extends CompanyServiceController<CompanyShareholderTransfer> {
  companyShareholderTransfer = ref<CompanyShareholderTransfer>(new CompanyShareholderTransfer())

  transferDetails = ref<CompanyShareTransferDetail[]>([])

  shareholderId: Ref<string> = ref<string>("")

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyShareholderTransfer, useCompanyShareholderTransferStore(), emitEvents)
    this.target = CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_TRANSFER
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    await Promise.all([this.fetchOngoingApplication(), this.fetchPrice()])

    this.setTransferDetails()

    this.init(this.companyShareholderTransfer.value as CompanyShareholderTransfer)

    this.shareholderId.value = this.shareholders.value[0]?.id
    if (this.isAShareholder.value) {
      this.shareholderId.value =
        this.shareholders.value.find((s: Shareholder) => {
          return s.email === this.currentUser.value.email
        })?.id ?? this.shareholders.value[0]?.id
    }

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
        this.companyShareholderTransfer.value = new CompanyShareholderTransfer()
        this.companyShareholderTransfer.value.companyId = this.companyId
        this.companyShareholderTransfer.value.sharesToTransfer = 1 // minimum to transfer
        this.companyShareholderTransfer.value.shareType = ShareType.Ordinary

        this.companyShareholderTransfer.value.transferDetails.push(new CompanyShareTransferDetail())
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      this.companyShareholderTransfer.value = new CompanyShareholderTransfer(response.data[0])
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

      let lastApplication = new CompanyShareholderTransfer(response)
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

  setTransferDetails(): void {
    this.transferDetails.value = this.companyShareholderTransfer.value.transferDetails.map(
      (d: CompanyShareTransferDetail) => {
        return new CompanyShareTransferDetail(d)
      }
    )

    if (this.transferDetails.value.length === 0) {
      this.transferDetails.value.push(new CompanyShareTransferDetail())
    }
  }

  getShareTransfer(): CompanyShareholderTransfer {
    return this.companyShareholderTransfer.value as CompanyShareholderTransfer
  }

  getFirstTransferDetail(): CompanyShareTransferDetail {
    return this.companyShareholderTransfer.value.transferDetails.length > 0
      ? this.companyShareholderTransfer.value.transferDetails[0]
      : new CompanyShareTransferDetail()
  }

  onWrapperMinimized(applicationData: any): void {
    if (!applicationData) {
      return
    }

    this.companyShareholderTransfer.value = new CompanyShareholderTransfer(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyShareholderTransfer.value)
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
        CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_TRANSFER,
        this.companyShareholderTransfer.value.id
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
    if (StringUtil.isNullOrEmpty(this.companyShareholderTransfer.value.id)) {
      await this.companyShareholderTransfer.value.create(useCompanyShareholderTransferStore())
    } else {
      await this.companyShareholderTransfer.value.update(useCompanyShareholderTransferStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyShareholderTransfer.value.id) || !this.hasPaid()) {
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
    return !StringUtil.isNullOrEmpty(this.companyShareholderTransfer.value.id)
  }

  isDoneLoading(): boolean {
    let isWrapperDoneLoading = this.wrapperRef !== null && this.wrapperRef.isDoneLoading()
    let isDcrDoneLoading = this.dcrRef !== null && !this.dcrRef.isLoading

    return isDcrDoneLoading && isWrapperDoneLoading
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Seksyen 105: Borang Pemindahan Saham" : "Section 105: Form Transfer of Securities"
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

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  override async setTotalPages(): Promise<void> {
    await nextTick()

    this.totalPages.value = this.transferDetails.value.length
  }

  override handleDisplayedPage(): void {
    let page = this.currentPage.value
    let parentComponent = document.querySelector(".documents") as HTMLElement
    if (!parentComponent) {
      return
    }
    let allPapers = parentComponent.querySelectorAll(".paper-wrapper")
    allPapers.forEach((paper: Element, index: number) => {
      let paperElement = paper as HTMLElement
      if (index + 1 === page) {
        paperElement.style.display = "block"
      } else {
        paperElement.style.display = "none"
      }
    })
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyShareholderTransfer() : this.companyShareholderTransfer.value
    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }

    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    let props = new PropsCompanyServiceWrapper(
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
      CompanyShareholderTransfer,
      useCompanyShareholderTransferStore()
    )

    props.serviceStepProps.isPascaInPasca = true
    props.serviceStepProps.hasCustomAffirmation = true

    return props
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyShareholderTransfer>(
      this.companyId,
      this.companyShareholderTransfer.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }

  override onBackButtonClicked(): void {
    this.emitEvents("back")
  }

  // pasca details
  override haveAllSigned(): boolean {
    return this.companyShareholderTransfer.value.transferDetails.every((td: CompanyShareTransferDetail) => {
      return !StringUtil.isNullOrEmpty(td.fromSignatureId) && !StringUtil.isNullOrEmpty(td.toSignatureId)
    })
  }

  get isProcessingTransfer(): boolean {
    return this.haveAllSigned() && this.companyShareholderTransfer.value.status === StatusConstants.PAID
  }
}
