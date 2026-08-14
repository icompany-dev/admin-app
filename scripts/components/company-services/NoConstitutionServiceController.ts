import { CompanyServiceController } from "./CompanyServiceController"
import { CompanyNoConstitutionDeclaration } from "~/scripts/models/CompanyNoConstitutionDeclaration"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { Error } from "~/scripts/library/Error"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { File as UploadedFile } from "~/scripts/models/File"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { StatusConstants } from "~/scripts/constants/Status"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class NoConstitutionServiceController extends CompanyServiceController<CompanyNoConstitutionDeclaration> {
  noConstitution = ref<CompanyNoConstitutionDeclaration>(new CompanyNoConstitutionDeclaration())

  wrapperRef: any | null = null
  declarationRef: any | null = null

  isDeclarationLoaded: Ref<boolean> = ref<boolean>(false)
  hasHandledPostPayment: Ref<boolean> = ref<boolean>(false)

  isDownloading: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(
      companyId,
      false,
      false,
      CompanyNoConstitutionDeclaration,
      useCompanyNoConstitutionDeclarationStore(),
      emitEvents
    )

    this.target = CompanyConstants.TARGET_NO_CONSTITUTION
    this.totalPages.value = 1
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    await Promise.all([this.fetchOngoingApplication(), this.fetchPrice()])

    this.init(this.noConstitution.value as CompanyNoConstitutionDeclaration)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      // they can download if they have paid
      this.ongoingFilter.statuses.push(StatusConstants.PAID, StatusConstants.DELIVERED)
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.noConstitution.value = new CompanyNoConstitutionDeclaration()
        this.noConstitution.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      this.noConstitution.value = new CompanyNoConstitutionDeclaration(apiRecord.data[0])
      await this.handlePostPayment()
      this.hasOngoingApplication.value = true
      this.viewType.value = ViewMode.Existing
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchOngoing()
        errorMessage.handle()
      }
    }
  }

  override handleDisplayedPage(): void {
    let parentComponent = document.querySelector(".documents") as HTMLElement
    if (!parentComponent) {
      return
    }

    let page = this.currentPage.value
    let prefix = `third-schedule`
    if (page > 3) {
      prefix = `declaration`
      page = 1
    }

    let allPapers = parentComponent.querySelectorAll(".paper-wrapper")
    allPapers.forEach((paper: Element) => {
      if (!paper.id) {
        return
      }

      let paperElement = paper as HTMLElement
      paperElement.style.display = "block"
    })
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  setDeclarationRef(declarationRef: any): void {
    this.declarationRef = declarationRef
  }

  isDoneLoading(): boolean {
    return true //TODO: change if there is a need
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
        CompanyConstants.TARGET_NO_CONSTITUTION,
        this.noConstitution.value.id
      )
      await makePayment.setPaymentCart()
      const url = new URL(window.location.href)
      url.searchParams.set("payment.redirect", "true")
      url.searchParams.set("payment.target", this.target)
      url.searchParams.set("payment.id", this.noConstitution.value.id)
      url.searchParams.set("tab", "no-consti-declaration")

      makePayment.paymentCart.redirectUrl = url.toString()

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
    if (!StringUtil.isNullOrEmpty(this.noConstitution.value.id)) {
      return
    }

    let repository = useCompanyNoConstitutionDeclarationStore()
    this.noConstitution.value.companyId = this.companyId
    this.noConstitution.value.purchasedById = this.currentUser.value.id
    this.noConstitution.value.status = StatusConstants.PENDING
    await this.noConstitution.value.create(repository)
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.noConstitution.value.id)) {
      await this.makePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  async onDeclarationLoaded(): Promise<void> {
    this.isDeclarationLoaded.value = true
    await this.handlePostPayment()
  }

  async handlePostPayment(): Promise<void> {
    if (
      !this.isDeclarationLoaded.value ||
      this.hasHandledPostPayment.value ||
      StringUtil.isNullOrEmpty(this.noConstitution.value.id) ||
      StringUtil.isNullOrEmpty(this.noConstitution.value.deliveryMethod) ||
      this.noConstitution.value.isDownloaded ||
      this.noConstitution.value.isEmailed
    ) {
      return
    }

    if (this.noConstitution.value.deliveryMethod === "email") {
      await this.onEmail()
    }

    if (this.noConstitution.value.deliveryMethod === "download") {
      await this.onDownload()
    }

    this.hasHandledPostPayment.value = true
  }

  async onDownload(): Promise<void> {
    if (!this.declarationRef || this.isDownloading.value) {
      return
    }

    try {
      this.isDownloading.value = true
      let paperElements = await this.declarationRef.getPaperElements()
      let clonedElements = paperElements.map((el: HTMLElement) => el.cloneNode(true) as HTMLElement)
      let filename = `${this.noConstitution.value.company?.getFullName()} Declaration of No Constitution.pdf`
      await PdfPaperUtil.generatePdfFile(clonedElements, 0, filename, PaperSize.A4, PaperOrientation.Portrait)

      let repository = useCompanyNoConstitutionDeclarationStore()
      await this.noConstitution.value.download(repository)
    } catch (e) {
      // do nothing
    } finally {
      this.isDownloading.value = false
    }
  }

  async onEmail(): Promise<void> {
    if (!this.declarationRef) {
      return
    }

    try {
      let paperElements = this.declarationRef.getPaperElements()
      let clonedElements = paperElements.map((el: HTMLElement) => el.cloneNode(true) as HTMLElement)

      let filename = `${this.noConstitution.value.company?.getFullName()} Declaration of No Constitution.pdf`
      let pdfBlob = await PdfPaperUtil.getPdfBlob(clonedElements, 0, filename, PaperSize.A4, PaperOrientation.Portrait)
      let pdfFile = new File([pdfBlob], filename, {
        type: "application/pdf",
      })

      let uploadedFile = new UploadedFile()
      await uploadedFile.uploadFile(pdfFile, useFileStore())

      let repository = useCompanyNoConstitutionDeclarationStore()
      await this.noConstitution.value.email(
        this.currentUser.value.name,
        this.currentUser.value.email,
        uploadedFile.url,
        repository
      )
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        //
      }
    }
  }

  //copywritings
  helpTitle(): string {
    return this.language.isMalay() ? "Pengisytiharan Tiada Perlembagaan" : "Declaration of No Constitution"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Pengisytiharan ini mengesahkan bahawa Syarikat tidak menerima pakai sebarang Perlembagaan dan oleh itu, 
        ia tertakluk kepada Jadual Ketiga Akta Syarikat 2016 sebagai peraturan dalaman asasnya.
        <br><br>
        Dengan ketiadaan Perlembagaan, segala hak, kuasa, tugas, dan obligasi Syarikat, Pengarah, dan Anggota 
        adalah terpakai sepenuhnya selaras dengan Akta tersebut serta Jadual Ketiga.
        <br><br>
        Asas undang-undang: Akta Syarikat 2016, seksyen 31(3) dan Jadual Ketiga.
        Pengisytiharan ini lazimnya diperlukan oleh Maybank bagi tujuan pembukaan akaun dengan mereka.
      `
    }

    return `
      This declaration confirms that the Company has not adopted a Constitution and is therefore governed by the 
      Third Schedule of the Companies Act 2016 as its default internal rules.
      <br><br>
      In the absence of a Constitution, the rights, powers, duties, and obligations of the Company, Directors, 
      and Members apply strictly in accordance with the Act and the Third Schedule.
      <br><br>
      This declaration is commonly asked by Maybank to Open an Account with them.
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Pengisytiharan: Tiada Perlembagaan" : "Declaration: No Constitution"
  }

  slipCaseContentPoints(): string[] {
    return []
  }

  // PASCA functions
  override processingLabel(): string {
    return this.language.isMalay() ? "Bayaran Diterima" : "Payment Received"
  }

  confirmationLabel(): string {
    return this.language.isMalay() ? "Dokumen Sedia" : "Document Ready"
  }

  downloadButton(): string {
    return this.language.isMalay() ? "Muat Turun" : "Download"
  }

  async onDownloadClicked(): Promise<void> {
    await this.onDownload()
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyNoConstitutionDeclaration() : this.noConstitution.value
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
      true,
      false,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      isInPreviewMode,
      this.isSubmitting.value,
      CompanyNoConstitutionDeclaration,
      useCompanyNoConstitutionDeclarationStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyNoConstitutionDeclaration>(
      this.companyId,
      this.noConstitution.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
