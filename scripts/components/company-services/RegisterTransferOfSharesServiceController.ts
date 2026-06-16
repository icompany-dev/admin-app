import { CompanyPostShareTransfer } from "~/scripts/models/CompanyPostShareTransfer"
import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { StatusConstants } from "~/scripts/constants/Status"
import { Filter } from "~/scripts/library/Filter"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class RegisterTransferOfSharesServiceController extends CompanyServiceController<CompanyPostShareTransfer> {
  companyPostShareTransfer = ref<CompanyPostShareTransfer>(new CompanyPostShareTransfer())
  companyShareholderTransferId: Ref<string> = ref<string>("")
  companyShareholderTransfer = ref<CompanyShareholderTransfer>(new CompanyShareholderTransfer())

  companyShareholderTransferRepository = useCompanyShareholderTransferStore()

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyPostShareTransfer, useCompanyPostShareTransferStore(), emitEvents)
    this.target = CompanyConstants.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    await Promise.all([
      this.fetchRespondedShareholderTransfer(),
      this.fetchOngoingApplication(),
      this.fetchPreviousSubmission(),
      this.fetchPrice(),
    ])

    if (StringUtil.isNullOrEmpty(this.companyPostShareTransfer.value.id)) {
      this.companyPostShareTransfer.value.setDataFromShareTransfer(
        this.companyShareholderTransfer.value as CompanyShareholderTransfer
      )

      if (!StringUtil.isNullOrEmpty(this.companyShareholderTransfer.value.id)) {
        this.isInPreviewMode.value = this.companyShareholderTransfer.value.transferDetails.length > 0
        this.hasOngoingApplication.value = true
        this.viewType.value = ViewMode.Existing
        this.companyPostShareTransfer.value.status = StatusConstants.PAID // transfer of shares will pay all together

        if (this.companyShareholderTransfer.value.transferDetails.length > 0) {
          await this.companyPostShareTransfer.value.create(useCompanyPostShareTransferStore())
        }
      }
    }

    this.init(this.companyPostShareTransfer.value as CompanyPostShareTransfer)
    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyPostShareTransfer.value = new CompanyPostShareTransfer()
        this.companyPostShareTransfer.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      this.companyPostShareTransfer.value = new CompanyPostShareTransfer(apiRecord.data[0])
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
      let apiRecord = await this.repository.fetchAll(this.lastSubmissionFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.hasSubmittedBefore.value = false
        this.lastApplicationDate.value = ""
        this.hasPastApplications.value = false
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, false)
        return
      }

      let lastApplication = new CompanyPostShareTransfer(apiRecord.data[0])
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

  async fetchRespondedShareholderTransfer(): Promise<void> {
    try {
      let filter = new Filter()
      filter.companyId = this.companyId
      filter.statuses.push(StatusConstants.PAID)
      filter.sortOrder = "desc"
      filter.orderBy = "created_at"
      let response = await this.companyShareholderTransferRepository.fetchAll(filter)
      if (this.companyShareholderTransferRepository.error !== null) {
        throw this.companyShareholderTransferRepository.error
      }

      if (response.data.length <= 0) {
        this.companyShareholderTransferId.value = ""
        this.companyShareholderTransfer.value = new CompanyShareholderTransfer()
        this.companyShareholderTransfer.value.companyId = this.companyId
        return
      }

      this.companyShareholderTransferId.value = response.data[0].id
      this.companyShareholderTransfer.value = new CompanyShareholderTransfer(response.data[0])
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

  async onApplicationUpdated(application: CompanyPostShareTransfer): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyPostShareTransfer.value)
    }

    if (this.mcrRef) {
      this.mcrRef.updateApplicationContent(this.companyPostShareTransfer.value)
    }
  }

  setApplicationData(applicationData: CompanyPostShareTransfer): void {
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(applicationData)
    }

    if (this.mcrRef) {
      this.mcrRef.updateApplicationContent(applicationData)
    }
  }

  getCompanyPostShareTransfer(): CompanyPostShareTransfer {
    return this.companyPostShareTransfer.value as CompanyPostShareTransfer
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
        CompanyConstants.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER,
        this.companyPostShareTransfer.value.id
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
    if (this.dcrRef) {
      this.companyPostShareTransfer.value = this.dcrRef.getApplication()
    }

    if (StringUtil.isNullOrEmpty(this.companyPostShareTransfer.value.id)) {
      await this.companyPostShareTransfer.value.create(useCompanyPostShareTransferStore())
    } else {
      await this.companyPostShareTransfer.value.update(useCompanyPostShareTransferStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyPostShareTransfer.value.id) && !this.hasPaid()) {
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

    let label = this.language.isMalay() ? "Daftar Pindah Milik Saham" : "Register Transfer of Shares"
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Daftar Pindah Milik Saham" : "Transfer of Shares"
  }

  helpDescription(): string {
    //TODO: Get the copywriting for this
    if (this.language.isMalay()) {
      return `
        Seksyen 106 di bawah Akta Syarikat 2016 menetapkan tarikh akhir yang ketat bagi syarikat untuk 
        memproses pindah milik saham. Sebaik sahaja syarikat menerima dokumen pindah milik yang lengkap, 
        Sdn Bhd mempunyai <b>30 hari</b> untuk merekodkan nama pemilik baharu secara rasmi ke dalam Daftar 
        Ahli (Register of Members). Jika Lembaga Pengarah memutuskan untuk menolak atau menangguhkan 
        pindah milik tersebut—sebagai contoh, jika pemilik semasa masih mempunyai hutang tertunggak ke 
        atas saham tersebut—mereka mesti meluluskan satu resolusi yang menyatakan sebab-sebab khusus dalam 
        tempoh 30 hari yang sama, dan memaklumkan keputusan itu kepada kedua-dua pihak (pembeli dan penjual) 
        dalam masa <b>7 hari</b>.
        <br><br>
        Peraturan ini memastikan urusan pindah milik saham dikendalikan dengan cekap dan telus, serta 
        menghalang Sdn Bhd daripada mengabaikan permohonan tanpa tempoh masa yang pasti. Ia menjelaskan 
        bahawa Pengarah tidak boleh menyekat pindah milik tanpa alasan sah yang berasaskan Akta atau Perlembagaan 
        Syarikat. Jika Sdn Bhd atau Pegawainya gagal mematuhi tempoh masa atau prosedur ini, mereka melakukan 
        satu kesalahan dan boleh dikenakan <b>denda sehingga RM50,000</b>.
      `
    }

    return `
      Section 106 of Companies Act 2106 essentially sets a strict deadline for a Sdn Bhd to process 
      a share transfer. Once the Sdn Bhd receives the completed documents, it has <b>30 days</b> 
      to officially record the new owner's name in the Register of Members. If the Directors decide 
      to refuse or delay the transfer — for instance, if the current owner still owes money on those 
      shares — they must pass a resolution stating the specific reasons within that same 30-day window 
      and notify both the buyer and seller <b>within 7 days</b> of that decision.
      <br><br>
      This rule ensures that share transfers are handled efficiently and transparently, preventing 
      the Sdn Bhd from ignoring a request indefinitely. It clarifies that Directors cannot simply 
      block a transfer without a valid reason grounded in the Act or the company's constitution. If the 
      Sdn Bhd or its Officers fail to comply with these timelines or procedures, they commit an 
      offence and can face a <b>fine of up to RM50,000</b>.
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay()
      ? "Resolusi: Pendaftaran Pindah Milik Saham"
      : "Resolution: Register Transfer of Shares"
  }

  slipCaseContentPoints(): string[] {
    if (this.language.isMalay()) {
      return [
        "Di bawah Seksyen 106 Akta Syarikat 2016, Pengarah mempunyai kuasa untuk meluluskan, menangguhkan atau menolak pendaftaran Pindah Milik Saham.",
        "Resolusi untuk Mendaftarkan Pindah Milik Saham adalah <b>langkah terakhi</b>r yang diperlukan. Ia memerlukan majoriti mudah untuk diluluskan.",
        "Dengan meluluskan resolusi ini, Lembaga Pengarah memberi kuasa kepada Setiausaha Syarikat untuk mengemas kini Borang Berkanun (sekiranya diluluskan).",
      ]
    }

    return [
      "Under Section 106 of the Companies Act 2016, Directors have the authority to approve, delay or refuse registration of Transfer of Shares.",
      "The Resolution to Register Transfer of Shares is the <b>last required step</b>. It requires a simple majority to pass.",
      "By passing this resolution, the Board of Directors authorises the Company Secretary to update the Statutory Forms (in case of approval).",
    ]
  }

  override loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  override loaderSublabel(): string {
    return this.language.isMalay() ? "Resolusi Anda" : "Resolution"
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  override hasPaid(): boolean {
    return (
      this.companyShareholderTransfer.value.status !== StatusConstants.DRAFT &&
      this.companyShareholderTransfer.value.status !== StatusConstants.PENDING
    )
  }

  override onBackButtonClicked(): void {
    this.emitEvents("back")
  }

  get serviceWrapperProps() {
    let showPasca = this.viewType.value === ViewMode.Existing

    let props = new PropsCompanyServiceWrapper(
      this.companyPostShareTransfer.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyPostShareTransfer.value.id,
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
      CompanyPostShareTransfer,
      useCompanyPostShareTransferStore()
    )

    props.serviceStepProps.isPascaInPasca = true

    return props
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyPostShareTransfer>(
      this.companyId,
      this.companyPostShareTransfer.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
