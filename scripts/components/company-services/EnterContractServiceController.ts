import { CompanyContractEnter } from "~/scripts/models/CompanyContractEnter"
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

export class EnterContractServiceController extends CompanyServiceController<CompanyContractEnter> {
  companyContractEnter = ref<CompanyContractEnter>(new CompanyContractEnter())

  hasCommonSeal = ref<boolean>(false)

  wrapperRef: any | null = null
  noCommonSealRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyContractEnter, useCompanyContractEnterStore(), emitEvents)
    this.target = CompanyConstants.TARGET_CONTRACT_ENTER
    this.setViewType(viewType)
    this.initializeData()
  }

  setNoCommonSealRef(noCommonSealRef: any): void {
    this.noCommonSealRef = noCommonSealRef
  }

  async initializeData(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyContractEnter.value = new CompanyContractEnter(this.companyServiceInitializer.newApplication)
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
          this.companyContractEnter.value = new CompanyContractEnter(this.companyServiceInitializer.existingApplication)
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
        this.companyContractEnter.value = new CompanyContractEnter(this.companyServiceInitializer.existingApplication)
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyContractEnter.value as CompanyContractEnter)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyContractEnter.value = new CompanyContractEnter()
        this.companyContractEnter.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyContractEnter.value = new CompanyContractEnter(apiRecord.data[0])
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

      let lastApplication = new CompanyContractEnter(apiRecord.data[0])
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

  async onApplicationUpdated(application: CompanyContractEnter): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyContractEnter.value)
    }
  }

  setApplicationData(applicationData: CompanyContractEnter): void {
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

      if (StringUtil.isNullOrEmpty(this.companyContractEnter.value.id)) {
        await this.submitApplication()
      }

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companyContractEnter.value.id
      )
      await makePayment.setPaymentCart()

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
    if (StringUtil.isNullOrEmpty(this.companyContractEnter.value.id)) {
      this.companyContractEnter.value.companyId = this.companyId
      await this.companyContractEnter.value.create(useCompanyContractEnterStore())
    } else {
      await this.companyContractEnter.value.update(useCompanyContractEnterStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (!this.hasCommonSeal.value) {
      if (this.noCommonSealRef) {
        this.noCommonSealRef.show()
      }
      return
    }

    if (StringUtil.isNullOrEmpty(this.companyContractEnter.value.id) || !this.hasPaid()) {
      this.makePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  onAdoptCommonSeal(): void {
    let router = useRouter()
    router.push(`/sdnbhd/${this.companyId}/common-seals`)
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef

    this.setOptionButtons()
  }

  setOptionButtons(): void {
    if (!this.wrapperRef) {
      return
    }

    let label = this.language.isMalay() ? "Tukar Alamat Berdaftar" : "Change Registered Address"
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Tukar Alamat Berdaftar" : "Change Registered Address"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `Apabila sesebuah syarikat menukar alamat berdaftar, syarikat
        tersebut perlu memberitahu SSM (Suruhanjaya Syarikat Malaysia) mengenai
        perubahan itu dalam tempoh empat belas hari dari tarikh kuat kuasa perubahan.
        <br><br>
        Alamat berdaftar adalah alamat rasmi syarikat yang didaftarkan dengan SSM,
        di mana semua surat-menyurat rasmi dan notis undang-undang akan dihantar.
        Pemberitahuan pertukaran alamat berdaftar hendaklah dibuat dalam borang dan
        cara yang ditetapkan oleh Arahan Amalan SSM. Merupakan suatu kesalahan
        di bawah Seksyen 591 Akta Syarikat 2016 untuk memberikan maklumat palsu atau
        mengelirukan kepada Pendaftar.`
    }

    return `When a company changes its registered address, it must notify
      SSM (Companies Commission of Malaysia) of the change within fourteen days
      from the effective date of the change.
      <br><br>
      The registered address is the company's official address registered with SSM,
      where all official correspondence and legal notices will be sent.
      The notification of change in registered address is to be done in the form
      and manner specified by SSM's Practice Directive. It is an offense
      under Section 591 of the Companies Act 2016 to provide false or misleading
      information to the Registrar.`
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Kontrak Syarikat" : "Contracts of the Company"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        Resolusi ini merekodkan kelulusan Pengarah bagi Syarikat untuk memeterai perjanjian 
        dengan mana-mana pihak ketiga dan memberi kuasa kepada penandatangan bagi pihak Syarikat.
        <br><br>
        Salinan perjanjian yang telah ditandatangani hendaklah dikemukakan untuk adjudikasi 
        setem (jika berkenaan) dan mana-mana salinan fizikal adalah disyorkan untuk difailkan 
        dengan teratur di alamat perniagaan anda atau mana-mana storan digital yang dikawal 
        oleh Syarikat untuk simpanan selamat.
        <br><br>
        Sila pastikan butiran perjanjian telah disahkan sebelum meneruskan proses menandatangani.
      `
    }

    return `
      This Resolution records the Director’s approval for the Company to enter into an agreement
      with any third party and to authorise a signatory on behalf of the Company.
      <br><br>
      A copy of the signed agreement should be adjudicated for stamping (where applicable)
      and any physical copies is recommended to be properly filed at your business address or any
      digital storage controlled by the Company for safekeeping.
      <br><br>
      Please ensure the agreement details are confirmed before proceeding to sign.
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Kontrak Syarikat" : "Resolution: Entering into Contracts"
  }

  get serviceWrapperProps() {
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyContractEnter.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyContractEnter.value.id,
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
      CompanyContractEnter,
      useCompanyContractEnterStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyContractEnter>(
      this.companyId,
      this.companyContractEnter.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
