import { StatusConstants } from "~/scripts/constants/Status"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { CompanyServiceController } from "./CompanyServiceController"
import { CompanyConstants } from "~/scripts/constants/Company"
import { CompanyBODeclaration } from "~/scripts/models/CompanyBODeclaration"
import { Shareholder } from "~/scripts/models/Shareholder"
import { User } from "~/scripts/models/User"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { File as UploadedFile } from "~/scripts/models/File"
import { DocumentEmailer } from "~/scripts/library/DocumentEmailer"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { Toast } from "~/scripts/library/Toast"
import { ActionTrayDropdown } from "~/scripts/types/action-trays/ActionTrayDropdown"
import { ActivityLogger } from "~/scripts/library/ActivityLogger"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class NotificationOfBOServiceController extends CompanyServiceController<CompanyBODeclaration> {
  beneficialOwnership = ref<CompanyBODeclaration>(new CompanyBODeclaration())
  shareholderId: Ref<string | null> = ref<string | null>(null)
  shareholder = ref<Shareholder>(new Shareholder())

  wrapperRef: any | null = null
  beneficialOwnershipRef: any | null = null

  hasExistingDeclaration: Ref<boolean> = ref<boolean>(false)

  actionTrayRef: any | null = null

  constructor(companyId: string, shareholderId: string | null, viewType: string, emitEvents: any | null) {
    super(companyId, false, false, CompanyBODeclaration, useCompanyBODeclarationStore(), emitEvents)

    this.viewType.value = viewType
    this.shareholderId.value = shareholderId
    this.target = CompanyConstants.TARGET_BO_DECLARATION
    this.initializeData()
  }

  async setShareholderId(shareholderId: string): Promise<void> {
    this.shareholderId.value = shareholderId
    await this.fetchShareholder()
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

      new ActionTrayDropdown(
        "more",
        {
          iconClass: "fa-solid fa-ellipsis",
          isIconOnly: true,
        },
        [
          new ActionTrayElement("print", this.print.bind(this), {
            label: new ActionTrayLabel("Print", "Cetak"),
          }),
          new ActionTrayElement("redeclare", this.redeclare.bind(this), {
            label: new ActionTrayLabel("Re-Declare", "Isytihar Semula"),
          }),
          new ActionTrayElement("learn-more", this.onMoreInfoClicked.bind(this), {
            label: new ActionTrayLabel("Learn More", "Maklumat Lanjut"),
          }),
        ]
      ),
    ]
  }

  async initializeData(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true
      await this.fetchExistingDeclaration()
    } catch (e: any) {
      // skip handle error?
    } finally {
      this.isLoading.value = false
    }

    this.init(this.beneficialOwnership.value as CompanyBODeclaration)
  }

  async fetchExistingDeclaration(): Promise<void> {
    if (!this.shareholderId.value || StringUtil.isNullOrEmpty(this.shareholderId.value)) {
      this.beneficialOwnership.value = new CompanyBODeclaration()
      this.beneficialOwnership.value.companyId = this.companyId
      return
    }

    try {
      let repository = useCompanyBODeclarationStore()
      const declaration = await repository.fetchByShareholderId(this.shareholderId.value)
      if (declaration) {
        this.beneficialOwnership.value = new CompanyBODeclaration(declaration)
        this.hasExistingDeclaration.value = true
        this.hasOngoingApplication.value = true
      } else {
        this.beneficialOwnership.value = new CompanyBODeclaration()
        this.beneficialOwnership.value.companyId = this.companyId
        this.beneficialOwnership.value.shareholderId = this.shareholderId.value
        this.hasExistingDeclaration.value = false
        this.hasOngoingApplication.value = false
      }
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async fetchShareholder(): Promise<void> {
    if (!this.shareholderId.value || StringUtil.isNullOrEmpty(this.shareholderId.value)) {
      this.shareholder.value = new Shareholder()
      return
    }

    try {
      let repository = useShareholderStore()
      let response = await repository.fetch(this.shareholderId.value)
      if (repository.error !== null) {
        throw repository.error
      }
      this.shareholder.value = new Shareholder(response)
      let userResponse = await this.shareholder.value.getRegisteredUser(useUserStore())
      this.shareholder.value.user = new User(userResponse)
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  override async setTotalPages(): Promise<void> {
    await nextTick()

    if (this.beneficialOwnershipRef) {
      this.totalPages.value = this.beneficialOwnershipRef.totalPages()
    } else {
      this.totalPages.value = 3
    }
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
    let paperIdToDisplay = `beneficial-ownership-${page}`

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

  override showWatermark(): boolean {
    if (this.documentViewMode.value === ViewMode.Shrouded) {
      return false
    }

    return StringUtil.isNullOrEmpty(this.beneficialOwnership.value.signatureFileId)
  }

  canRedeclare(): boolean {
    return (
      this.hasExistingDeclaration.value && !StringUtil.isNullOrEmpty(this.beneficialOwnership.value.signatureFileId)
    )
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  setBeneficialOwnershipRef(beneficialOwnershipRef: any | null): void {
    this.beneficialOwnershipRef = beneficialOwnershipRef
  }

  getPdfElements(): any[] {
    if (!this.beneficialOwnershipRef) {
      return []
    }
    return this.beneficialOwnershipRef.getPdfElements()
  }

  async email(): Promise<void> {
    let pdfElements = await this.getPdfElements()
    let filename = "Beneficial Ownership Disclosure.pdf"
    let pdfBlob = await PdfPaperUtil.getPdfBlob(pdfElements, 20, filename, PaperSize.A4, PaperOrientation.Portrait)

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
    let filename = "Beneficial Ownership Disclosure.pdf"

    let activityLogger = new ActivityLogger()
    await activityLogger.init()
    let additionalInfo = filename
    let status = ""

    try {
      let pdfElements = await this.getPdfElements()

      await PdfPaperUtil.generatePdfFile(pdfElements, 20, filename, PaperSize.A4, PaperOrientation.Portrait)

      status = "success"
    } catch (e) {
      additionalInfo = `failed to download ${additionalInfo}: ${e}`
      status = "failed"
    } finally {
      activityLogger.addDownloadLog(
        this.companyId,
        additionalInfo,
        this.target,
        this.beneficialOwnership.value.id,
        status
      )
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
      `Beneficial Ownership Disclosure.pdf`,
      PaperSize.A4,
      PaperOrientation.Portrait
    )
    const blobURL = URL.createObjectURL(blob)

    await nextTick()
    printWindow.location.href = blobURL

    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  async redeclare(): Promise<void> {
    this.emitEvents(EmitMessages.GO_TO_NEW)
  }

  isDoneLoading(): boolean {
    return true
  }

  override hasPaid(): boolean {
    return this.hasExistingDeclaration.value
  }

  //copywritings
  helpTitle(): string {
    return this.language.isMalay() ? "Pendedahan Pemilik Benefisial" : "Beneficial Owner Disclosure"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Pendedahan Pemilik Benefisial di bawah Seksyen 60D Akta Syarikat 2016.
      `
    }

    return `
      Beneficial Owner Disclosure under Section 60D of the Companies Act 2016.
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Pendedahan Pemilik Benefisial" : "Beneficial Owner Disclosure"
  }

  earMarkText(): string {
    return this.language.isMalay() ? "NOTIS" : "NOTICE"
  }

  override loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  override loaderSublabel(): string {
    return this.language.isMalay() ? "Pendedahan: Pemilik Benefisial" : "Declaration: Beneficial Ownership"
  }

  override payLabel(): string {
    if (this.canRedeclare()) {
      return this.language.isMalay() ? "Tambah ke Beg" : "Add to Bag"
    }

    return this.language.isMalay() ? "Declare" : "Declare"
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Maklumat Lanjut: Pemilik Benifisial" : "Learn More: Beneficial Ownership"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        Pemilik Benefisial merujuk kepada orang asli yang akhirnya memiliki, mengawal, atau menjalankan kawalan berkesan 
        ke atas sesebuah syarikat, sama ada secara langsung atau tidak langsung, tanpa mengambil kira sama ada nama 
        mereka muncul sebagai pemegang saham dalam rekod syarikat.
        <br><br>
        Di bawah Akta Syarikat 2016 dan garis panduan yang dikeluarkan oleh SSM, setiap syarikat diwajibkan untuk mengenal 
        pasti, memperoleh, menyimpan, dan menyenggara maklumat yang tepat berkaitan dengan Pemilik Benefisialnya. Kewajipan 
        ini merupakan sebahagian daripada tanggungjawab tadbir urus, ketelusan, pencegahan pengubahan wang haram, dan 
        pematuhan kawal selia Syarikat yang berterusan.
        <br><br>
        Seseorang boleh dianggap sebagai Pemilik Benefisial jika mereka:
        <ul>
          <li>memegang saham secara langsung atau tidak langsung;</li>
          <li>menjalankan kawalan berkesan ke atas Syarikat;</li>
          <li>mempunyai hak untuk melantik atau memecat Pengarah;</li>
          <li>mengawal hak mengundi atau pembuatan keputusan; atau</li>
          <li>mempunyai pengaruh ketara ke atas Syarikat melalui cara lain.</li>
        </ul>
        Sila ambil perhatian bahawa pengaturan penama (<i>nominee</i>), struktur pemilikan berlapis, pegangan keluarga, 
        proksi, amanah, atau pengaturan tidak rasmi tidak mengecualikan kewajipan untuk mengisytiharkan Pemilik Benefisial 
        yang sebenar.
        <br><br>
        Pengisytiharan dan penyenggaraan maklumat Pemilik Benefisial adalah satu kewajipan yang berterusan. Sebarang 
        perubahan pada maklumat Pemilik Benefisial hendaklah dikemas kini sewajarnya bagi memastikan rekod Syarikat 
        sentiasa tepat dan patuh.
        <br><br>
        Kegagalan untuk menyenggara rekod Pemilik Benefisial yang sewajarnya boleh mendedahkan Syarikat dan pegawainya 
        kepada tindakan kawal selia, langkah penguatkuasaan, penalti, atau risiko pematuhan di bawah undang-undang dan 
        garis panduan yang terpakai.
        <br><br>
        <b>Rujukan:</b> Seksyen 56 Akta Syarikat dan Garis Panduan Pemilikan Benefisial berkaitan yang dikeluarkan oleh SSM.
      `
    }

    return `
      Beneficial Ownership refers to the natural person who ultimately owns, controls, or exercises effective control 
      over a company, whether directly or indirectly, regardless of whether their name appears as a shareholder in 
      the company records.
      <br><br>
      Under the Companies Act 2016 and the guidelines issued by SSM, every company is required to identify, obtain, 
      keep, and maintain accurate information relating to its Beneficial Owners. This obligation forms part of the 
      Company’s ongoing governance, transparency, anti-money laundering, and regulatory compliance responsibilities.
      <br><br>
      A person may be considered a Beneficial Owner if they:
      <ul>
        <li>hold shares directly or indirectly;</li>
        <li>exercise effective control over the Company;</li>
        <li>have the right to appoint or remove Directors;</li>
        <li>control voting rights or decision-making; or</li>
        <li>otherwise have significant influence over the Company.</li>
      </ul>
      Please note that nominee arrangements, layered ownership structures, family holdings, proxies, trusts, or informal 
      arrangements do not remove the obligation to declare the actual Beneficial Owner.
      <br><br>
      The declaration and maintenance of Beneficial Ownership information is a continuing obligation. Any change to the 
      Beneficial Ownership information should be updated accordingly to keep the Company records accurate and compliant.
      <br><br>
      Failure to maintain proper Beneficial Ownership records may expose the Company and its officers to regulatory 
      action, enforcement measures, penalties, or compliance risks under applicable laws and guidelines.
      <br><br>
      <b>Reference:</b> Section 56 of the Companies Act and related Beneficial Ownership Guidelines issued by SSM.
    `
  }

  get serviceWrapperProps() {
    let isInPreviewMode = this.isInPreviewMode.value //this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    let props = new PropsCompanyServiceWrapper(
      this.beneficialOwnership.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.beneficialOwnership.value.id,
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
      CompanyBODeclaration,
      useCompanyBODeclarationStore()
    )

    return props
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyBODeclaration>(
      this.companyId,
      this.beneficialOwnership.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
