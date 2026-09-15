import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
import { CompanyShareIssuance } from "~/scripts/models/CompanyShareIssuance"
import { CompanyShareAuthorization } from "~/scripts/models/CompanyShareAuthorization"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { AllotShares } from "~/scripts/library/AllotShares"
import { CompanyShareholderAllotmentDetail } from "~/scripts/models/CompanyShareholderAllotmentDetail"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { ObjectUtil } from "~/scripts/utils/Object"
import type { CompanyShareIssuanceResponse } from "~/scripts/models/CompanyShareIssuanceResponse"
import { Toast } from "~/scripts/library/Toast"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { DownloadFileData } from "~/scripts/types/DownloadFileData"
import { FileZipper } from "~/scripts/utils/FileZipper"

export class IssueAndAllotSharesServiceController extends CompanyServiceController<CompanyShareholderAllotment> {
  companyShareholderAllotment = ref<CompanyShareholderAllotment>(new CompanyShareholderAllotment())
  companyShareIssuance = ref<CompanyShareIssuance>(new CompanyShareIssuance())
  companyShareAuthorization = ref<CompanyShareAuthorization>(new CompanyShareAuthorization())

  allotShares = ref<AllotShares>(new AllotShares("", ""))

  isShowPRN: Ref<boolean> = ref<boolean>(false)
  isShowFundsDeclaration: Ref<boolean> = ref<boolean>(false)
  isShowAllotNewShares: Ref<boolean> = ref<boolean>(false)

  isPendingShowPrnExpiryNotice: Ref<boolean> = ref<boolean>(false)

  prepaymentRef: any | null = null
  doNotLieAlertRef: any | null = null
  fileUploaderLinkRef: any | null = null
  noticePrnExpiryRef: any | null = null

