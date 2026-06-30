import { CompanyAnnualReturnRequest } from "~/scripts/models/CompanyAnnualReturnRequest"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { Company } from "~/scripts/models/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { MakePayment } from "~/scripts/library/MakePayment"
import { StatusConstants } from "~/scripts/constants/Status"
import { AnnualReturnLodger } from "~/scripts/library/AnnualReturnLodger"
import type { PaymentCartItem } from "~/scripts/models/PaymentCartItem"
import { ObjectUtil } from "~/scripts/utils/Object"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class LodgeAnnualReturnServiceController extends CompanyServiceController<CompanyAnnualReturnRequest> {
  companyAnnualReturnRequest = ref<CompanyAnnualReturnRequest>(new CompanyAnnualReturnRequest())

  wrapperRef: any | null = null

  yearToLodge: Ref<string> = ref<string>("")

  annualReturnLodger = ref<AnnualReturnLodger>(new AnnualReturnLodger(""))

  outstandingAnnualReturnPaymentRef: any | null = null

  isShowingDcr: Ref<boolean> = ref<boolean>(true)

  constructor(companyId: string, yearToLodge: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAnnualReturnRequest, useCompanyAnnualReturnRequestStore(), emitEvents)
    this.target = CompanyConstants.TARGET_LODGE_ANNUAL_RETURN
    this.setYearToLodge(yearToLodge)
    this.setViewType(viewType)
    this.initializeAnnualReturnLodger()
    this.initializeData()
  }

  setYearToLodge(yearToLodge: string): void {
    this.yearToLodge.value = yearToLodge

    if (StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.id)) {
      this.companyAnnualReturnRequest.value.year = this.yearToLodge.value
    }
  }

  setOutstandingAnnualReturnPaymentRef(outstandingAnnualReturnPaymentRef: any): void {
    this.outstandingAnnualReturnPaymentRef = outstandingAnnualReturnPaymentRef
  }

  async initializeAnnualReturnLodger(): Promise<void> {
    this.annualReturnLodger.value = new AnnualReturnLodger(this.companyId)
    this.annualReturnLodger.value.setYearToLodge(parseInt(this.yearToLodge.value))
    await this.annualReturnLodger.value.init()
  }

  async initializeData(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])
        break
      case ViewMode.Existing:
        this.hasOngoingApplication.value = true
        this.isInPreviewMode.value = false
        await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    if (StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.id)) {
      this.companyAnnualReturnRequest.value.year = this.yearToLodge.value
    }

    this.init(this.companyAnnualReturnRequest.value as CompanyAnnualReturnRequest)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyAnnualReturnRequest.value = new CompanyAnnualReturnRequest()
        this.companyAnnualReturnRequest.value.companyId = this.companyId
        this.companyAnnualReturnRequest.value.year = this.yearToLodge.value
        this.isInPreviewMode.value = true
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      let application = apiRecord.data
        .map((data: any) => {
          return new CompanyAnnualReturnRequest(data)
        })
        .find((record: CompanyAnnualReturnRequest) => {
          return record.year === this.yearToLodge.value
        })

      if (!application) {
        this.companyAnnualReturnRequest.value = new CompanyAnnualReturnRequest()
        this.companyAnnualReturnRequest.value.companyId = this.companyId
        this.companyAnnualReturnRequest.value.year = this.yearToLodge.value
        this.isInPreviewMode.value = true
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      this.companyAnnualReturnRequest.value = new CompanyAnnualReturnRequest(application)
      let companyRepository = useCompanyStore()
      let companyResponse = await companyRepository.fetch(this.companyId)
      this.companyAnnualReturnRequest.value.company = new Company(companyResponse)
      this.yearToLodge.value = this.companyAnnualReturnRequest.value.year
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

      let lastApplication = new CompanyAnnualReturnRequest(response)
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

    this.companyAnnualReturnRequest.value = new CompanyAnnualReturnRequest(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAnnualReturnRequest.value)
    }
  }

  async onApplicationUpdated(application: CompanyAnnualReturnRequest): Promise<void> {
    if (!application) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAnnualReturnRequest.value)
    }
  }

  async onSkipPayingForOutstandings(): Promise<void> {
    this.annualReturnLodger.value.isPayingForOutstandings = false
    await this.makePayment()
  }

  async onPayForOutstandings(): Promise<void> {
    this.annualReturnLodger.value.isPayingForOutstandings = true
    await this.makePayment()
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
        CompanyConstants.TARGET_LODGE_ANNUAL_RETURN,
        this.companyAnnualReturnRequest.value.id
      )
      await makePayment.setPaymentCart()

      // check for late lodgement
      this.annualReturnLodger.value.setYearToLodge(parseInt(this.yearToLodge.value))
      makePayment.paymentCart = await this.annualReturnLodger.value.handlePaymentToLodgeAnnualReturn(
        makePayment.paymentCart,
        this.companyAnnualReturnRequest.value.id
      )

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
    let repository = useCompanyAnnualReturnRequestStore()
    if (StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.id)) {
      this.companyAnnualReturnRequest.value.companyId = this.companyId
      this.companyAnnualReturnRequest.value.year = this.yearToLodge.value
      this.companyAnnualReturnRequest.value.status = StatusConstants.DRAFT

      await this.companyAnnualReturnRequest.value.create(repository)
    } else {
      await this.companyAnnualReturnRequest.value.update(repository)
    }
  }

  async onProceedClicked(): Promise<void> {
    if (this.annualReturnLodger.value.hasOtherOutstandings()) {
      if (this.outstandingAnnualReturnPaymentRef) {
        this.outstandingAnnualReturnPaymentRef.show()
      }

      return
    }

    if (StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.id) || !this.hasPaid()) {
      await this.makePayment()

      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Penyata Tahunan" : "Annual Return"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Serah simpan wajib di bawah Seksyen 68 Akta Syarikat 2016. Setiap Sdn Bhd mesti menyerah simpan Penyata Tahunan dalam tempoh 30 hari dari ulang tahun pemerbadanan 
        setiap tahun. Ia mengandungi butir-butir syarikat terkini seperti alamat perniagaan, pengarah, pemegang saham, dan struktur saham.
        <br><br>
        Anggaplah ini sebagai ‘yuran langganan’ yang perlu dibayar kepada SSM secara tahunan.
      `
    }

    return `
      A mandatory filing under Section 68 of the Companies Act 2016. Every Sdn Bhd must lodge its Annual Return within 30 days from its incorporation anniversary each year. 
      It contains updated company particulars such as business address, directors, shareholders, and share structure.
      <br><br>
      Consider this as ‘subscription fees’ to be paid to SSM on a yearly basis.
    `
  }

  isApplicationCreated(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.id)
  }

  isDoneLoading(): boolean {
    let isWrapperDoneLoading = this.wrapperRef !== null && this.wrapperRef.isDoneLoading()
    let isDcrDoneLoading = this.dcrRef !== null && !this.dcrRef.isLoading

    return isDcrDoneLoading && isWrapperDoneLoading
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Serah Simpan Penyata Tahunan" : "Resolution: Lodgement of Annual Return"
  }

  slipCaseContentPoints(): string[] {
    if (this.language.isMalay()) {
      return [
        "Penyata Tahunan <b>mesti diserah simpan dalam masa 30 hari</b> dari tarikh ulang tahun pemerbadanan anda, tetapi anda boleh buat bayaran terdahulu kepada Sistem iCompany.",
        "Kami tidak mendahulukan atau memberikan diskaun untuk sebarang bayaran bagi pihak anda.<b> Sdn Bhd anda, tanggungjawab anda</b>. Semua harga adalah tetap dan berpatutan, dengan pelbagai saluran pembayaran termasuk BNPL, kad kredit dan banyak lagi.",
        "Jika anda gagal, mengabaikan atau terlepas menyerah simpan Penyata Tahunan anda pada masanya, SSM akan mengenakan <b>fi lewat serah simpan tambahan sehingga RM200</b>, dan denda selanjutnya sehingga RM50,000 bagi ketidakpatuhan yang berterusan.",
      ]
    }

    return [
      "The Annual Return <b>must be lodged within 30 days</b> from your incorporation anniversary date, but you can pay early to iCompany Systems.",
      "We do not advance or discount any payment on your behalf. <b>Your Sdn Bhd, your responsibility</b>. All pricing is fixed and reasonable, with multiple payment channels including BNPL, credit card and more.",
      "If you fail, neglect or omit to lodge your Annual Return on time, SSM will impose an <b>additional late lodgment fee of up to RM200</b>, and further fines of up to RM50,000 for continued non-compliance.",
    ]
  }

  alertTitle(): string {
    return this.language.isMalay()
      ? "Maklumat Lanjut: Serah Simpan Penyata Tahunan"
      : "Learn More: Annual Return Lodgement"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <p>
          Sebuah syarikat dikehendaki untuk menyerah simpan <span class='glossary' id='annual-return'>Penyata 
          Tahunan</span> dengan SSM sekali dalam setiap tahun kalendar selaras dengan Akta Syarikat 2016. 
          Maklumat Tahunan berfungsi sebagai gambaran keseluruhan statutori mengenai butiran utama syarikat, 
          termasuk Pengarah, Pemegang Saham, Alamat Berdaftar, dan maklumat ditetapkan yang lain setakat 
          tarikh ulang tahun pemerbadanan. Penyerahan mestilah diselesaikan dalam tempoh 30 hari dari tarikh 
          ulang tahun pemerbadanan. Kegagalan untuk menyerah simpan dalam tempoh yang ditetapkan akan 
          mengakibatkan bayaran lewat simpan, penalti, atau kompaun yang dikenakan oleh SSM menurut 
          <b>Seksyen 588 Akta Syarikat 2016</b>.
        </p>
        <p>
          Maklumat Tahunan adalah kewajipan statutori asas dan harus dianggap sebagai keperluan pematuhan 
          berulang untuk mengekalkan kedudukan undang-undang syarikat. Ia tidak menggantikan kewajipan 
          pelaporan kewangan, sebaliknya beroperasi bersama-sama sebagai sebahagian daripada kerangka 
          pematuhan menyeluruh syarikat. Ketidakpatuhan selama bertahun-tahun berturut-turut boleh mencetuskan 
          penguatkuasaan kawal selia. Di bawah <b>Seksyen 68(9) Akta Syarikat 2016</b>, Pendaftar boleh 
          memulakan tindakan untuk membatalkan nama syarikat yang gagal menyerah simpan Maklumat Tahunan 
          selama tiga (3) tahun berturut-turut. Anda seterusnya diingatkan bahawa pembatalan nama syarikat 
          tidak menghapuskan sebarang liabiliti yang ditanggung oleh syarikat, Pengarah, atau pegawainya 
          sebelum dikeluarkan daripada daftar.
        </p>
        <p>
          Perkhidmatan ini memudahkan penyediaan, pengesahan, dan penyerahan Maklumat Tahunan berdasarkan 
          rekod terkini yang tersedia. Anda dinasihatkan untuk menyemak semua maklumat syarikat dengan 
          teliti sebelum penghantaran bagi memastikan ketepatan dan kesempurnaan.
        </p>
        <p>
          Anda diingatkan bahawa penyerahan tepat pada masanya dapat mengelakkan penalti yang tidak perlu, 
          mengekalkan status pematuhan, dan memastikan syarikat kekal dalam kedudukan yang baik dengan SSM.
        </p>
        <p>
          <b>Rujukan:</b> Seksyen 68(9) dan 588 Akta Syarikat 2016
        </p>
      `
    }

    return `
      <p>
        A company is required to lodge its <span class='glossary' id='annual-return'>Annual Return</span> 
        with SSM once in every calendar year in accordance with the Companies Act 2016. The Annual Return 
        serves as a statutory snapshot of the company’s key particulars, including its Directors, Shareholders, 
        Registered Address, and other prescribed information as at the anniversary of incorporation. The 
        lodgement must be completed within 30 days from the anniversary date of incorporation. Failure to 
        lodge within the prescribed timeframe will result in late lodgement fees, penalties, or compounds 
        imposed by SSM pursuant to <b>Section 588 of the Companies Act 2016</b>.
      </p>
      <p>
        The Annual Return is a baseline statutory obligation and should be treated as a recurring compliance 
        requirement to maintain the company’s legal standing. It does not replace financial reporting 
        obligations, but operates alongside them as part of the company’s overall compliance framework. 
        Non-compliance over consecutive years may trigger regulatory enforcement. Under <b>Section 68(9) of 
        the Companies Act 2016</b>, the Registrar may initiate action to strike off a company that fails 
        to lodge its Annual Returns for three (3) consecutive years. You are further reminded that striking 
        off does not extinguish any liabilities incurred by the company, its Directors, or officers prior 
        to removal from the register.
      </p>
      <p>
        This service facilitates the preparation, confirmation, and lodgement of the Annual Return based 
        on the latest available records. You are advised to review all company information carefully 
        before submission to ensure accuracy and completeness.
      </p>
      <p>
        You are reminded that timely lodgement avoids unnecessary penalties, preserves compliance status, 
        and ensures the company remains in good standing with SSM.
      </p>
      <p>
        <b>Reference:</b> Sections 68(9) and 588 of the Companies Act 2016
      </p>
    `
  }

  annualReturnDueDate(): string {
    let dayjs = useDayjs()
    if (StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.id)) {
      return dayjs().format("YYYY-MM-DD")
    }

    let incorpDate = dayjs(this.companyAnnualReturnRequest.value.company?.incorporatedAt)
    let currentAnnualReturnDate = incorpDate.year(parseInt(this.yearToLodge.value)).add(1, "month")

    return currentAnnualReturnDate.format("YYYY-MM-DD")
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

  hasSubmitted(): boolean {
    if (StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.id)) {
      return false
    }

    let dayjs = useDayjs()
    let today = dayjs()
    let currentAnnualReturnDueDate = dayjs(this.annualReturnDueDate())

    if (today.isBefore(currentAnnualReturnDueDate)) {
      return false
    }

    return (
      this.companyAnnualReturnRequest.value.status === StatusConstants.SUBMITTED ||
      this.companyAnnualReturnRequest.value.submittedAt !== null
    )
  }

  isPendingSubmission(): boolean {
    if (StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.id)) {
      return true
    }

    let dayjs = useDayjs()
    let today = dayjs()
    let currentAnnualReturnDueDate = dayjs(this.annualReturnDueDate())

    return today.isBefore(currentAnnualReturnDueDate)
  }

  pascaStatus(): string {
    if (StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.id)) {
      return ""
    }

    if (this.isPendingSubmission() || !this.hasSubmitted()) {
      return this.language.isMalay() ? "Akan diserah simpan" : "To be lodged before"
    }

    return this.language.isMalay() ? "Telah diserah simpan" : "Lodged"
  }

  submissionDate(): string {
    return this.time.formatDateOnlyShort(this.annualReturnDueDate())
  }

  confirmationLabel(): string {
    if (StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.id)) {
      return ""
    }

    if (this.isPendingSubmission() || !this.hasSubmitted()) {
      return this.language.isMalay() ? "Menunggu untuk diserah simpan" : "Pending Lodgement"
    }

    return this.language.isMalay() ? "Telah diserah simpan" : "Lodged"
  }

  confirmationSublabel(): string {
    if (!this.hasSubmitted()) {
      return ""
    }

    let dayjs = useDayjs()
    let submissionDate = this.time.formatDateOnlyShort(this.companyAnnualReturnRequest.value.submittedAt ?? "")

    return submissionDate
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  signatureDate(): string {
    if (!this.application.value) {
      return ""
    }

    if (this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    if (this.haveAllSigned()) {
      let sorted = ObjectUtil.sort<SignatureGroup>(this.application.value.signatureGroups, "createdAt", "desc")

      return this.time.formatDateOnlyShort(sorted[0].createdAt ?? "")
    }

    if (this.hasSigned()) {
      return this.userSignatureDate()
    }

    return ""
  }

  onShowResolutionClicked(): void {
    this.isShowingDcr.value = true
    this.isShowDocumentOptions.value = false
    this.handleDisplayedPage()
  }

  onShowSection68Clicked(): void {
    this.isShowingDcr.value = false
    this.isShowDocumentOptions.value = false
    this.handleDisplayedPage()
  }

  section68Label(): string {
    return this.language.isMalay() ? "Seksyen 68" : "Section 68"
  }

  dcrName(): string {
    return this.language.isMalay() ? "Resolusi" : "Resolution"
  }

  get serviceWrapperProps() {
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyAnnualReturnRequest.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyAnnualReturnRequest.value.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.haveAllSigned(),
      this.hasSigned(),
      this.signatureDate(),
      this.hasDcr.value,
      this.hasMcr.value,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      true,
      false,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      this.isInPreviewMode.value,
      this.isSubmitting.value,
      CompanyAnnualReturnRequest,
      useCompanyAnnualReturnRequestStore(),
      false,
      false
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAnnualReturnRequest>(
      this.companyId,
      this.companyAnnualReturnRequest.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false,
      null,
      null,
      [],
      this.yearToLodge.value
    )
  }
}
