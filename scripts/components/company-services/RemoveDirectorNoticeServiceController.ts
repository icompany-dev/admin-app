import { CompanyDirectorRemoval } from "~/scripts/models/CompanyDirectorRemoval"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import type { PaymentCartItem } from "~/scripts/models/PaymentCartItem"
import { ServicePricingOptional } from "~/scripts/models/ServicePricingOptional"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { ObjectUtil } from "~/scripts/utils/Object"

export class RemoveDirectorNoticeServiceController extends CompanyServiceController<CompanyDirectorRemoval> {
  companyDirectorRemoval = ref<CompanyDirectorRemoval>(new CompanyDirectorRemoval())

  wrapperRef: any | null = null

  noticeRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyDirectorRemoval, useCompanyDirectorRemovalStore(), emitEvents)
    this.target = CompanyConstants.TARGET_REMOVAL_OF_DIRECTOR
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    if (this.viewType.value !== ViewMode.Past) {
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])

      if (this.companyServiceInitializer.existingApplication) {
        if (this.viewType.value === ViewMode.New) {
          this.emitEvents(EmitMessages.GO_TO_EXISTING)
        }
        this.hasOngoingApplication.value = true
        this.companyDirectorRemoval.value = new CompanyDirectorRemoval(
          this.companyServiceInitializer.existingApplication
        )
        this.viewType.value = ViewMode.Existing
        this.isInPreviewMode.value = false
      } else {
        this.companyDirectorRemoval.value = new CompanyDirectorRemoval(this.companyServiceInitializer.newApplication)
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        this.isInPreviewMode.value = true
      }
    } else {
      this.isInPreviewMode.value = true
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
      this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
    }

    this.init(this.companyDirectorRemoval.value as CompanyDirectorRemoval)
    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyDirectorRemoval.value = new CompanyDirectorRemoval()
        this.companyDirectorRemoval.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyDirectorRemoval.value = new CompanyDirectorRemoval(apiRecord.data[0])
      this.isInPreviewMode.value = false
      this.hasOngoingApplication.value = true
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error(Error.ERROR_TYPE_API, "Unable to fetch registered address amendment for company")
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

      let lastApplication = new CompanyDirectorRemoval(apiRecord.data[0])
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error(Error.ERROR_TYPE_API, "Unable to fetch registered address amendment for company")
        errorMessage.handle()
      }
    }
  }

  async onApplicationUpdated(application: CompanyDirectorRemoval): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyDirectorRemoval.value)
    }

    if (this.noticeRef) {
      this.noticeRef.updateApplicationContent(this.companyDirectorRemoval.value)
    }
  }

  setApplicationData(applicationData: CompanyDirectorRemoval): void {
    if (!applicationData) {
      return
    }

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(applicationData)
    }

    if (this.noticeRef) {
      this.noticeRef.updateApplicationContent(this.companyDirectorRemoval.value)
    }
  }

  async makePayment(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      if (StringUtil.isNullOrEmpty(this.companyDirectorRemoval.value.id)) {
        await this.submitApplication()
      }

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companyDirectorRemoval.value.id
      )
      await makePayment.setPaymentCart()

      let paymentCartItem = makePayment.paymentCart.items.find((pci: PaymentCartItem) => {
        return pci.targetType === this.target && pci.targetId === this.companyDirectorRemoval.value.id
      })
      if (paymentCartItem) {
        let optional = paymentCartItem.servicePricing.optionals.find((opt: ServicePricingOptional) => {
          return opt.optionalServiceId === "344766df-2a4f-4461-8339-50065d217bdd"
        })

        if (optional) {
          optional.optionalServicePrice.baseGrandTotal =
            optional.optionalServicePrice.baseGrandTotal * this.totalNumberOfDirectors.value

          console.log("here?")
        }
      }

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        console.error(e)
        let error: Error = new Error(Error.ERROR_TYPE_API, "Unable to proceed with payment. Please try again")
        error.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyDirectorRemoval.value.id)) {
      this.companyDirectorRemoval.value.companyId = this.companyId
      await this.companyDirectorRemoval.value.create(useCompanyDirectorRemovalStore())
    } else {
      await this.companyDirectorRemoval.value.update(useCompanyDirectorRemovalStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyDirectorRemoval.value.id) || !this.hasPaid()) {
      this.makePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  setNoticeRef(noticeRef: any | null): void {
    this.noticeRef = noticeRef
  }

  alertTitle(): string {
    if (this.hasPaid()) {
      return this.language.isMalay() ? "Maklumat Lanjut: Notis Khas" : "Learn More: Special Notice"
    }

    return this.language.isMalay()
      ? "Maklumat Lanjut: Penyingkiran Pengarah oleh Pemegang Saham"
      : "Learn More: Removal of Director by Shareholders"
  }

  alertContent(): string {
    if (this.hasPaid()) {
      if (this.language.isMalay()) {
        return `
          <p>
            <span class='glossary' id='special-notice'>Notis Khas</span> ialah satu keperluan 
            notis di bawah Akta Syarikat 2016 ("Akta") di mana sesuatu cadangan ketetapan tidak 
            boleh dibawa secara sah melainkan notis khas telah diberikan terlebih dahulu kepada 
            Syarikat oleh ahli (atau ahli-ahli) yang layak dalam tempoh masa yang ditetapkan.
          </p>
          <p>
            Notis Khas itu sendiri tidak meluluskan sesuatu ketetapan. Sebaliknya, ia berfungsi 
            sebagai mekanisme pemberitahuan rasmi terlebih dahulu kepada Syarikat dan ahli-ahli 
            lain sebelum ketetapan tertentu yang sensitif atau penting boleh dipertimbangkan 
            dalam mesyuarat agung.
          </p>
          <p>
            Contoh penggunaan Notis Khas termasuk:
          </p>
          <ul>
            <li>Pemecatan seorang Pengarah sebelum tamat tempoh jawatan;</li>
            <li>Pelantikan individu lain bagi menggantikan Pengarah yang dipecat;</li>
            <li>Pemecatan atau penggantian Juruaudit dalam keadaan tertentu; atau</li>
            <li>Perkara-perkara lain yang ditetapkan oleh Perlembagaan Syarikat yang tidak bercanggah dengan Akta.</li>
          </ul>
          <p>
            Syarikat secara amnya dikehendaki untuk mengedarkan atau memaklumkan Notis Khas 
            tersebut kepada ahli-ahli yang berkaitan selaras dengan Akta dan Perlembagaan Syarikat 
            (jika ada).
          </p>
          <p>
            Makluman Pengguna: Keperluan Notis Khas adalah bersifat prosedur dan terikat dengan tempoh 
            masa yang ketat. Kegagalan untuk mematuhi tempoh notis yang ditetapkan atau keperluan 
            berkanun boleh menjejaskan kesahan cadangan ketetapan atau proses mesyuarat tersebut.
          </p>
          <p>
            <b>Rujukan:</b> Seksyen 322 Akta Syarikat 2016.
          </p>
        `
      }

      return `
        <p>
          A <span class='glossary' id='special-notice'>Special Notice</span> is a notice requirement 
          under the Companies Act 2016 ("Act') where a proposed resolution cannot be validly moved 
          unless special notice has first been given to the Company by the required member(s) within 
          the prescribed timeline.
        <p>
        <p>
          Special Notice does not itself pass a resolution. Instead, it serves as a formal prior 
          notification mechanism to the Company and other members before certain sensitive or 
          significant resolutions may be considered at a general meeting.
        </p>
        <p>
          Examples of use of Special Notice may include:
        </p>
        <ul>
          <li>Removal of a Director before expiry of office;</li>
          <li>Appointment of another person in place of a removed Director;</li>
          <li>Removal or replacement of an Auditor in certain circumstances; or</li>
          <li>Other matters prescribed by a Constitution that is not in contravention of the Act.</li>
        </ul>
        <p>
          The Company is generally required to circulate or notify the Special Notice to the relevant 
          members in accordance with the Act and the Constitution of the Company, if any.
        </p>
        <p>
          Users are advised that Special Notice requirements are procedural and time-sensitive. 
          Failure to comply with the applicable notice period or statutory requirements may affect 
          the validity of the proposed resolution or meeting process.
        </p>
        <p>
          <b>Reference:</b> Section 322 of the Companies Act 2016.
        </p>
      `
    }

    if (this.language.isMalay()) {
      return `
        <p>
          Di bawah Akta Syarikat 2016, pemegang saham boleh menyingkirkan seorang Pengarah 
          Syarikat melalui proses resolusi ahli. Walau bagaimanapun, penyingkiran tersebut 
          tidak berlaku secara automatik dan mestilah mengikut prosedur undang-undang yang 
          betul.
        </p>
        <p>
          Proses ini biasanya bermula apabila pemegang saham menyerahkan Notis Khas kepada 
          Syarikat yang menyatakan niat untuk menyingkirkan seorang Pengarah. Lembaga Pengarah 
          kemudiannya dikehendaki untuk mengadakan mesyuarat ahli bagi membolehkan pemegang 
          saham mengundi usul penyingkiran tersebut.
        </p>
        <p>
          Sila ambil perhatian bahawa menurut Seksyen 297 Akta Syarikat 2016, penyingkiran 
          seorang Pengarah tidak boleh dilaksanakan melalui Resolusi Bertulis atau Resolusi 
          Pekeliling. Usul penyingkiran tersebut mestilah dipertimbangkan dan diundi dalam 
          Mesyuarat Agung ahli.
        </p>
        <p>
          Pengarah yang diusulkan untuk disingkirkan juga mestilah diberi peluang untuk menerima 
          notis mesyuarat dan mengemukakan representasi (kenyataan pembelaan diri) sebelum 
          resolusi tersebut diundi. Penyingkiran sebenar hanya berkuat kuasa sekiranya pemegang 
          saham meluluskan Resolusi Biasa dengan majoriti mudah undi dalam mesyuarat tersebut.
        </p>
        <p>
          Sekiranya Pengarah gagal atau enggan mengadakan mesyuarat selepas permintaan sah dibuat 
          oleh pemegang saham yang layak, pemegang saham (yang memegang sekurang-kurangnya 10% 
            pegangan saham) boleh, dalam keadaan tertentu, membuat rekuisisi untuk mengadakan 
            sendiri mesyuarat tersebut selaras dengan Akta Syarikat 2016.
        </p>
        <p>
          Sila ambil perhatian bahawa penyingkiran seorang Pengarah boleh menjejaskan mandat 
          perbankan, kawalan syarikat, rekod statutori, kontrak, perkara berkaitan perlesenan, 
          pengisytiharan pemilikan benefisial, serta urusan operasi Syarikat yang lain. Pengguna 
          digalakkan untuk memastikan semua rekod dan pihak berkuasa yang berkaitan dikemas 
          kini sewajarnya selepas penyingkiran tersebut berkuat kuasa.
        </p>
      `
    }

    return `
      <p>
        Under the Companies Act 2016, shareholders may remove a Director of a Company through 
        a members’ resolution process. However, the removal does not happen automatically and 
        must follow the proper legal procedure.
      </p>
      <p>
        The process usually begins when a shareholder gives a Special Notice to the Company 
        stating the intention to remove a Director. The Board of Directors is then expected to 
        convene a meeting of members for the shareholders to vote on the proposed removal.
      </p>
      <p>
        Please note that pursuant to Section 297 of the Companies Act 2016, the removal of a 
        Director cannot be effected through a Written Resolution or Circular Resolution. The 
        proposed removal must be considered and voted upon at a General Meeting of members.
      </p>
      <p>
        The Director proposed to be removed must also be given the opportunity to receive notice 
        of the meeting and to make representations before the resolution is voted upon.
      </p>
      <p>
        The actual removal only takes effect if the shareholders pass an Ordinary Resolution by 
        a simple majority of votes at the meeting.
      </p>
      <p>
        Where the Directors fail or refuse to convene the meeting after a valid request by eligible 
        shareholders, the shareholders (with at least 10% shareholding) may under certain 
        circumstances requisition to convene the meeting themselves in accordance with the Companies 
        Act 2016.
      </p>
      <p>
        Please note that removal of a Director may affect banking mandates, company control, 
        statutory records, contracts, licensing matters, beneficial ownership declarations, 
        and other operational matters of the Company. Users are encouraged to ensure that all 
        related records and authorities are updated accordingly after the removal takes effect.
      </p>
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Penyingkiran Pengarah oleh Pemegang Saham" : "Removal of Director by Shareholders"
  }

  override loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing the"
  }

  override loaderSublabel(): string {
    return this.language.isMalay() ? "Prosiding Penyingkiran Pengarah" : "Proceedings of Removal of Director"
  }

  // PASCA
  get completedLabel(): string {
    return this.language.isMalay() ? "Selesai" : "Completed"
  }

  get specialNoticeLabel(): string {
    return this.language.isMalay() ? "Notis Khas menurut Seksyen 206" : "Special Notice pursuant to Section 206"
  }

  get signaturesForSpecialNotice(): SignatureGroup[] {
    return this.companyDirectorRemoval.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "shareholder"
    })
  }

  get isSpecialNoticeCompleted(): boolean {
    return this.signaturesForSpecialNotice.length >= this.totalNumberOfShareholders.value
  }

  get specialNoticeDateOfCompletion(): string {
    if (!this.isSpecialNoticeCompleted || this.signaturesForSpecialNotice.length <= 0) {
      return "Ongoing"
    }

    let orderedSignatures = ObjectUtil.sort<SignatureGroup>(this.signaturesForSpecialNotice, "createdAt", "desc")

    let lastSignature = orderedSignatures[0]
    return this.time.formatDateOnlyFull(lastSignature.createdAt ?? "")
  }

  get shareholderRange(): number[] {
    return Array.from({ length: this.totalNumberOfShareholders.value }, (_, i) => i)
  }

  get dcrConveneLabel(): string {
    return this.language.isMalay()
      ? "DCR untuk mengadakan EGM bagi Cadangan Penyingkiran Pengarah"
      : "DCR to convene EGM for Proposed Removal of Director"
  }

  get signaturesForDcrConvene(): SignatureGroup[] {
    return this.companyDirectorRemoval.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "director"
    })
  }

  get isDcrToConveneCompleted(): boolean {
    return this.signaturesForDcrConvene.length > 0.5 * (this.totalNumberOfDirectors.value - 1)
  }

  get dcrConveneDateOfCompletion(): string {
    if (!this.isDcrToConveneCompleted || this.signaturesForDcrConvene.length <= 0) {
      return "Ongoing"
    }

    let orderedSignatures = ObjectUtil.sort<SignatureGroup>(this.signaturesForDcrConvene, "createdAt", "desc")

    let lastSignature = orderedSignatures[0]
    return this.time.formatDateOnlyFull(lastSignature.createdAt ?? "")
  }

  get directorRange(): number[] {
    return Array.from({ length: this.totalNumberOfDirectors.value - 1 }, (_, i) => i)
  }

  get serviceWrapperProps() {
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing && !this.isLoading.value

    return new PropsCompanyServiceWrapper(
      this.companyDirectorRemoval.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyDirectorRemoval.value.id,
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
      CompanyDirectorRemoval,
      useCompanyDirectorRemovalStore(),
      false,
      false,
      true
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyDirectorRemoval>(
      this.companyId,
      this.companyDirectorRemoval.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