  noticeRef: any | null = null

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any) {
    super(companyId, true, true, CompanyShareholderAllotment, useCompanyShareholderAllotmentStore(), emitEvents)

    this.target = CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT
    this.allotShares.value.companyId = this.companyId

    this.setViewType(viewType)
  }

  setPrepaymentRef(prepaymentRef: any): void {
    this.prepaymentRef = prepaymentRef
  }

  setDoNotLieAlertRef(doNotLieAlertRef: any): void {
    this.doNotLieAlertRef = doNotLieAlertRef
  }

  setFileUploaderLinkRef(fileUploaderLinkRef: any): void {
    this.fileUploaderLinkRef = fileUploaderLinkRef
  }

  setNoticePrnExpiryRef(noticePrnExpiryRef: any): void {
    this.noticePrnExpiryRef = noticePrnExpiryRef

    if (this.isPendingShowPrnExpiryNotice.value) {
      this.noticePrnExpiryRef.show()
      this.isPendingShowPrnExpiryNotice.value = false
    }
  }

  async initializeData(): Promise<void> {
    try {
      this.isLoading.value = true

      this.companyShareholderAllotment.value = new CompanyShareholderAllotment()

      if (this.viewType.value !== ViewMode.Past) {
        await this.allotShares.value.init()
        this.price.value = this.allotShares.value.price

        if (!StringUtil.isNullOrEmpty(this.allotShares.value.existingApplication.id)) {
          this.isInPreviewMode.value = false
          this.viewType.value = ViewMode.Existing
          this.hasOngoingApplication.value = true
          this.companyShareholderAllotment.value = new CompanyShareholderAllotment(
            this.allotShares.value.existingApplication
          )
          this.emitEvents(EmitMessages.GO_TO_EXISTING)
        } else {
          this.isInPreviewMode.value = true
          this.viewType.value = ViewMode.New
          this.hasOngoingApplication.value = false
          this.companyShareholderAllotment.value = new CompanyShareholderAllotment()
          this.emitEvents(EmitMessages.GO_TO_NEW)
        }
      } else {
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
      }

      await this.init(this.companyShareholderAllotment.value as CompanyShareholderAllotment)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
      this.handleDisplayedPage()

      if (!StringUtil.isNullOrEmpty(this.companyShareholderAllotment.value.id) && this.hasPaid()) {
        if (this.allotShares.value.isUserPrnResponseRequired) {
          if (this.noticePrnExpiryRef) {
            this.noticePrnExpiryRef.show()
          } else {
            this.isPendingShowPrnExpiryNotice.value = true
          }
        }
      }
    }
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        return // do nothing
      }

      this.companyShareholderAllotment.value = new CompanyShareholderAllotment(apiRecord.data[0])
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    }
  }

  async onApplicationUpdated(data: any): Promise<void> {
    if (!data) {
      return
    }

    await this.allotShares.value.init()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.allotShares.value.existingApplication)
    }
  }

  setApplicationData(applicationData: CompanyShareholderAllotment): void {
    if (!applicationData) {
      return
    }

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyShareholderAllotment.value)
    }
  }

  async makePayment(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      let paymentCart = await this.allotShares.value.makePayment(
        this.companyShareIssuance.value as CompanyShareIssuance,
        this.companyShareholderAllotment.value as CompanyShareholderAllotment
      )

      if (!paymentCart) {
        let errorMessage: Error = new Error()
        errorMessage.setForCUD()
        throw errorMessage
      }

      this.emitEvents(EmitMessages.PAY, paymentCart)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForCUD()
        errorMessage.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async onProceedClicked(): Promise<void> {
    if (this.prepaymentRef) {
      this.prepaymentRef.show()
      return
    }

    await this.makePayment()
  }

  async onProceedMakePayment(data: CompanyShareholderAllotmentDetail): Promise<void> {
    this.companyShareholderAllotment.value.details = new CompanyShareholderAllotmentDetail(data)
    this.companyShareholderAllotment.value.companyId = this.companyId
    this.companyShareholderAllotment.value.shareType = data.typeOfShares
    this.companyShareholderAllotment.value.sharesAllotted = data.numberOfShares

    this.companyShareIssuance.value.companyId = this.companyId
    this.companyShareIssuance.value.shareType = data.typeOfShares
    this.companyShareIssuance.value.sharesToIssue = data.numberOfShares
    this.companyShareIssuance.value.pricePerShare = data.considerationPerShare

    await this.makePayment()
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  setNoticeRef(noticeRef: any): void {
    this.noticeRef = noticeRef
  }

  override hasPaid() {
    return this.allotShares.value.hasPaid()
  }

  override loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing the"
  }

  override loaderSublabel(): string {
    return this.language.isMalay() ? "Proses Peruntukan Saham" : "Process of Allotment"
  }

  override handleDisplayedPage(): void {
    let page = this.currentPage.value
    if (!this.wrapperRef || !this.wrapperRef.$el) {
      return
    }

    let allPapers = this.wrapperRef.$el.querySelectorAll(".paper-wrapper")
    allPapers.forEach((paper: Element, index: number) => {
      let paperElement = paper as HTMLElement

      if (this.documentViewMode.value === ViewMode.Shrouded && !this.hasPaid()) {
        if (index + 1 === page) {
          paperElement.style.display = "block"
        } else {
          paperElement.style.display = "none"
        }
      } else {
        paperElement.style.display = "block"
      }
    })
  }

  onHandleNoticePrnProceedClicked(): void {
    if (this.allotShares.value.hasExpired) {
      return
    }

    this.onShowPrn()
  }

  onDocumentBodyClicked(): void {
    if (!this.isShowingHiddenDocuments) {
      return
    }

    this.onClosePrn()
    this.onCloseDeclaration()
  }

  onShowPrn(): void {
    this.isShowPRN.value = true
  }

  onClosePrn(): void {
    this.isShowPRN.value = false
  }

  onShowDeclaration(): void {
    this.isShowFundsDeclaration.value = true
  }

  onCloseDeclaration(): void {
    this.isShowFundsDeclaration.value = false
  }

  onShowSection78(): void {
    this.isShowAllotNewShares.value = true
  }

  onCloseSection78(): void {
    this.isShowAllotNewShares.value = false
  }

  async onCashInjectionUploaded(fileId: string): Promise<void> {
    try {
      this.companyShareholderAllotment.value.cashInjectionId = fileId

      let repository = useCompanyShareholderAllotmentStore()
      await this.companyShareholderAllotment.value.updateCashInjection(repository)

      let toastTitle = this.language.isMalay() ? "Kami telah terima dokumen anda." : "We have received your document."
      let toastMessage = this.language.isMalay() ? "" : ""

      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    }
  }

  onProceedUploadDocument(): void {
    if (!this.fileUploaderLinkRef) {
      return
    }

    this.fileUploaderLinkRef.onProceedFileClicked()
  }

  onUploadProofOfPaymentClicked(): void {
    if (this.doNotLieAlertRef) {
      this.doNotLieAlertRef.show()
      return
    }
  }

  override async onDownloadClicked(): Promise<void> {
    let pages: HTMLElement[] = []
    let dcrPages: HTMLElement[] = []
    let mcrPages: HTMLElement[] = []
    let prnPages: HTMLElement[] = []

    if (this.dcrRef) {
      dcrPages = await this.dcrRef.getPdfPages()
      pages = pages.concat(dcrPages)
    }

    if (this.mcrRef) {
      mcrPages = await this.mcrRef.getPdfPages()
      pages = pages.concat(mcrPages)
    }

    if (this.noticeRef) {
      prnPages = await this.noticeRef.getPdfPages()
      pages = pages.concat(prnPages)
    }

    if (pages.length <= 0) {
      return
    }

    let dcrFilename = `Directors' Resolution - Propose Allotment of Shares.pdf`
    let mcrFilename = `Members' Resolution - Authority to Allot Shares.pdf`
    let prnFilename = `Section 85 - Preemptive Rights Notices.pdf`

    let dcrBlob = await PdfPaperUtil.getPdfBlob(dcrPages, 20, dcrFilename, PaperSize.A4, PaperOrientation.Portrait)
    let mcrBlob = await PdfPaperUtil.getPdfBlob(mcrPages, 20, dcrFilename, PaperSize.A4, PaperOrientation.Portrait)
    let prnBlob = await PdfPaperUtil.getPdfBlob(prnPages, 20, prnFilename, PaperSize.A4, PaperOrientation.Portrait)

    let files = [
      new DownloadFileData(URL.createObjectURL(dcrBlob), dcrFilename),
      new DownloadFileData(URL.createObjectURL(mcrBlob), mcrFilename),
      new DownloadFileData(URL.createObjectURL(prnBlob), prnFilename),
    ]

    await FileZipper.zipAndDownload(files, `Resolutions and Documents for Allotment of Shares.zip`)
  }

  // getters
  get slipCaseTitle(): string {
    return this.language.isMalay() ? "Peruntukan Saham Baharu" : "Allotment of New Shares"
  }

  get earMarkText(): string {
    return "DCR" // Need to check which one comes first
  }

  get serviceWrapperProps(): PropsCompanyServiceWrapper {
    let props = new PropsCompanyServiceWrapper(
      this.companyShareholderAllotment.value,
      this.companyId,
      this.target,
      this.slipCaseTitle,
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyShareholderAllotment.value.id,
      this.currentPage.value,
      this.totalPages.value,
      this.earMarkText,
      this.viewType.value === ViewMode.Existing,
      this.hasPaid(),
      this.price.value,
      this.hasCompletedAffirmationSteps,
      true,
      "", // has custom affirmation
      true,
      true,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      false,
      false,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      this.isInPreviewMode.value,
      this.isSubmitting.value,
      CompanyShareholderAllotment,
      useCompanyShareholderAllotmentStore()
    )

    props.serviceStepProps.hasCustomAffirmation = true

    return props
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyShareholderAllotment>(
      this.companyId,
      this.companyShareholderAllotment.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }

  get mcrResolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyShareAuthorization>(
      this.companyId,
      this.allotShares.value.existingShareAuthorization.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }

  get isShowMcrFirst(): boolean {
    let route = useRoute()
    if (route.fullPath.includes("shareholders")) {
      return true
    }

    return false
  }

  get isShowHiddenDocuments(): boolean {
    return this.isShowPRN.value || this.isShowFundsDeclaration.value || this.isShowAllotNewShares.value
  }

  get isShowingHiddenDocuments(): boolean {
    return this.isShowPRN.value || this.isShowFundsDeclaration.value || this.isShowAllotNewShares.value
  }

  get isShowingPrn(): boolean {
    return !this.isShowFundsDeclaration.value && !this.isShowAllotNewShares.value
  }

  get alertTitle(): string {
    return this.language.isMalay()
      ? "Maklumat Lanjut: Proses Pra-Peruntukan dan Notis Hak Pra-Beli"
      : "Learn More: Pre-Allotment Process and Pre-Emptive Rights Notice"
  }

  get alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <p>
          Di bawah Seksyen 75 dan 76 Akta Syarikat 2016, Pengarah hanya boleh melaksanakan kuasa untuk memperuntukkan 
          saham atau memberikan hak untuk melanggan saham sekiranya kelulusan terlebih dahulu melalui ketetapan Syarikat 
          telah diperoleh, melainkan jika terdapat pengecualian di bawah Akta tersebut yang terpakai.
        </p>
        <p>
          Ketetapan ini belum lagi menerbitkan saham. Ia hanya memberi kuasa kepada Syarikat untuk memulakan proses 
          peruntukan serta menyediakan dan mengedarkan Notis Hak Pra-Beli kepada Pemegang Saham sedia ada.
        </p>
        <p>
          Notis Hak Pra-Beli memberi peluang kepada Pemegang Saham sedia ada untuk melanggan saham baharu terlebih dahulu 
          sebelum saham tersebut boleh ditawarkan kepada orang lain. Notis berkenaan secara amnya menyatakan bilangan 
          saham, harga terbitan, kelas saham, dan tarikh akhir untuk memberikan maklum balas.
        </p>
        <p>
          Jika Pemegang Saham sedia ada menolak, melepaskan hak, atau gagal memberikan maklum balas dalam tempoh yang 
          ditetapkan, Syarikat boleh meneruskan cadangan peruntukan saham tersebut tertakluk kepada kelulusan yang berkaitan, 
          Perlembagaan Sdn Bhd, dan Akta Syarikat 2016.
        </p>
        <p>
          iCompany Systems hanya memudahkan penyediaan dan pengedaran notis, ketetapan, dan dokumen korporat sokongan yang 
          berkaitan dengan proses peruntukan saham tersebut.
        </p>
      `
    }

    return `
      <p>
        Under Sections 75 and 76 of the Companies Act 2016, Directors may only exercise the power to allot shares or grant rights to 
        subscribe for shares if prior approval by way of resolution of the Company has been obtained, unless an exception under 
        the Act applies.
      </p>
      <p>
        This resolution does not issue shares yet. It only authorises the Company to begin the allotment process and to prepare and 
        circulate the Pre-Emptive Rights Notice to existing Shareholders.
      </p>
      <p>
        The Notice of Pre-Emptive Rights gives existing Shareholders the opportunity to subscribe to the new shares first before the 
        shares may be offered to another person. The notice generally specifies the number of shares, issue price, class of shares, 
        and the deadline to respond.
      </p>
      <p>
        If the existing Shareholders decline, waive, or fail to respond within the stipulated period, the Company may proceed with 
        the proposed allotment subject to the applicable approvals, Constitution of the Sdn Bhd, and the Companies Act 2016.
      </p>
      <p>
        iCompany Systems only facilitates the preparation and circulation of the relevant notices, resolutions, and supporting 
        corporate documents relating to the allotment process.
      </p>
    `
  }

  //PASCA region
  get hasCompletedAffirmationSteps(): boolean {
    return false
  }

  get directorsLabel(): string {
    return this.language.isMalay() ? "Pengarah" : "Directors"
  }

  get directorsRange(): number[] {
    return Array.from({ length: this.totalNumberOfDirectors.value }, (_, i) => i)
  }

  get directorsSignatures(): SignatureGroup[] {
    return this.companyShareholderAllotment.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "director"
    })
  }

  get numberOfDirectorsSignatures(): number {
    return this.directorsSignatures.length
  }

  get membersLabel(): string {
    return this.language.isMalay() ? "Pemegang Saham" : "Members"
  }

  get shareholdersRange(): number[] {
    return Array.from({ length: this.totalNumberOfShareholders.value }, (_, i) => i)
  }

  get shareholdersSignatures(): SignatureGroup[] {
    return this.allotShares.value.existingShareAuthorization.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "shareholder"
    })
  }

  get numberOfShareholdersSignatures(): number {
    return this.shareholdersSignatures.length
  }

  get hasUserSigned(): boolean {
    if (!this.isADirector.value && !this.isAShareholder.value) {
      return false
    }

    let directorSignature =
      this.directorsSignatures.find((sg: SignatureGroup) => {
        return sg.email === this.currentUser.value.email
      }) ?? null

    let shareholderSignature =
      this.shareholdersSignatures.find((sg: SignatureGroup) => {
        return sg.email === this.currentUser.value.email
      }) ?? null

    return directorSignature !== null || shareholderSignature !== null
  }

  get signatureDate(): string {
    if (!this.hasUserSigned) {
      return ""
    }

    let directorSignature =
      this.directorsSignatures.find((sg: SignatureGroup) => {
        return sg.email === this.currentUser.value.email
      }) ?? null
    let shareholderSignature =
      this.shareholdersSignatures.find((sg: SignatureGroup) => {
        return sg.email === this.currentUser.value.email
      }) ?? null

    if (!directorSignature && !shareholderSignature) {
      return ""
    }

    if (!directorSignature && shareholderSignature !== null) {
      return this.time.formatDateOnlyFull(shareholderSignature.createdAt ?? "")
    }

    if (directorSignature && !shareholderSignature) {
      return this.time.formatDateOnlyFull(directorSignature.createdAt ?? "")
    }

    if (directorSignature !== null && shareholderSignature !== null) {
      let signatureGroups = [directorSignature, shareholderSignature]

      let latest = ObjectUtil.sort<SignatureGroup>(signatureGroups, "createdAt", "desc")

      return this.time.formatDateOnlyFull(latest[0].createdAt ?? "")
    }

    return ""
  }

  get signedLabel(): string {
    return this.language.isMalay() ? "Tandatangan diterima" : "Signed"
  }

  get prnLabel(): string {
    return this.language.isMalay() ? "Notis Hak Beli Dahulu" : "Pre-Emptive Notices"
  }

  get prnButtonLabel(): string {
    return this.language.isMalay() ? "Papar" : "View"
  }

  get prnStatusLabel(): string {
    if (this.allotShares.value.hasExpired) {
      return this.language.isMalay() ? "Notis Hak Beli Dahulu" : "The Pre-Emptive Notice has"
    }

    return this.language.isMalay() ? "Notis Hak Beli Dahulu" : "The Pre-Emptive Notice"
  }

  get prnStatuses(): string[] {
    return this.allotShares.value.prnStatuses
  }

  get noticeExpiryLabel(): string {
    if (this.allotShares.value.hasExpired) {
      return this.language.isMalay() ? "Tamat pada" : "Ended on"
    }

    return this.language.isMalay() ? "Tamat pada" : "Ends on"
  }

  get sourceOfFundDeclarationLabel(): string {
    return this.language.isMalay() ? "Pengisytiharan Sumber Dana" : "Source of Funds Declaration"
  }

  get viewSourceOfFundLabel(): string {
    return this.language.isMalay() ? "Papar Pengisytiharan" : "View Declaration"
  }

  get uploadProofOfPaymentLabel(): string {
    return this.language.isMalay() ? "Muat Naik Bukti Bayaran" : "Upload Proof of Payment"
  }

  get fileUploaderPlaceholder(): string {
    return this.language.isMalay() ? "Klik untuk pilih" : "Click to Browse File"
  }

  get returnOfAllotmentLabel(): string {
    return this.language.isMalay() ? "Return of Allotment" : "Return of Allotment"
  }

  get section78ButtonLabel(): string {
    return this.language.isMalay() ? "Papar" : "View"
  }

  get issuanceId(): string {
    return this.allotShares.value.existingIssuance.id
  }
}
