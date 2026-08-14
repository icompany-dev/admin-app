import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { CompanyShareholderTransferNotice } from "~/scripts/models/CompanyShareholderTransferNotice"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { ShareType } from "~/scripts/constants/Shareholder"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { Filter } from "~/scripts/library/Filter"
import { StatusConstants } from "~/scripts/constants/Status"
import { Shareholder } from "~/scripts/models/Shareholder"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class NoticeTransferOfSharesServiceController extends CompanyServiceController<CompanyShareholderTransfer> {
  companyShareholderTransfer = ref<CompanyShareholderTransfer>(new CompanyShareholderTransfer())
  companyShareholderTransferNotice = ref<CompanyShareholderTransferNotice>(new CompanyShareholderTransferNotice())

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, false, true, CompanyShareholderTransfer, useCompanyShareholderTransferStore(), emitEvents)
    this.target = CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_TRANSFER

    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true
    if (this.viewType.value !== ViewMode.Past) {
      this.isInPreviewMode.value = false
      await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])
    } else {
      this.isInPreviewMode.value = true
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
      this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
    }

    this.init(new CompanyShareholderTransfer(this.companyShareholderTransfer.value))

    this.setTotalPages()
    this.isLoading.value = false
  }

  override async fetchShareholders(): Promise<void> {
    try {
      let response = await this.shareholderRepository.fetchAllForCompany(this.companyId)
      if (this.shareholderRepository.error !== null) {
        throw this.shareholderRepository.error
      }

      this.shareholders.value = response.map((s: any) => {
        return new Shareholder(s)
      })
      this.totalNumberOfShareholders.value = this.shareholders.value.length
      this.isAShareholder.value = this.shareholders.value.some((shareholder: Shareholder) => {
        return shareholder.email === this.currentUser.value.email
      })
      this.totalPages.value = this.shareholders.value.length * 2 //Each notice has 2 pages
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    }
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

      let noticeRepository = useCompanyShareholderTransferNoticeStore()

      if (response.totalRecords <= 0) {
        let noticeResponses = await noticeRepository.fetchAll(filter)
        if (noticeResponses.totalRecords > 0) {
          this.companyShareholderTransferNotice.value = new CompanyShareholderTransferNotice(noticeResponses.data[0])

          let transferResponse = await this.repository.fetch(this.companyShareholderTransferNotice.value.transferId)
          this.companyShareholderTransfer.value = new CompanyShareholderTransfer(transferResponse)

          this.isInPreviewMode.value = false
        } else {
          this.companyShareholderTransfer.value = new CompanyShareholderTransfer()
          this.companyShareholderTransfer.value.companyId = this.companyId
          this.companyShareholderTransfer.value.sharesToTransfer = 1 // minimum to transfer
          this.companyShareholderTransfer.value.shareType = ShareType.Ordinary
          this.companyShareholderTransfer.value.isInitiatedByDirector = true // Set to require notice all the time

          this.companyShareholderTransferNotice.value = new CompanyShareholderTransferNotice()
          this.hasOngoingApplication.value = false
          this.viewType.value = ViewMode.New
          return
        }
      }

      this.companyShareholderTransfer.value = new CompanyShareholderTransfer(response.data[0])

      let noticeResponse = await noticeRepository.fetchForTransfer(this.companyShareholderTransfer.value.id)
      if (noticeRepository.error !== null) {
        throw noticeRepository.error
      }
      this.companyShareholderTransferNotice.value = new CompanyShareholderTransferNotice(noticeResponse)
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

      let lastApplication = new CompanyShareholderTransfer(response)
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

  getShareTransfer(): CompanyShareholderTransfer {
    return new CompanyShareholderTransfer(this.companyShareholderTransfer.value)
  }

  getNotice(): CompanyShareholderTransferNotice {
    return new CompanyShareholderTransferNotice(this.companyShareholderTransferNotice.value)
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

  async onApplicationUpdated(application: CompanyShareholderTransfer): Promise<void> {
    if (!application) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyShareholderTransfer.value)
    }
  }

  setApplicationData(applicationData: CompanyShareholderTransfer): void {
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

      await this.submitApplication()
      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES,
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
      this.companyShareholderTransfer.value.companyId = this.companyId
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

    let label = this.language.isMalay() ? "Notis Pemindahan Saham" : "Notice Transfer of Shares"
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Notis Pemindahan Saham" : "Notice Transfer of Shares"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Notis Pemindahan Saham adalah untuk memberitahu semua pemegang saham sedia ada mengenai saham yang akan dipindahkan.
        Pemindahan ini boleh dilakukan kepada pemegang saham sedia ada atau kepada pihak ketiga. Penjual dan/atau pembeli
        mempunyai hak untuk menerima atau menolak pemindahan selepas menerima makluman ini.
        <br><br>
        Notis ini akan dihantar bersama-sama dengan Instrumen Pemindahan (Seksyen 105).
      `
    }

    return `
      Notice of Intention to Transfer Shares is to notify all existing shareholders of shares to be transferred. 
      This transfer can be to an existing shareholder or to a third party. Transferors and/or transferees reserve
      the rights to accept or reject the transfer after receiving this notice.
      <br><br>
      This Notice will be served together with the Instrument of Transfer (Section 105). 
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
    return this.language.isMalay() ? "Notis: Pemindahan Saham" : "Notice: Transfer of Shares"
  }

  slipCaseContentPoints(): string[] {
    if (this.language.isMalay()) {
      return [
        "Notis Pemindahan Saham adalah <b>langkah pertama yang diperlukan</b>. Ia tidak memindahkan sebarang saham lagi — ia hanya memberi kuasa kepada Syarikat untuk memulakan proses pemindahan dan memberitahu pemegang saham sedia ada.",
        "Dengan mengakui notis tersebut, dan memberi persetujuan kepada pemindahan (jika Penjual / Pembeli), dan penyempurnaan Instrumen Pemindahan, Syarikat boleh meneruskan dengan langkah seterusnya.",
      ]
    }

    return [
      "The Notice to Transfer Shares is the <b>first required step</b>. It does not transfer any shares yet — it simply authorises the Company to begin the transfer process and to notify existing shareholders.",
      "By acknowledging the notice, and consenting to the transfer (if Transferor / Transferee), and the completion of Instrument of Transfer, the Company can proeed with the next steps.",
    ]
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Maklumat Lanjut: Notis Pemindahan Saham" : "Learn More: Notice to Transfer Shares"
  }

  alertContentPoints(): string[] {
    if (this.language.isMalay()) {
      return [
        "Notis Pemindahan Saham adalah <b>langkah pertama yang diperlukan</b>. Ia tidak memindahkan sebarang saham lagi — ia hanya memberi kuasa kepada Syarikat untuk memulakan proses pemindahan dan memberitahu pemegang saham sedia ada.",
        "Dengan mengakui notis tersebut, dan memberi persetujuan kepada pemindahan (jika Penjual / Pembeli), dan penyempurnaan Instrumen Pemindahan, Syarikat boleh meneruskan dengan langkah seterusnya.",
      ]
    }

    return [
      "The Notice to Transfer Shares is the <b>first required step</b>. It does not transfer any shares yet — it simply authorises the Company to begin the transfer process and to notify existing shareholders.",
      "By acknowledging the notice, and consenting to the transfer (if Transferor / Transferee), and the completion of Instrument of Transfer, the Company can proeed with the next steps.",
    ]
  }

  override loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  override loaderSublabel(): string {
    return this.language.isMalay() ? "Notis Anda" : "Notices"
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  override async setTotalPages(): Promise<void> {
    return
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
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyShareholderTransfer.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyShareholderTransfer.value.id,
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
      this.isInPreviewMode.value,
      this.isSubmitting.value,
      CompanyShareholderTransferNotice,
      useCompanyShareholderTransferNoticeStore()
    )
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
}
