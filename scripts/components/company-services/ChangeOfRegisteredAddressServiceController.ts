import { CompanyAmendmentRegisteredAddress } from "~/scripts/models/CompanyAmendmentRegisteredAddress"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { MakePayment } from "~/scripts/library/MakePayment"
import { ObjectUtil } from "~/scripts/utils/Object"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class ChangeOfRegisteredAddressServiceController extends CompanyServiceController<CompanyAmendmentRegisteredAddress> {
  companyAmendmentRegisteredAddress = ref<CompanyAmendmentRegisteredAddress>(new CompanyAmendmentRegisteredAddress())

  wrapperRef: any | null = null
  confirmationPopupRef: any | null = null
  handoverPopupRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(
      companyId,
      true,
      false,
      CompanyAmendmentRegisteredAddress,
      useCompanyAmendmentRegisteredAddressStore(),
      emitEvents
    )
    this.target = CompanyConstants.TARGET_AMENDMENT_REGISTERED_ADDRESS
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyAmendmentRegisteredAddress.value = new CompanyAmendmentRegisteredAddress(
          this.companyServiceInitializer.newApplication
        )
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
          this.companyAmendmentRegisteredAddress.value = new CompanyAmendmentRegisteredAddress(
            this.companyServiceInitializer.existingApplication
          )
        }

        if (!this.hasOngoingApplication.value) {
          this.showConfirmationPopup()
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        this.hasOngoingApplication.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        this.companyAmendmentRegisteredAddress.value = new CompanyAmendmentRegisteredAddress(
          this.companyServiceInitializer.existingApplication
        )

        if (StringUtil.isNullOrEmpty(this.companyAmendmentRegisteredAddress.value.id)) {
          this.hasOngoingApplication.value = false
          this.isInPreviewMode.value = true
        } else {
          this.showHandoverPopup()
        }
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyAmendmentRegisteredAddress.value as CompanyAmendmentRegisteredAddress)
    this.isLoading.value = false
  }

  setConfirmationPopupRef(popupRef: any | null): void {
    this.confirmationPopupRef = popupRef
  }

  showConfirmationPopup(): void {
    if (this.confirmationPopupRef) {
      this.confirmationPopupRef.show()
    }
  }

  onPopupCancel(): void {
    this.router.back()
  }

  onPopupProceed(): void {
    // Proceed with registered address change
  }

  setHandoverPopupRef(popupRef: any | null): void {
    this.handoverPopupRef = popupRef
  }

  showHandoverPopup(): void {
    if (this.application.value && this.application.value.signatureGroups.length > 1) {
      return
    }

    if (this.handoverPopupRef) {
      this.handoverPopupRef.show()
    }
  }

  onHandoverCancel(): void {
    // Cancel handover
  }

  onHandoverProceed(): void {
    // trigger download
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyAmendmentRegisteredAddress.value = new CompanyAmendmentRegisteredAddress()
        this.companyAmendmentRegisteredAddress.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyAmendmentRegisteredAddress.value = new CompanyAmendmentRegisteredAddress(apiRecord.data[0])
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

      let lastApplication = new CompanyAmendmentRegisteredAddress(apiRecord.data[0])
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

  async onApplicationUpdated(application: CompanyAmendmentRegisteredAddress): Promise<void> {
    if (!application) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAmendmentRegisteredAddress.value)
    }
  }

  setApplicationData(applicationData: CompanyAmendmentRegisteredAddress): void {
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
        CompanyConstants.TARGET_AMENDMENT_REGISTERED_ADDRESS,
        this.companyAmendmentRegisteredAddress.value.id
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
    if (StringUtil.isNullOrEmpty(this.companyAmendmentRegisteredAddress.value.id)) {
      this.companyAmendmentRegisteredAddress.value.companyId = this.companyId
      await this.companyAmendmentRegisteredAddress.value.create(useCompanyAmendmentRegisteredAddressStore())
    } else {
      await this.companyAmendmentRegisteredAddress.value.update(useCompanyAmendmentRegisteredAddressStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAmendmentRegisteredAddress.value.id) || !this.hasPaid()) {
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

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Tukar Alamat Berdaftar" : "Resolution: Change of Registered Address"
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Maklumat Lanjut: Alamat Berdaftar" : "Learn More: Registered Address"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <p>
          Sesebuah syarikat mestilah mempunyai <span class='glossary' id='registered-address'>Alamat Berdaftar</span> 
          pada setiap masa, iaitu alamat rasmi yang direkodkan dengan SSM bagi tujuan statutori dan undang-undang. 
          <br>
          Alamat Berdaftar merupakan tempat di mana semua notis rasmi, surat-menyurat, dan dokumen daripada pengawal 
          selia, pihak berkuasa, serta pihak ketiga disampaikan. Ia juga merupakan alamat di mana rekod statutori 
          syarikat disimpan, melainkan diisytiharkan sebaliknya.
        </p>
        <p>
          Sekiranya rekod statutori <span class='glossary' id='registered-address'>Tidak Disimpan di Alamat Berdaftar</span>, 
          syarikat mestilah menyerah simpan pengisytiharan kepada SSM dengan menyatakan lokasi alternatif di mana rekod 
          tersebut diselenggarakan. 
          <br>
          Alamat ini mestilah alamat fizikal di dalam Malaysia yang mudah diakses dalam waktu bekerja biasa dan tidak 
          boleh menggunakan alamat Peti Surat (P.O. Box).
        </p>
        <p>
          Alamat ini biasanya diselenggarakan oleh Setiausaha Syarikat sebagai sebahagian daripada kerangka pematuhan syarikat. 
          Sebarang pertukaran Alamat Berdaftar mestilah dimaklumkan kepada SSM dalam tempoh masa yang ditetapkan, dan pertukaran 
          tersebut hanya berkuat kuasa setelah penyerahsimpanan dan pendaftaran dilakukan oleh SSM. Alamat Berdaftar tidak semestinya
          merupakan tempat perniagaan beroperasi. Ia adalah berbeza daripada Alamat Perniagaan dan mana-mana Alamat Cawangan syarikat.
        </p>
        <p>
          Anda diingatkan bahawa kegagalan untuk mengekalkan Alamat Berdaftar yang sah atau gagal mengisytiharkan lokasi rekod 
          statutori dengan betul boleh mengakibatkan ketidakpatuhan, termasuk terlepas notis statutori dan kemungkinan dikenakan 
          tindakan penguatkuasaan.
        </p>
        <p>
          <b>Rujukan:</b> Seksyen 46 dan 47 Akta Syarikat 2016.
        </p>
      `
    }

    return `
      <p>
        A company must have a <span class='glossary' id='registered-address'>Registered Address</span> at all times, 
        being the official address recorded with SSM for statutory and legal purposes.
        <br>
        The Registered Address is where all official notices, correspondence, and documents from regulators, authorities, 
        and third parties are served. It is also the address where the company’s statutory records are kept, unless otherwise declared.
      </p>
      <p>
        If the statutory records are <span class='glossary' id='registered-address'>Not Kept at the Registered Address</span>, 
        the company must lodge a declaration to SSM specifying the alternative location where such records are maintained.
        <br>
        This address must be a physical address within Malaysia that is easily accessible within normal working hours and cannot be a P.O. Box.
      </p>
      <p>
        It is typically maintained by the Company Secretary as part of the company’s compliance framework. Any change 
        to the Registered Address must be notified to SSM within the prescribed timeframe, and the change will only 
        take effect upon lodgement and registration by SSM. The Registered Address does not need to be the place where 
        the business operates. It is distinct from the Business Address and any Branch Address of the company.
      </p>
      <p>
        You are reminded that failure to maintain a valid Registered Address or to properly declare the location of 
        statutory records may result in non-compliance, including missed statutory notices and potential regulatory action.
      </p>
      <p>
        <b>Reference:</b> Sections 46 and 47 of the Companies Act 2016
      </p>
    `
  }

  // PASCA functions
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

  hasAtLeastOneSignature(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value && this.application.value.signatureGroups.length > 0
  }

  override isStepStatusVisible(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.paidAt !== null && this.hasAtLeastOneSignature()
  }

  override processingLabel(): string {
    return this.language.isMalay() ? "Akan diserah simpan kepada SSM" : "To be lodged with SSM"
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New
        ? new CompanyAmendmentRegisteredAddress()
        : this.companyAmendmentRegisteredAddress.value
    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }

    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
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
      this.hasAtLeastOneSignature(),
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
      CompanyAmendmentRegisteredAddress,
      useCompanyAmendmentRegisteredAddressStore(),
      false,
      false
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAmendmentRegisteredAddress>(
      this.companyId,
      this.companyAmendmentRegisteredAddress.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
