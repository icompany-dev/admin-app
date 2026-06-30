import { CompanyDirectorManagerAppointment } from "~/scripts/models/CompanyDirectorManagerAppointment"
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
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import type { PaymentOrderItem } from "~/scripts/models/PaymentOrderItem"
import type { PaymentOrderItemOptional } from "~/scripts/models/PaymentOrderItemOptional"

export class AppointManagerServiceController extends CompanyServiceController<CompanyDirectorManagerAppointment> {
  companyDirectorManagerAppointment = ref<CompanyDirectorManagerAppointment>(new CompanyDirectorManagerAppointment())

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(
      companyId,
      true,
      false,
      CompanyDirectorManagerAppointment,
      useCompanyDirectorManagerAppointmentStore(),
      emitEvents
    )

    this.target = CompanyConstants.TARGET_DIRECTOR_MANAGER_APPOINTMENT
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    this.isLoading.value = true
    this.companyDirectorManagerAppointment.value = new CompanyDirectorManagerAppointment()

    if (this.viewType.value !== ViewMode.Past) {
      await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])

      if (this.hasOngoingApplication.value) {
        this.viewType.value = ViewMode.Existing
        this.emitEvents(EmitMessages.GO_TO_EXISTING)
      } else {
        this.viewType.value = ViewMode.New
        this.emitEvents(EmitMessages.GO_TO_NEW)
      }
    } else {
      this.isInPreviewMode.value = true
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
      this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
    }

    this.init(this.companyDirectorManagerAppointment.value as CompanyDirectorManagerAppointment)

    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      let applicationForOthers = apiRecord.data.find((record: any) => {
        let appointment = new CompanyDirectorManagerAppointment(record)
        return appointment.roleName !== "Chairman"
      })

      if (apiRecord.totalRecords <= 0 || !applicationForOthers) {
        this.companyDirectorManagerAppointment.value = new CompanyDirectorManagerAppointment()
        this.companyDirectorManagerAppointment.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyDirectorManagerAppointment.value = new CompanyDirectorManagerAppointment(applicationForOthers)
      this.isInPreviewMode.value = false
      this.hasOngoingApplication.value = true
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

      let lastApplication = new CompanyDirectorManagerAppointment(apiRecord.data[0])
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

  isPreview(): boolean {
    return this.isInPreviewMode.value
  }

  async onApplicationUpdated(application: CompanyDirectorManagerAppointment): Promise<void> {
    if (this.viewType.value === ViewMode.New) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyDirectorManagerAppointment.value)
    }
  }

  setApplicationData(applicationData: CompanyDirectorManagerAppointment): void {
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
        this.target,
        this.companyDirectorManagerAppointment.value.id
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
    if (StringUtil.isNullOrEmpty(this.companyDirectorManagerAppointment.value.id)) {
      this.companyDirectorManagerAppointment.value.companyId = this.companyId
      await this.companyDirectorManagerAppointment.value.create(useCompanyDirectorManagerAppointmentStore())
    } else {
      await this.companyDirectorManagerAppointment.value.update(useCompanyDirectorManagerAppointmentStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyDirectorManagerAppointment.value.id) || !this.hasPaid()) {
      this.makePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  async handlePostPayment(): Promise<void> {
    if (!this.eventManager.isHandlePostPayment || !this.eventManager.paymentOrderId) {
      return
    }

    let paymentOrderId = this.eventManager.paymentOrderId
    let paymentOrderRepository = usePaymentOrderStore()
    let response = await paymentOrderRepository.fetch(paymentOrderId)
    if (!response) {
      return
    }

    let paymentOrder = new PaymentOrder(response)
    let paymentOrderItem = paymentOrder.items.find((poi: PaymentOrderItem) => {
      return poi.targetType === this.target && poi.targetId === this.companyDirectorManagerAppointment.value.id
    })

    if (!paymentOrderItem) {
      return
    }

    let isUpdateRegistryRequired = paymentOrderItem.optionals.some((opt: PaymentOrderItemOptional) => {
      return opt.servicePricingId === "16318c1a-ba99-4518-8ecf-8b85ee38b0a6"
    })

    if (isUpdateRegistryRequired) {
      this.companyDirectorManagerAppointment.value.isUpdateRegistryRequired = true
      await this.companyDirectorManagerAppointment.value.postPaymentUpdate(useCompanyDirectorManagerAppointmentStore())
    }

    this.eventManager.setIsHandlePostPayment(false)
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Lantik Pengarah Baharu" : "Appoint New Director"
  }

  helpDescription(): string {
    //TODO: Get the copywriting for this
    if (this.language.isMalay()) {
      return `Apabila sesebuah syarikat menukar alamat perniagaan atau cawangan, syarikat
        tersebut perlu memberitahu SSM (Suruhanjaya Syarikat Malaysia) mengenai
        perubahan itu dalam tempoh empat belas hari dari tarikh kuat kuasa perubahan.
        Perkara ini dilakukan melalui borang khusus untuk "Pemberitahuan Pertukaran
        Alamat Perniagaan/Cawangan dan/atau Jenis Perniagaan".
        <br><br>
        Pemberitahuan pertukaran alamat perniagaan hendaklah dibuat dalam borang dan
        cara yang ditetapkan oleh Arahan Amalan SSM 2/2017. Merupakan suatu kesalahan
        di bawah Seksyen 591 Akta Syarikat 2016 untuk memberikan maklumat palsu atau
        mengelirukan kepada Pendaftar.`
    }

    return `When a company changes its business or branch address, it must notify
      SSM of the change within fourteen days from the effective date of the change.
      This is done through a specific form for "Notification of Change in the
      Business/Branch Address and/or Nature of Business".
      <br><br>
      The notification of change in business address is to be done in the form
      and manner specified by SSM's Practice Directive 2/2017. It is an offense
      under Section 591 of the Companies Act 2016 to provide false or misleading
      information to the Registrar.`
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Lantik Pengurus / CEO" : "Resolution: Appoint CEO / Manager"
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Maklumat Lanjut: Lantik Pengurus / CEO" : "Learn More: Appoint CEO / Manager"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <p>
          Di bawah Akta Syarikat 2016, seorang "pengurus" ditakrifkan sebagai pegawai eksekutif utama sesebuah 
          syarikat, tanpa mengambil kira gelaran jawatan sebenar mereka. Walaupun istilah "Ketua Pegawai Eksekutif" 
          (CEO) tidak ditakrifkan secara eksplisit, Akta tersebut menganggap sesiapa sahaja yang memegang 
          jawatan kepimpinan tertinggi sebagai pengarah sekiranya lembaga pengarah lazimnya bertindak mengikut 
          arahan mereka. Oleh kerana peranan ini melibatkan tanggungjawab utama bagi pengurusan syarikat, mereka 
          dikehendaki oleh undang-undang untuk mematuhi kewajipan ketat yang sama seperti pengarah, seperti bertindak 
          dengan niat baik dan bagi maksud yang wajar.
        </p>
        <p>
          Undang-undang menetapkan agar syarikat menyelenggara satu daftar dalaman di pejabat berdaftar yang 
          mengandungi butir-butir terperinci mengenai semua pengurusnya. Apabila seorang pengurus baharu 
          dilantik atau pengurus sedia ada meletakkan jawatan, syarikat mestilah <b>memaklumkan kepada Pendaftar 
          (SSM) dalam tempoh 14 hari</b>. Ini adalah bagi memastikan rekod awam mencerminkan dengan tepat 
          individu yang menjalankan operasi harian perniagaan tersebut.
        </p>
        <p>
          <b>Rujukan:</b> Seksyen 2, 57, 58 dan 210 Akta Syarikat 2016.
        </p>
      `
    }

    return `
      <p>
        Under the Companies Act 2016, a "manager" is defined as the principal executive officer of a company, regardless of 
        their actual job title. While the term "CEO" isn't explicitly defined, the Act treats anyone in a top leadership 
        position as a director if the board is accustomed to acting on their instructions. Because these roles involve 
        primary responsibility for the company’s management, they are legally required to follow the same strict duties 
        as directors, such as acting in good faith and for a proper purpose.
      </p>
      <p>
        The law requires the company to maintain an internal register at the registered office containing the details of 
        all its managers. Whenever a new manager is appointed or an existing one leaves, the company <b>must notify the 
        Registrar (SSM) within 14 days</b>. This ensures that the public records accurately reflect who is running the 
        day-to-day operations of the business.
      </p>
      <p>
        <b>Reference:</b> Sections 2, 57, 58 and 210 of the Companies Act 2016
      </p>
    `
  }

  override loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  override loaderSublabel(): string {
    return this.language.isMalay() ? "Resolusi Anda" : "Resolution"
  }

  override processingLabel(): string {
    return this.language.isMalay() ? "Menunggu Majoriti" : "Pending Majority"
  }

  get serviceWrapperProps() {
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyDirectorManagerAppointment.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyDirectorManagerAppointment.value.id,
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
      CompanyDirectorManagerAppointment,
      useCompanyDirectorManagerAppointmentStore(),
      false,
      true
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyDirectorManagerAppointment>(
      this.companyId,
      this.companyDirectorManagerAppointment.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
