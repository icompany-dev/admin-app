import { CompanyAuditExtensionOfTime } from "~/scripts/models/CompanyAuditExtensionOfTime"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { Filter } from "~/scripts/library/Filter"
import { StatusConstants } from "~/scripts/constants/Status"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PaymentConstants } from "~/scripts/constants/Payment"

export class ExtensionOfTimeServiceController extends CompanyServiceController<CompanyAuditExtensionOfTime> {
  companyAuditExtensionOfTime = ref<CompanyAuditExtensionOfTime>(new CompanyAuditExtensionOfTime())

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAuditExtensionOfTime, useCompanyAuditExtensionOfTimeStore(), emitEvents)
    this.target = CompanyConstants.TARGET_AUDIT_EXTENSION_OF_TIME

    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    if (this.viewType.value !== ViewMode.Past) {
      await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])

      if (this.hasOngoingApplication.value) {
        this.isInPreviewMode.value = false
        this.viewType.value = ViewMode.Existing
      } else {
        this.isInPreviewMode.value = true
        this.viewType.value = ViewMode.New
      }
    } else {
      this.isInPreviewMode.value = true
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
      this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
    }

    this.init(this.companyAuditExtensionOfTime.value as CompanyAuditExtensionOfTime)
    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let filter = new Filter()
      filter.companyId = this.companyId
      filter.statuses = [StatusConstants.PAID, StatusConstants.SUBMITTED]
      filter.sortOrder = "desc"

      let response = await this.repository.fetchAll(filter)

      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (response.totalRecords <= 0) {
        this.companyAuditExtensionOfTime.value = new CompanyAuditExtensionOfTime()
        this.companyAuditExtensionOfTime.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyAuditExtensionOfTime.value = new CompanyAuditExtensionOfTime(response.data[0])
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

  onWrapperMinimized(applicationData: any): void {
    if (!applicationData) {
      return
    }

    this.companyAuditExtensionOfTime.value = new CompanyAuditExtensionOfTime(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAuditExtensionOfTime.value)
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
        this.companyAuditExtensionOfTime.value.id
      )
      await makePayment.setPaymentCart()

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (!StringUtil.isNullOrEmpty(this.companyAuditExtensionOfTime.value.id)) {
        await this.companyAuditExtensionOfTime.value.remove(useCompanyAuditExtensionOfTimeStore())
      }

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
    if (StringUtil.isNullOrEmpty(this.companyAuditExtensionOfTime.value.id)) {
      this.companyAuditExtensionOfTime.value.companyId = this.companyId
      await this.companyAuditExtensionOfTime.value.create(useCompanyAuditExtensionOfTimeStore())
    } else {
      await this.companyAuditExtensionOfTime.value.update(useCompanyAuditExtensionOfTimeStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (!StringUtil.isNullOrEmpty(this.companyAuditExtensionOfTime.value.id) && !this.hasPaid()) {
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

  override onBackButtonClicked(): void {
    this.emitEvents(EmitMessages.BACK)
  }

  slipCaseTitle(): string {
    return this.language.isMalay()
      ? "Resolusi: Lanjutan Masa untuk Edar/Serah Penyata Kewangan"
      : "Resolution: Extension of Time to Circulate/Lodge Financial Statements"
  }

  alertTitle(): string {
    return this.language.isMalay()
      ? "Maklumat Lanjut: Lanjutan Masa untuk Edar dan/atau Serah Simpan Penyata Kewangan"
      : "Learn More: Extension of Time to Circulate and/or Lodge Financial Statements"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <p>
          Di bawah Akta Syarikat 2016, sesebuah syarikat boleh mengemukakan permohonan kepada 
          Pendaftar Suruhanjaya Syarikat Malaysia (SSM) untuk melanjutkan tempoh masa (EOT) 
          sekiranya syarikat tidak dapat mengedarkan atau menyerah simpan penyata kewangannya 
          dalam tempoh statutori yang telah ditetapkan. Syarikat swasta (Sdn. Bhd.) dikehendaki 
          mengedarkan penyata kewangan dalam tempoh enam bulan dari tarikh akhir tahun kewangan
          mereka, manakala syarikat awam (Bhd.) mesti berbuat demikian dalam tempoh dua puluh 
          satu hari sebelum Mesyuarat Agung Tahunan (AGM). Selain itu, penyata tersebut 
          hendaklah diserahkan kepada SSM dalam tempoh tiga puluh hari selepas diedarkan 
          (bagi syarikat swasta) atau selepas AGM (bagi syarikat awam).
        </p>
        <p>
          Bagi mengelakkan penalti pelanggaran atau pematuhan lewat statutori, permohonan 
          pelanjutan masa tersebut mestilah dikemukakan secara rasmi kepada SSM sebelum 
          tarikh tamat tempoh yang asal. Setiausaha syarikat perlu mengemukakan alasan-alasan 
          munasabah bagi kelewatan tersebut, seperti komplikasi pengauditan yang tidak 
          dikesan awal, penstrukturan semula syarikat yang belum selesai, atau gangguan 
          logistik yang serius.
        </p>
        <p>
          <b>Rujukan:</b> Seksyen 259(2) & 609 Akta Syarikat 2016
        </p>
      `
    }

    return `
      <p>
        Under the Companies Act 2016, a Sdn Bhd may apply to the Registrar of the Companies
        Commission of Malaysia (SSM) for an extension of time (EOT) if it cannot circulate 
        or lodge its financial statements within the prescribed statutory timeframes. Private 
        companies are required to circulate financial statements within six months from their 
        financial year-end, while public companies must do so within twenty-one days before their 
        Annual General Meeting (AGM). Additionally, these statements must be lodged with SSM 
        within thirty days after being circulated (for private companies) or after the AGM 
        (for public companies).
      </p>
      <p>
        To prevent late compliance penalties or statutory breaches, the application for an 
        extension of time must be formally submitted to SSM before the original expiry date. 
        The company secretary must provide justifiable reasons for the delay, such as unforeseen 
        auditing complications, incomplete restructuring, or severe logistical disruptions.
      </p>
      <p>
        <b>Reference:</b> Sections 259(2) & 609 of Companies Act 2016
      </p>
    `
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyAuditExtensionOfTime() : this.companyAuditExtensionOfTime.value

    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
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
      CompanyAuditExtensionOfTime,
      useCompanyAuditExtensionOfTimeStore()
    )

    props.serviceStepProps.isPascaInPasca = true

    return props
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAuditExtensionOfTime>(
      this.companyId,
      this.companyAuditExtensionOfTime.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false,
      this.companyAuditExtensionOfTime.value.financialPeriodId ?? ""
    )
  }
}
