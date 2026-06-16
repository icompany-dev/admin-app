import { PaperOrientation } from "~/scripts/constants/Paper"
import { StatusConstants } from "~/scripts/constants/Status"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { DocumentScaler } from "~/scripts/library/DocumentScaler"
import { StringUtil } from "~/scripts/utils/String"
import { PropsServiceWrapper } from "~/scripts/props/PropsServiceWrapper"
import { CompanyConstants } from "~/scripts/constants/Company"

export class CompanyServiceWrapperController {
  isDocumentEnlarged = ref<boolean>(false)
  isNewApplication: Ref<boolean> = ref<boolean>(true)
  emitEvents: any | null = null

  serviceWrapperRef: HTMLDivElement | null = null
  resolutionRef: any | null = null
  documentWrapperRef: any | null = null
  documentRef: any | null = null
  overlayRef: any | null = null
  helpButtonRef: any | null = null
  deleteApplicationRef: any | null = null
  serviceCtaRef: any | null = null
  serviceStepsRef: any | null = null
  documentSlipCaseRef: any | null = null
  ongoingApplicationAlertRef: any | null = null
  serviceStepsComponentRef: any | null = null

  documentViewMode: Ref<string> = ref<string>(ViewMode.Shrouded)
  isHoverDocument = ref<boolean>(false)
  isOverlayVisible = ref<boolean>(true)
  isShowOverlayInstruction = ref<boolean>(false)

  paperOrientation: Ref<PaperOrientation> = ref<PaperOrientation>(PaperOrientation.Portrait)

  application: any | null = null // This serves just for the ui purposes

  serviceWrapperConfig = ref<PropsServiceWrapper>(new PropsServiceWrapper("", "", null, null, null))

  // orientation: PaperOrientation = PaperOrientation.Portrait

  viewType: Ref<string> = ref<string>("")
  hasOngoingApplication: Ref<boolean> = ref<boolean>(false)
  hasPastApplications: Ref<boolean> = ref<boolean>(false)

  isSubmittingDocument: Ref<boolean> = ref<boolean>(false)

  customPaymentInstructions: Ref<string> = ref<string>("")

  language = useLanguage()
  eventManager = useEventManagerStore()

  resolutionContainerStyle: Ref<string> = ref<string>("")

  constructor(
    application: any | null,
    serviceWrapperConfig: PropsServiceWrapper,
    viewType: string,
    hasOngoingApplication: boolean,
    hasPastApplications: boolean,
    paperOrientation: PaperOrientation,
    emitEvents: any | null
  ) {
    this.emitEvents = emitEvents
    this.eventManager.setIsDocumentActive(false)
    this.setApplication(application)
    this.setServiceWrapperConfig(serviceWrapperConfig)
    this.setViewType(viewType)
    this.setHasOngoingApplication(hasOngoingApplication)
    this.setHasPastApplications(hasPastApplications)
    this.setPaperOrientation(paperOrientation)
  }

  setApplication(application: any): void {
    this.application = application

    this.showOngoingApplicationAlert()

    if (this.serviceWrapperConfig.value.target === CompanyConstants.TARGET_BO_DECLARATION) {
      if (!this.application || StringUtil.isNullOrEmpty(this.application.id)) {
        this.documentViewMode.value = ViewMode.Shrouded
        this.isShowOverlayInstruction.value = false
        return
      }

      this.documentViewMode.value = ViewMode.Edit
      this.resolutionContainerStyle.value = this.getResolutionContainerStyle()
      return
    }

    if (!this.application || !this.application.status) {
      this.documentViewMode.value = ViewMode.Shrouded
      this.isShowOverlayInstruction.value = false
      this.resolutionContainerStyle.value = this.getResolutionContainerStyle()
      return
    }

    if (
      this.application.status === StatusConstants.DRAFT ||
      this.application.status === StatusConstants.PENDING ||
      this.application.status === StatusConstants.COMPLETED
    ) {
      this.documentViewMode.value = ViewMode.Shrouded
      this.isShowOverlayInstruction.value = false
      this.resolutionContainerStyle.value = this.getResolutionContainerStyle()
      return
    }

    this.documentViewMode.value = ViewMode.Edit
    this.emitEvents("viewModeChanged", this.documentViewMode.value)
    this.resolutionContainerStyle.value = this.getResolutionContainerStyle()
  }

