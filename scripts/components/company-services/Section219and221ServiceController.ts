import { ViewMode } from "~/scripts/constants/ViewMode"
import { CompanyServiceController } from "./CompanyServiceController"
import { CompanyConstants } from "~/scripts/constants/Company"
import { DirectorDeclarationConflictOfInterest } from "~/scripts/models/DirectorDeclarationConflictOfInterest"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { StringUtil } from "~/scripts/utils/String"
import { StatusConstants } from "~/scripts/constants/Status"
import { Error } from "~/scripts/library/Error"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { File as UploadedFile } from "~/scripts/models/File"
import { DocumentEmailer } from "~/scripts/library/DocumentEmailer"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { Toast } from "~/scripts/library/Toast"
import { ActivityLogger } from "~/scripts/library/ActivityLogger"

export class Section219and221ServiceController extends CompanyServiceController<DirectorDeclarationConflictOfInterest> {
  section219and221 = ref<DirectorDeclarationConflictOfInterest>(new DirectorDeclarationConflictOfInterest())
  existingSection219and221 = ref<DirectorDeclarationConflictOfInterest>(new DirectorDeclarationConflictOfInterest())
  directorId: Ref<string> = ref<string>("")

  wrapperRef: any | null = null
  section219and221Ref: any | null = null

  actionTrayRef: any | null = null

  constructor(companyId: string, directorId: string, viewType: string, emitEvents: any | null) {
    super(
      companyId,
      false,
      false,
      DirectorDeclarationConflictOfInterest,
      useDirectorDeclarationConflictOfInterestStore(),
      emitEvents
    )

    this.viewType.value = viewType

    this.directorId.value = directorId
    this.target = CompanyConstants.TARGET_DIRECTOR_DECLARATION_CONFLICT_OF_INTEREST
    this.totalPages.value = 5 // Section 219 and 221 has 5 pages

    this.initializeData()
  }

  async setDirectorId(directorId: string): Promise<void> {
    this.directorId.value = directorId

    await this.initializeData()
  }

  async initializeData(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.directorId.value) || this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true
      switch (this.viewType.value) {
        case ViewMode.New:
          this.isInPreviewMode.value = true
          this.hasOngoingApplication.value = false
          this.section219and221.value = new DirectorDeclarationConflictOfInterest(
            this.companyServiceInitializer.newApplication
          )
          await Promise.all([this.fetchPrice(), this.fetchOngoing(), this.fetchExisting()])
          if (!StringUtil.isNullOrEmpty(this.section219and221.value.id)) {
            this.isInPreviewMode.value = false
          }

          if (!StringUtil.isNullOrEmpty(this.existingSection219and221.value.id)) {
            this.emitEvents(EmitMessages.HAS_EXISTING_APPLICATION)
          }
          break
        case ViewMode.Existing:
          this.isInPreviewMode.value = false
          this.section219and221.value = new DirectorDeclarationConflictOfInterest(
            this.companyServiceInitializer.newApplication
          )
          await Promise.all([this.fetchPrice(), this.fetchExisting()])
          if (this.existingSection219and221.value.status === StatusConstants.ACTIVE) {
            this.section219and221.value = new DirectorDeclarationConflictOfInterest(this.existingSection219and221.value)
            this.hasOngoingApplication.value = true
          } else {
            this.hasOngoingApplication.value = false
          }
          break
        case ViewMode.Past:
          this.isInPreviewMode.value = true
          await Promise.all([this.fetchPrice(), this.setPastApplications()])
          this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
          this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
          break
      }

      await this.init(this.section219and221.value as DirectorDeclarationConflictOfInterest)

