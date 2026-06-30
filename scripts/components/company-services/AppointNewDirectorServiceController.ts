import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { MakePayment } from "~/scripts/library/MakePayment"
import type { PaymentCartItem } from "~/scripts/models/PaymentCartItem"
import { ServicePricingOptional } from "~/scripts/models/ServicePricingOptional"
import { PaymentCartItemOptional } from "~/scripts/models/PaymentCartItemOptional"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { ObjectUtil } from "~/scripts/utils/Object"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class AppointNewDirectorServiceController extends CompanyServiceController<CompanyDirectorAppointment> {
  companyDirectorAppointment = ref<CompanyDirectorAppointment>(new CompanyDirectorAppointment())

  isByShareholder: Ref<boolean> = ref<boolean>(false)

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, isByShareholder: boolean, emitEvents: any | null) {
    super(companyId, true, false, CompanyDirectorAppointment, useCompanyDirectorAppointmentStore(), emitEvents)

    this.target = CompanyConstants.TARGET_DIRECTOR_APPOINTMENT
    this.setViewType(viewType)
    this.setIsByShareholder(isByShareholder)
    this.initializeData()
  }

  setIsByShareholder(isByShareholder: boolean): void {
    this.isByShareholder.value = isByShareholder
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyDirectorAppointment.value = new CompanyDirectorAppointment(
          this.companyServiceInitializer.newApplication
        )
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        this.hasOngoingApplication.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        this.companyDirectorAppointment.value = new CompanyDirectorAppointment(
          this.companyServiceInitializer.existingApplication
        )

        if (StringUtil.isNullOrEmpty(this.companyDirectorAppointment.value.id)) {
          this.hasOngoingApplication.value = false
          this.isInPreviewMode.value = true
        }
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyDirectorAppointment.value as CompanyDirectorAppointment)
    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyDirectorAppointment.value = new CompanyDirectorAppointment()
        this.companyDirectorAppointment.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyDirectorAppointment.value = new CompanyDirectorAppointment(apiRecord.data[0])
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

      let lastApplication = new CompanyDirectorAppointment(apiRecord.data[0])
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

  async onApplicationUpdated(application: CompanyDirectorAppointment): Promise<void> {
    if (this.viewType.value === ViewMode.New) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyDirectorAppointment.value)
    }
  }

  setApplicationData(applicationData: CompanyDirectorAppointment): void {
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
        this.companyDirectorAppointment.value.id
      )
      await makePayment.setPaymentCart()

      let paymentCartItem = makePayment.paymentCart.items.find((pci: PaymentCartItem) => {
        return pci.targetType === this.target && pci.targetId === this.companyDirectorAppointment.value.id
      })

      if (paymentCartItem) {
        paymentCartItem.servicePricing.optionals.forEach((opt: ServicePricingOptional) => {
          if (opt.optionalServicePrice.id !== "b9edec15-e578-4139-be83-a11c2aa10315") {
            return
          }

          let newPaymentCartItemOptional = new PaymentCartItemOptional()
          newPaymentCartItemOptional.servicePricing = new ServicePricing(opt.optionalServicePrice)
          newPaymentCartItemOptional.servicePricingId = opt.optionalServiceId ?? ""
          newPaymentCartItemOptional.isDisabled = true
          paymentCartItem?.optionals.push(newPaymentCartItemOptional)
          paymentCartItem?.selectedOptionals.push(new ServicePricingOptional(opt))
        })
      }

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
    if (StringUtil.isNullOrEmpty(this.companyDirectorAppointment.value.id)) {
      this.companyDirectorAppointment.value.companyId = this.companyId
      await this.companyDirectorAppointment.value.create(useCompanyDirectorAppointmentStore())
    } else {
      await this.companyDirectorAppointment.value.update(useCompanyDirectorAppointmentStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyDirectorAppointment.value.id) || !this.hasPaid()) {
      this.makePayment()
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

    let label = this.language.isMalay() ? "Lantik Pengarah Baharu" : "Appoint New Director"
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
    if (this.isByShareholder.value) {
      return this.language.isMalay()
        ? "Resolusi: Perlantikan Pengarah oleh Pemegang Saham"
        : "Resolution: Shareholder Appointed Director"
    }

    return this.language.isMalay() ? "Resolusi: Perlantikan Pengarah Baharu" : "Resolution: Appointment of New Director"
  }

  alertTitle(): string {
    return this.language.isMalay()
      ? "Maklumat Lanjut: Perlantikan Pengarah Baharu"
      : "Learn More: Appointment of New Director"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <p>
          Sesebuah syarikat boleh melantik Pengarah baharu selaras dengan Akta Syarikat 2016 dan Perlembagaan 
          syarikat, sekiranya ia diguna pakai.
        </p>
        <p>
          Di bawah Seksyen 201 Akta Syarikat 2016, seseorang individu mestilah memberi persetujuan secara 
          bertulis sebelum dilantik sebagai Pengarah. Individu tersebut juga perlu memenuhi syarat kelayakan 
          minimum, termasuk berumur sekurang-kurangnya 18 tahun dan tidak hilang kelayakan di bawah undang-undang.
        </p>
        <p>
          Pelantikan biasanya dibuat oleh Lembaga Pengarah atau oleh Pemegang Saham, bergantung kepada 
          Perlembagaan dan keadaan syarikat. Bagi konteks ini, pelantikan melalui iCompany Systems hanya akan 
          berkuat kuasa setelah pelaksanaan resolusi yang diperlukan, penyempurnaan pengenalan diri Pengarah 
          yang dilantik melalui eKYC kami, dan penyerahsimpanan susulan kepada SSM serta kemas kini Daftar 
          Pengarah di bawah Seksyen 58 dalam tempoh masa yang ditetapkan.
        </p>
        <p>
          Aplikasi ini memudahkan penyediaan Resolusi dan dokumentasi yang diperlukan untuk merasmikan pelantikan 
          tersebut, termasuk persetujuan Pengarah seperti yang ditetapkan di bawah Seksyen 201.
        </p>
        <p>
          Anda diingatkan bahawa seseorang Pengarah memikul <span class='glossary' id='directors'>tugas fidusiari 
          dan tanggungjawab statutori</span> sebaik sahaja dilantik, termasuk bertindak dengan niat baik demi 
          kepentingan terbaik syarikat, mengelakkan konflik kepentingan, serta melaksanakan penjagaan, kemahiran, 
          dan usaha wajar yang munasabah.
        </p>
        <p>
          <b>Rujukan:</b> Seksyen 57, 58, 201 dan 202 Akta Syarikat 2016.
        </p>
      `
    }

    return `
      <p>
        A company may appoint a new Director in accordance with the Companies Act 2016 and its Constitution, 
        if it is adopted.
      </p>
      <p>
        Under Section 201 of the Companies Act 2016, a person must consent in writing before being appointed 
        as a Director. The individual must also satisfy the minimum requirements, including being at least 
        18 years of age and not disqualified under the law.
      </p>
      <p>
        The appointment is typically made by the Board of Directors or by the Shareholders, depending on the 
        Constitution and circumstances of the company.
      </p>
      <p>
        For this context, the appointment with iCompany Systems will only take effect upon the execution of 
        the required resolutions, completion of the proper identification of the appointed Director via our eKYC, 
        and subsequent lodgement with SSM and update of Register of Directors under Section 58 within the 
        prescribed timeframe.
      </p>
      <p>
        This Application facilitates the preparation of the necessary Resolution and documentation to formalise 
        the appointment, including the Director’s consent as prescribed under Section 201.
      </p>
      <p>
        You are reminded that a Director assumes <span class='glossary' id='directors'>fiduciary duties and 
        statutory responsibilities upon appointment</span>, including acting in good faith in the best 
        interest of the company, avoiding conflicts of interest, and exercising reasonable care, skill, 
        and diligence.
      </p>
      <p>
        <b>Reference:</b> Sections 57, 58, 201 and 202 of the Companies Act 2016
      </p>
    `
  }

  // PASCA functions
  isMajorityReached(): boolean {
    if (!this.application.value) {
      return false
    }

    let totalSigned = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return this.companyDirectorAppointment.value.isAppointByShareholder
        ? sg.group?.target === "director"
        : sg.group?.target === "shareholder"
    }).length

    let percentage = Math.ceil((totalSigned / this.totalNumberOfDirectors.value) * 100)

    return percentage >= 50
  }

  override isStepStatusVisible(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.paidAt !== null && this.isMajorityReached()
  }

  signatureDate(): string {
    if (!this.application.value) {
      return ""
    }

    if (this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    if (this.isMajorityReached()) {
      let shareholderSignatures = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
        return this.companyDirectorAppointment.value.isAppointByShareholder
          ? sg.group?.target === "director"
          : sg.group?.target === "shareholder"
      })

      if (shareholderSignatures.length > 0) {
        let sorted = ObjectUtil.sort<SignatureGroup>(shareholderSignatures, "createdAt", "desc")

        return this.time.formatDateOnlyShort(sorted[0].createdAt ?? "")
      }
    }

    if (this.hasSigned()) {
      return this.userSignatureDate()
    }

    return ""
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyDirectorAppointment() : this.companyDirectorAppointment.value

    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyDirectorAppointment.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyDirectorAppointment.value.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.isMajorityReached(),
      this.hasSigned(),
      this.signatureDate(),
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
      CompanyDirectorAppointment,
      useCompanyDirectorAppointmentStore(),
      this.isByShareholder.value,
      true
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyDirectorAppointment>(
      this.companyId,
      this.companyDirectorAppointment.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      this.isByShareholder.value
    )
  }
}
