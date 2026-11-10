import { CompanyAppointmentOfTaxAgent } from "~/scripts/models/CompanyAppointmentOfTaxAgent"
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
import { Form } from "~/scripts/models/Form"

export class AppointmentOfTaxAgentServiceController extends CompanyServiceController<CompanyAppointmentOfTaxAgent> {
  companyAppointmentOfTaxAgent = ref<CompanyAppointmentOfTaxAgent>(new CompanyAppointmentOfTaxAgent())

  isConfirming: Ref<boolean> = ref<boolean>(false)
  resolutionDateConfirmationPopupRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAppointmentOfTaxAgent, useCompanyAppointmentOfTaxAgentStore(), emitEvents)
    this.target = CompanyConstants.TARGET_TAX_AGENT_APPOINTMENT

    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    if (this.viewType.value !== ViewMode.Past) {
      await Promise.allSettled([this.fetchPrice(), this.fetchOngoingApplication()])

      if (this.hasOngoingApplication.value) {
        this.isInPreviewMode.value = false
        this.viewType.value = ViewMode.Existing
      } else {
        this.isInPreviewMode.value = true
      }
    } else {
      this.isInPreviewMode.value = true
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
      this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
    }

    await this.init(this.companyAppointmentOfTaxAgent.value as CompanyAppointmentOfTaxAgent)
    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let filter = new Filter()
      filter.companyId = this.companyId
      filter.statuses = [
        StatusConstants.PAID,
        StatusConstants.CONFIRMED,
        StatusConstants.READY,
        StatusConstants.CANCELLED,
        StatusConstants.SUBMITTED,
        StatusConstants.COMPLETED,
      ]
      filter.sortOrder = "desc"

      let response = await this.repository.fetchAll(filter)

      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (response.totalRecords <= 0) {
        this.companyAppointmentOfTaxAgent.value = new CompanyAppointmentOfTaxAgent()
        this.companyAppointmentOfTaxAgent.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyAppointmentOfTaxAgent.value = new CompanyAppointmentOfTaxAgent(response.data[0])
      this.hasOngoingApplication.value = true
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForCUD()
        errorMessage.handle()
      }
    }
  }

  setResolutionDateConfirmationPopupRef(popup: any): void {
    this.resolutionDateConfirmationPopupRef = popup
  }

  onWrapperMinimized(applicationData: any): void {
    if (!applicationData) {
      return
    }

    this.companyAppointmentOfTaxAgent.value = new CompanyAppointmentOfTaxAgent(applicationData)

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAppointmentOfTaxAgent.value)
    }
  }

  async onResolutionDateConfirmed(date: string): Promise<void> {
    if (this.isConfirming.value || StringUtil.isNullOrEmpty(date)) {
      return
    }

    if (this.companyAppointmentOfTaxAgent.value.status !== StatusConstants.READY) {
      return
    }

    let pendingAction: "store" | "download" | null = null

    try {
      this.isConfirming.value = true

      let application = new CompanyAppointmentOfTaxAgent(this.companyAppointmentOfTaxAgent.value)
      let repository = useCompanyAppointmentOfTaxAgentStore()
      await application.update(repository)

      if (repository.error) {
        throw repository.error
      }

      this.companyAppointmentOfTaxAgent.value = application
      this.setApplication(application)

      if (this.dcrRef) {
        await this.dcrRef.setApplicationStatus(StatusConstants.READY, application)
      }

      await nextTick()
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        console.error("Failed to save Resolution Date:", error)
      }
      return
    } finally {
      this.isConfirming.value = false
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
        this.companyAppointmentOfTaxAgent.value.id
      )

      await makePayment.setPaymentCart()
      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForCUD()
        errorMessage.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAppointmentOfTaxAgent.value.id)) {
      this.companyAppointmentOfTaxAgent.value.companyId = this.companyId
      await this.companyAppointmentOfTaxAgent.value.create(useCompanyAppointmentOfTaxAgentStore())
    } else {
      await this.companyAppointmentOfTaxAgent.value.update(useCompanyAppointmentOfTaxAgentStore())
    }
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Pelantikan Ejen Cukai" : "Resolution: Appointment of Tax Agent"
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Maklumat Lanjut: Pelantikan Ejen Cukai" : "Learn More: Appointment of Tax Agent"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <p>
          Setiap Sdn. Bhd. bertanggungjawab untuk menguruskan hal ehwal percukaiannya dan mematuhi keperluan di bawah [Akta Cukai Pendapatan 1967].
        </p>

        <p>
          Ejen Cukai ialah seorang profesional berkelayakan yang diberi kuasa untuk mewakili Syarikat dalam urusannya dengan Lembaga Hasil Dalam Negeri Malaysia (LHDN), termasuk menyediakan pengiraan cukai, mengemukakan penyata cukai dan memberikan nasihat percukaian.
        </p>

        <p>
          <b>Siapakah yang Boleh Dilantik?</b>
          <br>
          <br>
          Maklumat yang diperlukan termasuk nama firma ejen cukai, alamat, nombor telefon dan alamat e-mel.
        </p>

        <p>
          <b>Pelantikan melalui Resolusi Pekeliling Pengarah (DCR)</b>
          <br>
          <br>
          Lembaga Pengarah boleh meluluskan pelantikan Ejen Cukai melalui Resolusi Pekeliling Pengarah (DCR), menurut Perenggan 15 Jadual Ketiga Akta Syarikat 2016, tertakluk kepada Perlembagaan Syarikat, jika ada. DCR berfungsi sebagai rekod dalaman rasmi Syarikat bagi kelulusan dan pemberian kuasa oleh Lembaga Pengarah. Permohonan ini memudahkan penyediaan dan kelulusan DCR bagi Pelantikan Ejen Cukai.
        </p>

        <p>
          <b>Apakah yang Berlaku Selepas Pelantikan?</b>
          <ol>
            <li>Menandatangani Surat Pelantikan atau Surat Perjanjian Perkhidmatan yang berkaitan.</li>
            <li>Mengemukakan Surat Pelantikan dan Surat Penerimaan Pelantikan oleh Ejen Cukai kepada LHDN untuk mengemas kini rekod percukaian Syarikat.</li>
            <li>Melengkapkan Borang CP55 sekiranya Ejen Cukai diberi kuasa untuk mengemukakan penyata cukai secara elektronik bagi pihak Syarikat.</li>
            <li>DCR sahaja tidak melengkapkan prosedur pelantikan yang ditetapkan oleh LHDN. Sila rujuk keperluan LHDN untuk maklumat lanjut atau dapatkan nasihat daripada Ejen Cukai anda.</li>
            <li>Pelantikan Ejen Cukai lazimnya tidak memerlukan penyerahan dokumen kepada SSM.</li>
          </ol>
        </p>

        <p>
          <b>Tanggungjawab Pengarah</b>
          <br>
          <br>
          Pelantikan Ejen Cukai tidak melepaskan Pengarah daripada tanggungjawab untuk memastikan maklumat percukaian Syarikat adalah tepat, penyata cukai dikemukakan dalam tempoh yang ditetapkan dan cukai dibayar apabila tiba masanya. Ejen Cukai merupakan penasihat profesional bebas yang dilantik oleh Syarikat dan tidak dilantik, diselia atau diperakukan oleh iCompany Systems.
        </p>

        <p>
          <b>Rujukan:</b>
          <ul>
            <li>Seksyen 153, Akta Cukai Pendapatan 1967</li>
            <li>Garis Panduan LHDN mengenai Pelantikan Ejen Cukai</li>
          </ul>
        </p>
      `
    }

    return `
      <p>
        Every Sdn. Bhd. is responsible for managing its tax affairs and complying with the requirements of the [Income Tax Act 1967].
      </p>
      <p>
        A Tax Agent is a qualified professional authorised to represent the Company in its dealings with the Lembaga Hasil Dalam Negeri Malaysia (LHDN), including preparing tax computations, submitting tax returns and providing tax advice.
      </p>

      <p>
        <b>
          Who Can Be Appointed?
        </b>
        <br>
        <br>
        The required information includes the tax agent firm's name, address,
        phone number and email address.
      </p>

      <p>
        <b>
          Appointment by Directors' Circular Resolution (DCR)
        </b>
        <br>
        <br>
        The Board of Directors may approve the appointment of a Tax Agent through a Directors' Circular Resolution (DCR), pursuant to Paragraph 15 of the Third Schedule of the Companies Act 2016, subject to the Company's Constitution, if any. The DCR serves as the Company's formal internal record of the Board's approval and authorisation. This Application facilitates the preparation and approval of the DCR for the Appointment of Tax Agent.
      </p>

      <p>
        <b>
          What Happens After Appointment?
        </b>
        <ol>
          <li>Execute the relevant Letter of Appointment or Engagement.</li>
          <li>Submit the Letter of Appointment and the Tax Agent's Letter of Acceptance to LHDN for updating the Company's tax records.</li>
          <li>Complete Form CP55 where the Tax Agent is authorised to submit tax returns electronically on behalf of the Company.</li>
          <li>The DCR alone does not complete the appointment procedures required by LHDN. Please see the requirement from LHDN for more information or consult your Tax Agent.</li>
          <li>The appointment of a Tax Agent does not ordinarily require lodgement with SSM.</li>
        </ol>
      </p>

      <p>
        <b>Directors' Responsibilities</b>
      <br>
      <br>
        The appointment of a Tax Agent does not relieve the Directors of their responsibilities to ensure that the Company's tax information is accurate, tax returns are submitted within the prescribed deadlines, and taxes are paid when due. The Tax Agent remains an independent professional adviser engaged by the Company and is not appointed, supervised or endorsed by iCompany Systems.
      </p>

      <p>
        <b>
          Reference:
        </b>
        <ul>
          <li>Section 153, Income Tax Act 1967</li>
          <li>LHDN Guidelines on Appointment of Tax Agents</li>
        </ul>
      </p>
    `
  }

  get taxAgentConfirmationTitle(): string {
    return this.language.isMalay() ? "Resolusi ini telah dimuktamadkan" : "This Resolution is duly confirmed"
  }

  get taxAgentConfirmationText(): string {
    return this.language.isMalay()
      ? "Anda boleh memuat turun dan mencetak Resolusi ini untuk ditandatangani."
      : "You may download and print the Resolution for signing."
  }

  // Getters
  get isShowDownloadPdfOverlay(): boolean {
    return this.companyAppointmentOfTaxAgent.value?.status === StatusConstants.COMPLETED
  }

  get isTaxAgentInformationCompleted(): boolean {
    let application = this.companyAppointmentOfTaxAgent.value

    return !StringUtil.isNullOrEmpty(application.firmName)
  }

  get isTaxAgentInformationConfirmed(): boolean {
    return this.companyAppointmentOfTaxAgent.value.status === StatusConstants.READY
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New
        ? new CompanyAppointmentOfTaxAgent()
        : this.companyAppointmentOfTaxAgent.value

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
      CompanyAppointmentOfTaxAgent,
      useCompanyAppointmentOfTaxAgentStore()
    )

    props.serviceStepProps.hasCustomAffirmation = true
    props.serviceStepProps.canSkipToConfirmation = true
    return props
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAppointmentOfTaxAgent>(
      this.companyId,
      this.companyAppointmentOfTaxAgent.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false,
      ""
    )
  }
}