      this.handleDisplayedPage()
    } catch (e) {
      console.error(e) // avoid handler here
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchOngoing(): Promise<void> {
    let repository = useDirectorDeclarationConflictOfInterestStore()
    let response = await repository.ongoingForDirector(this.directorId.value)

    if (repository.error !== null || !response) {
      this.section219and221.value = new DirectorDeclarationConflictOfInterest(
        this.companyServiceInitializer.newApplication
      )
      this.section219and221.value.companyId = this.companyId
      this.section219and221.value.directorId = this.directorId.value
      return
    }

    this.section219and221.value = new DirectorDeclarationConflictOfInterest(response)
  }

  async fetchExisting(): Promise<void> {
    let repository = useDirectorDeclarationConflictOfInterestStore()
    let response = await repository.activeForDirector(this.directorId.value)

    if (repository.error !== null || !response) {
      this.existingSection219and221.value = new DirectorDeclarationConflictOfInterest(
        this.companyServiceInitializer.newApplication
      )
      this.existingSection219and221.value.companyId = this.companyId
      this.existingSection219and221.value.directorId = this.directorId.value
      return
    }

    this.existingSection219and221.value = new DirectorDeclarationConflictOfInterest(response)
  }

  async setPastApplications(): Promise<void> {
    let repository = useDirectorDeclarationConflictOfInterestStore()
    let response = await repository.allForDirector(this.directorId.value)

    if (repository.error !== null || !response) {
      this.companyServiceInitializer.pastApplications = []
    }

    this.companyServiceInitializer.pastApplications = response.map((d: any) => {
      return new DirectorDeclarationConflictOfInterest(d)
    })
  }

  setActionTrayRef(ref: any): void {
    this.actionTrayRef = ref
    this.setActionTrayElements()
  }

  override setActionTrayElements(): void {
    this.actionTrayElements.value = [
      new ActionTrayElement("email", this.email.bind(this), {
        label: new ActionTrayLabel("Email", "Emel"),
      }),
      new ActionTrayElement("download", this.download.bind(this), {
        label: new ActionTrayLabel("Download", "Muat Turun"),
      }),
      new ActionTrayElement("print", this.print.bind(this), {
        label: new ActionTrayLabel("Print", "Cetak"),
      }),
    ]
  }

  isShowFudter(): boolean {
    return this.viewType.value === ViewMode.Existing
  }

  override handleDisplayedPage(): void {
    let parentComponent = document.querySelector(".documents") as HTMLElement
    if (!parentComponent) {
      return
    }

    let allPapers = parentComponent.querySelectorAll(".paper-wrapper")

    // Show all papers in preview mode
    if (this.documentViewMode.value === ViewMode.Preview || this.documentViewMode.value === ViewMode.Enlarged) {
      allPapers.forEach((paper: Element) => {
        let paperElement = paper as HTMLElement
        paperElement.style.display = "block"
      })
      return
    }

    // Show only current page in shrouded mode
    let page = this.currentPage.value
    let paperIdToDisplay = `section-219-and-221-${page}`

    allPapers.forEach((paper: Element) => {
      if (!paper.id) {
        return
      }

      let paperElement = paper as HTMLElement
      if (paper.id === paperIdToDisplay) {
        paperElement.style.display = "block"
      } else {
        paperElement.style.display = "none"
      }
    })
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  setSection219and221Ref(section219and221Ref: any | null): void {
    this.section219and221Ref = section219and221Ref
  }

  async getPdfElements(): Promise<any[]> {
    if (!this.section219and221Ref) {
      return []
    }
    return await this.section219and221Ref.getPdfElements()
  }

  isDoneLoading(): boolean {
    return true
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
        this.target,
        this.section219and221.value.id
      )
      await makePayment.setPaymentCart()

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e) {
      console.error(e)
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForPayment()
        error.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.section219and221.value.id)) {
      this.section219and221.value.companyId = this.companyId
      this.section219and221.value.directorId = this.directorId.value
      await this.section219and221.value.create(useDirectorDeclarationConflictOfInterestStore())
    } else {
      await this.section219and221.value.update(useDirectorDeclarationConflictOfInterestStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.section219and221.value.id) || !this.hasPaid()) {
      await this.makePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  setApplicationData(applicationData: DirectorDeclarationConflictOfInterest): void {
    if (!applicationData) {
      return
    }

    this.section219and221.value = new DirectorDeclarationConflictOfInterest(applicationData)
  }

  async onApplicationUpdated(application: DirectorDeclarationConflictOfInterest): Promise<void> {
    this.section219and221.value = new DirectorDeclarationConflictOfInterest(application)

    this.emitEvents(EmitMessages.GO_TO_EXISTING)
  }

  async email(): Promise<void> {
    let pdfElements = await this.getPdfElements()
    let filename = "Declaration Conflict of Interest.pdf"
    let pdfBlob = await PdfPaperUtil.getPdfBlob(pdfElements, 20, filename, PaperSize.A4, PaperOrientation.Landscape)

    let pdfFile = new File([pdfBlob], filename, {
      type: "application/pdf",
    })

    let uploadedFile = new UploadedFile()
    await uploadedFile.uploadFile(pdfFile, useFileStore())

    let user = await CurrentUser.get()
    let documentEmailer = new DocumentEmailer(user.name, user.email, filename, uploadedFile.url)
    await documentEmailer.send()

    let title = this.language.isMalay()
      ? "Dokumen telah dihantar ke emel berdaftar anda."
      : "Document has been sent to your email address."
    let message = this.language.isMalay() ? "Sila periksa inbox anda." : "Please check your inbox."
    let toast = new Toast(title, message)
    toast.success()
  }

  async download(): Promise<void> {
    let filename = "Declaration Conflict of Interest.pdf"

    let activityLogger = new ActivityLogger()
    await activityLogger.init()
    let additionalInfo = filename
    let status = ""

    try {
      let pdfElements = await this.getPdfElements()

      await PdfPaperUtil.generatePdfFile(pdfElements, 20, filename, PaperSize.A4, PaperOrientation.Landscape)

      status = "success"
    } catch (e) {
      additionalInfo = `failed to download ${additionalInfo}: ${e}`
      status = "failed"
    } finally {
      activityLogger.addDownloadLog(this.companyId, additionalInfo, this.target, this.section219and221.value.id, status)
    }
  }

  async print(): Promise<void> {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write("Please wait, generating your document for printing...")
    } else {
      throw "Fail to open new window"
    }

    let pages = await this.getPdfElements()
    if (pages.length <= 0) {
      printWindow.close()
      return
    }

    const blob = await PdfPaperUtil.getPdfBlob(
      pages,
      20,
      `Declaration Conflict of Interest.pdf`,
      PaperSize.A4,
      PaperOrientation.Landscape
    )
    const blobURL = URL.createObjectURL(blob)

    await nextTick()
    printWindow.location.href = blobURL

    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  //copywritings
  helpTitle(): string {
    return this.language.isMalay() ? "Pengisytiharan Konflik Kepentingan" : "Declaration of Conflict of Interest"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Pengisytiharan Konflik Kepentingan di bawah Seksyen 219 dan 221 Akta Syarikat 2016.
      `
    }

    return `
      Declaration of Conflict of Interest under Section 219 and 221 of the Companies Act 2016.
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay()
      ? "Notis: Pengisytiharan Konflik Kepentingan"
      : "Notice: Declaration of Conflict of Interest"
  }

  override loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  override loaderSublabel(): string {
    return this.language.isMalay() ? "Pengisytiharan Konflik Kepentingan" : "Conflict of Interest Declaration"
  }

  get serviceWrapperProps() {
    let application = this.section219and221.value ?? new DirectorDeclarationConflictOfInterest()
    let isInPreviewMode = this.isInPreviewMode.value //this.viewType.value === ViewMode.New ? true : false
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
      "",
      false,
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
      DirectorDeclarationConflictOfInterest,
      useDirectorDeclarationConflictOfInterestStore()
    )

    props.paperOrientation = PaperOrientation.Landscape

    return props
  }
}
