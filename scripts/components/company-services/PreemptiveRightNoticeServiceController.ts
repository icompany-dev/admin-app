import { CompanyShareIssuance } from "~/scripts/models/CompanyShareIssuance"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { Filter } from "~/scripts/library/Filter"
import { ShareType } from "~/scripts/constants/Shareholder"
import { StatusConstants } from "~/scripts/constants/Status"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class PreemptiveRightNoticeServiceController extends CompanyServiceController<CompanyShareIssuance> {
  companyShareIssuance = ref<CompanyShareIssuance>(new CompanyShareIssuance())

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyShareIssuance, useCompanyShareIssuanceStore(), emitEvents)
    this.target = CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyShareIssuance.value = new CompanyShareIssuance(this.companyServiceInitializer.newApplication)
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
          this.setViewType(ViewMode.Existing) // this service will not have split existing and new application views
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
        this.companyShareIssuance.value = new CompanyShareIssuance(this.companyServiceInitializer.existingApplication)
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyShareIssuance.value as CompanyShareIssuance)
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
        this.hasPastApplications.value = false
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, false)
        return
      }

      let lastApplication = new CompanyShareIssuance(response)
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
    if (!applicationData) {
      return
    }

    this.companyShareIssuance.value = new CompanyShareIssuance(applicationData)
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
      await this.companyShareIssuance.value.create(useCompanyShareIssuanceStore())
    } else {
      await this.companyShareIssuance.value.update(useCompanyShareIssuanceStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (!StringUtil.isNullOrEmpty(this.companyShareIssuance.value.id) && !this.hasPaid()) {
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

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
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
      CompanyShareIssuance,
      useCompanyShareIssuanceStore()
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
}