  setServiceWrapperConfig(serviceWrapperProps: PropsServiceWrapper): void {
    this.serviceWrapperConfig.value = serviceWrapperProps
  }

  setServiceWrapperRef(serviceWrapperRef: HTMLDivElement | null): void {
    this.serviceWrapperRef = serviceWrapperRef
  }

  setResolutionRef(resolutionRef: any): void {
    this.resolutionRef = resolutionRef
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  setDocumentWrapperRef(documentWrapperRef: any): void {
    this.documentWrapperRef = documentWrapperRef
  }

  setOverlayRef(overlayRef: any): void {
    this.overlayRef = overlayRef
  }

  setHelpButtonRef(helpButtonRef: any): void {
    this.helpButtonRef = helpButtonRef
  }

  setDeleteApplicationRef(deleteApplicationRef: any): void {
    this.deleteApplicationRef = deleteApplicationRef
  }

  setServiceCtaRef(serviceCtaRef: any): void {
    this.serviceCtaRef = serviceCtaRef
  }

  setServiceStepsRef(serviceStepsRef: any): void {
    this.serviceStepsRef = serviceStepsRef
  }

  setDocumentSlipCaseRef(documentSlipCaseRef: any): void {
    this.documentSlipCaseRef = documentSlipCaseRef
  }

  setOngoingApplicationAlertRef(ongoingApplicationAlertRef: any): void {
    this.ongoingApplicationAlertRef = ongoingApplicationAlertRef
  }

  setServiceStepsComponentRef(serviceStepsComponentRef: any): void {
    this.serviceStepsComponentRef = serviceStepsComponentRef
  }

  setDocumentViewMode(documentViewMode: string): void {
    this.documentViewMode.value = documentViewMode
  }

  setDocumentHover(isHoverDocument: boolean): void {
    this.isHoverDocument.value = isHoverDocument

    if (!this.isHoverDocument.value) {
      this.isOverlayVisible.value = true
    }
  }

  setViewType(viewType: string): void {
    this.viewType.value = viewType
  }

  setHasOngoingApplication(hasOngoingApplication: boolean): void {
    this.hasOngoingApplication.value = hasOngoingApplication

    setTimeout(() => {
      this.showOngoingApplicationAlert()
    }, 500)
  }

  setHasPastApplications(hasPastApplications: boolean): void {
    this.hasPastApplications.value = hasPastApplications
  }

  setPaperOrientation(paperOrientation: PaperOrientation): void {
    this.paperOrientation.value = paperOrientation
    this.resolutionContainerStyle.value = this.getResolutionContainerStyle()
  }

  setCustomPaymentInstructions(instruction: string): void {
    this.customPaymentInstructions.value = instruction
  }

  enlarge(): void {
    this.isDocumentEnlarged.value = true
    this.serviceWrapperConfig.value.isShowing = true
    document.body.style.overflow = "hidden"
  }

  minimize(applicationData: any): void {
    this.documentViewMode.value = ViewMode.Edit
    this.isDocumentEnlarged.value = false
    this.serviceWrapperConfig.value.isShowing = false
    document.body.style.overflow = "auto"
    this.isSubmittingDocument.value = applicationData !== null
    this.emitEvents("minimized", applicationData)

    // NOTE (Bahiyah): This is just a temporary solution. We need to find out the root cause.
    // safe proof in case this get stuck in loop
    setTimeout(() => {
      if (!this.isSubmittingDocument.value) {
        return
      }

      this.onApplicationUpdated(applicationData)
    }, 10000)
  }

  onApplicationUpdated(applicationData: any): void {
    this.isSubmittingDocument.value = false
    this.emitEvents("applicationUpdated", applicationData)
  }

  onMakePayment(): void {
    this.isDocumentEnlarged.value = false
    this.emitEvents("pay")
    this.emitEvents("refresh")
  }

  setServiceStepsPosition(): void {
    setTimeout(() => {
      // Delay JS dependant style based on layout transitions delay
      if (!this.serviceStepsRef || !this.documentRef) {
        return
      }

      const resolutionRect = this.documentRef.getBoundingClientRect()
      const parentRect = this.serviceStepsRef.parentElement.getBoundingClientRect()

      const relativeRight = resolutionRect.right - parentRect.left
      this.serviceStepsRef.style.left = `${relativeRight + 50}px`
    }, 500)
  }

  showOngoingApplicationAlert(): void {
    if (!this.ongoingApplicationAlertRef) {
      return
    }

    if (this.viewType.value !== ViewMode.New) {
      this.ongoingApplicationAlertRef.hide()
    }

    if (this.ongoingApplicationAlertRef && this.viewType.value === ViewMode.New && this.hasOngoingApplication.value) {
      this.ongoingApplicationAlertRef.show()
    }
  }

  getDocumentScale(): number {
    let documentScaler = new DocumentScaler(this.paperOrientation.value) // will need to change depending on what is on the page
    let scale = documentScaler.scaleFactor

    if (this.documentViewMode.value === ViewMode.Enlarged) {
      const targetWidth = window.innerWidth * 0.9
      scale = targetWidth / this.paperWidthInPx()
    }

    return scale
  }

  paperHeightInPx(): number {
    if (this.paperOrientation.value === PaperOrientation.Landscape) {
      return (210 / 25.4) * 96
    }

    return (297 / 25.4) * 96
  }

  paperWidthInPx(): number {
    if (this.paperOrientation.value === PaperOrientation.Landscape) {
      return (297 / 25.4) * 96
    }

    return (210 / 25.4) * 96
  }

  getDocumentContainerStyle(): string {
    if (this.documentViewMode.value === ViewMode.Preview) {
      let width = this.paperOrientation.value === PaperOrientation.Landscape ? 297 : 210
      return `width: ${width}mm;` // big size
    }

    let scale = this.getDocumentScale()
    let scaledHeight = this.paperHeightInPx() * scale
    let scaledWidth = this.paperWidthInPx() * scale

    if (this.documentViewMode.value === ViewMode.Enlarged) {
      let papers = document.querySelectorAll(".paper:not(.receipt-paper)")
      let totalPages = Math.max(papers.length, 1)
      let height = scaledHeight * totalPages + 100 //add padding bottomm

      return `width: ${scaledWidth}px; height: ${height}px;`
    }

    return `width: ${scaledWidth}px; height: ${scaledHeight}px; overflow-y: hidden`
  }

  getDocumentContentStyle(): string {
    if (this.documentViewMode.value === ViewMode.Preview) {
      return ""
    }

    let scale = this.getDocumentScale()

    return `transform: scale(${scale});`
  }

  getResolutionContainerStyle(): string {
    if (this.documentViewMode.value === ViewMode.Preview || this.documentViewMode.value === ViewMode.Enlarged) {
      return "height: fit-content;" // big size
    }

    let scale = this.getDocumentScale()

    let scaledHeight = this.paperHeightInPx() * scale
    let scaledWidth = this.paperWidthInPx() * scale

    return `width: ${scaledWidth}px; height: ${scaledHeight}px; overflow-y: hidden;`
  }

  getOverlayStyle(): string {
    if (this.documentViewMode.value !== ViewMode.Shrouded && this.documentViewMode.value !== ViewMode.Edit) {
      return "" // big size
    }

    let scale = this.getDocumentScale()
    let scaledWidth = this.paperWidthInPx() * scale
    let scaledHeight = this.paperHeightInPx() * scale

    return `width: ${scaledWidth}px; left: calc(50% - ${scaledWidth / 2}px); height: ${scaledHeight}px;`
  }

  getSlipCaseStyle(): string {
    let scale = this.getDocumentScale()
    let slipCasePadding = 0
    let scaledWidth = this.paperWidthInPx() * scale - slipCasePadding
    return `width: ${scaledWidth}px; left: calc(50% - ${scaledWidth / 2 + slipCasePadding / 2}px); overflow: hidden; bottom: 30px;`
  }

  onWindowResize(): void {
    this.setServiceStepsPosition()
  }

  onDeleteClicked(): void {
    if (!this.deleteApplicationRef) {
      return
    }

    this.deleteApplicationRef.show()
  }

  isOverlayHidden(): boolean {
    if (
      this.isShowOverlayInstruction.value ||
      this.documentViewMode.value === ViewMode.Shrouded ||
      this.isSubmittingDocument.value
    ) {
      return false
    }

    if (!this.isDocumentShrouded() || this.viewType.value === ViewMode.Existing) {
      return true
    }

    return !this.isOverlayVisible.value
  }

  isShowDocument(): boolean {
    if (this.viewType.value === ViewMode.New) {
      return true
    }

    return this.viewType.value === ViewMode.Existing && this.hasOngoingApplication.value
  }

  isShowNoRecord(): boolean {
    if (this.viewType.value === ViewMode.New) {
      return false
    }

    return this.viewType.value === ViewMode.Existing && !this.hasOngoingApplication.value
  }

  isShowPastApplications(): boolean {
    return this.viewType.value === ViewMode.Past
  }

  isDoneLoading(): boolean {
    if (!this.serviceCtaRef) {
      return true
    }

    return this.serviceCtaRef.isLoading
  }

  isHideOtherElements(): boolean {
    return this.documentViewMode.value !== ViewMode.Shrouded
  }

  isDocumentShrouded(): boolean {
    if (this.application && this.application.status === StatusConstants.COMPLETED) {
      return false
    }

    return this.documentViewMode.value === ViewMode.Shrouded
  }

  shroudLabel(): string {
    if (this.isShowOverlayInstruction.value) {
      if (!StringUtil.isNullOrEmpty(this.customPaymentInstructions.value)) {
        return this.customPaymentInstructions.value
      }

      return this.language.isMalay()
        ? "Selepas pembayaran dibuat, anda boleh melengkapkan butiran dan menandatangan untuk meneruskan proses."
        : "After payment, you can complete the details and sign to proceed."
    }

    return this.language.isMalay() ? "Klik untuk Lihat Dokumen" : "Click to Preview"
  }

  submittingDocumentLabel(): string {
    return this.language.isMalay() ? "Sedang Mengesahkan" : "Confirming"
  }

  submittingDocumentSublabel(): string {
    return this.language.isMalay() ? "Butiran dan Tandatangan" : "Details and Signatures"
  }

  handleDocumentClicked(): void {
    if (this.isSubmittingDocument.value) {
      return
    }

    if (this.documentViewMode.value === ViewMode.Shrouded) {
      if (window.innerWidth > 500) {
        this.documentViewMode.value = ViewMode.Preview
        this.eventManager.setIsDocumentPreview(true)
        this.emitEvents("preview")
      } else {
        this.eventManager.setIsDocumentActive(true)
        this.documentViewMode.value = ViewMode.Enlarged
      }

      this.isShowOverlayInstruction.value = true
      this.resolutionContainerStyle.value = this.getResolutionContainerStyle()

      return
    }

    if (this.documentViewMode.value === ViewMode.Preview) {
      this.resolutionContainerStyle.value = this.getResolutionContainerStyle()
      this.eventManager.setIsDocumentActive(true)
      this.eventManager.setIsDocumentPreview(false)
      this.isShowOverlayInstruction.value = true
      this.documentViewMode.value = ViewMode.Enlarged
      return
    }

    if (this.documentViewMode.value === ViewMode.Enlarged) {
      this.eventManager.setIsDocumentActive(false)

      // this.documentViewMode.value = ViewMode.Shrinking
      this.isShowOverlayInstruction.value = false
      setTimeout(() => {
        this.documentViewMode.value = ViewMode.Shrouded
        this.emitEvents("shrouded")

        if (this.isHoverDocument.value) {
          this.isOverlayVisible.value = false
        }

        this.resolutionContainerStyle.value = this.getResolutionContainerStyle()
      }, 700)

      return
    }

    if (this.documentViewMode.value === ViewMode.Edit) {
      this.documentViewMode.value = ViewMode.Expand
      this.enlarge()
      return
    }
  }

  onPreviewClicked(): void {
    this.documentViewMode.value = ViewMode.Preview
    this.emitEvents("preview")
  }

  handleEscapePreviewMode(): void {
    this.documentViewMode.value = ViewMode.Shrouded
    this.emitEvents("shrouded")
  }

  hideSlipCase(): boolean {
    return this.documentViewMode.value !== ViewMode.Shrouded
  }

  hideServiceOptionButtons(): boolean {
    return this.documentViewMode.value === ViewMode.Enlarged
  }

  hideHelpButton(): boolean {
    return this.documentViewMode.value === ViewMode.Preview || this.documentViewMode.value === ViewMode.Enlarged
  }

  isInPreviewOrEnlargedMode(): boolean {
    return this.documentViewMode.value === ViewMode.Preview || this.documentViewMode.value === ViewMode.Enlarged
  }

  showApplication(): boolean {
    if (this.isNewApplication.value) {
      return true
    }

    return !StringUtil.isNullOrEmpty(this.application.id)
  }

  showNoRecord(): boolean {
    if (this.isNewApplication.value) {
      return false
    }

    return StringUtil.isNullOrEmpty(this.application.id)
  }

  showCornerButton(): boolean {
    const isInPreviewMode =
      this.documentViewMode.value === ViewMode.Preview || this.documentViewMode.value === ViewMode.Enlarged
    const hasNotPaid =
      this.application && this.application.status !== StatusConstants.COMPLETED && !this.application.hasPaid
    return isInPreviewMode && hasNotPaid
  }

  showResolution(): boolean {
    return (
      this.viewType.value === ViewMode.New ||
      (this.viewType.value === ViewMode.Existing && this.hasOngoingApplication.value)
    )
  }

  cornerBtnClass(): string {
    if (this.documentViewMode.value === ViewMode.Enlarged) {
      return "show enlarged"
    }

    if (this.showCornerButton()) {
      return "show"
    }

    return ""
  }

  noRecordFoundTitle(): string {
    if (this.viewType.value === ViewMode.Existing) {
      return this.language.isMalay() ? "Tiada Permohonan Sediada" : "No Existing Application found."
    }

    return this.language.isMalay() ? "Tiada Permohonan Terdahulu" : "No Record of Past Applications"
  }

  noRecordFoundSubtitle(): string {
    if (this.viewType.value === ViewMode.Existing) {
      return this.language.isMalay()
        ? "Sila buat bayaran untuk memulakan permohonan baharu."
        : "Please make payment to create a new application."
    }

    return this.language.isMalay()
      ? "Permohonan terdahulu akan disenaraikan di sini apabila proses selesai."
      : "Past applications will be listed here when the process is completed."
  }

  noRecordFoundCtaLabel(): string {
    return this.language.isMalay() ? "Buat Baru" : "Create New"
  }

  async handleAccept(): Promise<void> {
    if (!this.application) {
      return
    }

    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 14,
      sameSite: "lax" as const,
      path: "/", // CRITICAL for S3/Cloudflare sub-routes
      secure: true, // Always true for Cloudflare HTTPS
    }
    let cookieName = `cosec_application_${this.application.id}_confirmed`

    const cookie = useCookie<string | null>(cookieName, cookieOptions)
    cookie.value = "true"

    if (this.serviceStepsComponentRef) {
      this.serviceStepsComponentRef.setValues()
    }
  }

  get serviceWrapperProps() {
    return new PropsServiceWrapper(
      this.serviceWrapperConfig.value.companyId,
      this.serviceWrapperConfig.value.target,
      this.serviceWrapperConfig.value.targetId,
      this.isDocumentEnlarged.value,
      this.serviceWrapperConfig.value.isInPreviewMode
    )
  }
}
