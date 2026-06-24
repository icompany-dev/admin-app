import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { NameReservationVariant } from "~/scripts/models/NameReservationVariant"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { MakePayment } from "~/scripts/library/MakePayment"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import type { Shareholder } from "~/scripts/models/Shareholder"
import { ObjectUtil } from "~/scripts/utils/Object"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"
import { CompanyNameReservation } from "~/scripts/models/CompanyNameReservation"

export class Section28ServiceController extends CompanyServiceController<CompanyAmendmentName> {
  companyAmendmentName = ref<CompanyAmendmentName>(new CompanyAmendmentName())
  applicationId: Ref<string> = ref<string>("")

  isProposingNewName: Ref<boolean> = ref<boolean>(false)
  showMoreTimeline: Ref<boolean> = ref<boolean>(false)

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, applicationId: string, emitEvents: any | null) {
    super(companyId, true, true, CompanyAmendmentName, useCompanyAmendmentNameStore(), emitEvents)
    this.target = CompanyConstants.TARGET_AMENDMENT_NAME_SECTION27
    this.applicationId.value = applicationId
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyAmendmentName.value = new CompanyAmendmentName(this.companyServiceInitializer.newApplication)
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true //We need to warn users
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        this.hasOngoingApplication.value = true
        await this.companyServiceInitializer.setExistingApplication()
        this.companyAmendmentName.value = new CompanyAmendmentName(this.companyServiceInitializer.existingApplication)

        if (StringUtil.isNullOrEmpty(this.companyAmendmentName.value.id)) {
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

    this.init(this.companyAmendmentName.value as CompanyAmendmentName)

    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyAmendmentName.value = new CompanyAmendmentName()
        this.companyAmendmentName.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyAmendmentName.value = new CompanyAmendmentName(apiRecord.data[0])
      this.isInPreviewMode.value = false
      this.hasOngoingApplication.value = true
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
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

      let lastApplication = new CompanyAmendmentName(apiRecord.data[0])
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async onApplicationUpdated(application: CompanyAmendmentName): Promise<void> {
    if (!application) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAmendmentName.value)
    }

    if (this.mcrRef) {
      this.mcrRef.updateApplicationContent(this.companyAmendmentName.value)
    }
  }

  async setApplicationData(applicationData: CompanyAmendmentName): Promise<void> {
    if (!applicationData) {
      return
    }

    await this.fetchOngoingApplication()
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAmendmentName.value)
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
        this.companyAmendmentName.value.id
      )
      await makePayment.setPaymentCart()

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (!StringUtil.isNullOrEmpty(this.companyAmendmentName.value.id)) {
        await this.companyAmendmentName.value.remove(useCompanyAmendmentNameStore())
      }

      if (e instanceof Error) {
        e.handle()
      } else {
        // do something
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAmendmentName.value.id)) {
      this.companyAmendmentName.value.companyId = this.companyId
      this.companyAmendmentName.value.name1 = new NameReservationVariant("-", "sdnbhd", null, null)
      await this.companyAmendmentName.value.create(useCompanyAmendmentNameStore())
    } else {
      await this.companyAmendmentName.value.update(useCompanyAmendmentNameStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAmendmentName.value.id) || !this.hasPaid()) {
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

  async onProposeNewClicked(): Promise<void> {
    if (this.isProposingNewName.value) {
      return
    }

    let newNameReservation = new CompanyNameReservation()
    newNameReservation.amendmentId = this.companyAmendmentName.value.id
    newNameReservation.status = StatusConstants.PENDING

    try {
      this.isProposingNewName.value = true
      await newNameReservation.create(useCompanyNameReservationStore())

      let makePayment = await new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        CompanyConstants.TARGET_NAME_RESERVATION,
        newNameReservation.id
      )
      await makePayment.setPaymentCart()

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        // do something
      }
    } finally {
      this.isProposingNewName.value = false
    }
  }

  onShowMoreTimelineClicked(): void {
    this.showMoreTimeline.value = !this.showMoreTimeline.value
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Ubah Nama Syarikat" : "Resolution: Change Business Name"
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Maklumat Lanjut: Pertukaran Nama Syarikat" : "Learn More: Change of Company Name"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <ul>
          <li>
            Sesebuah syarikat boleh menukar nama berdaftarnya dengan meluluskan Resolusi Khas dan memaklumkan kepada SSM 
            dalam tempoh 30 hari dari tarikh resolusi tersebut diluluskan.
          </li>
          <li>
            Nama baharu tersebut mestilah tersedia dan boleh diterima oleh SSM. Prosedur ini mengikut kaedah yang sama 
            seperti <span class='glossary' id='name-reservation'>Carian Nama & Tempahan Cadangan Nama</span> 
            di bawah permohonan baharu Sdn Bhd.
          </li>
          <li>
            Setelah Cadangan Nama Baharu diluluskan, pertukaran tersebut berkuat kuasa dari tarikh SSM mengeluarkan Notis 
            Pendaftaran Nama Baharu (boleh dimuat turun di bawah bahagian Dokumen Syarikat).
          </li>
          <li>
            Pertukaran nama Sdn Bhd tidak menjejaskan hak, kewajipan, kontrak, liabiliti, atau prosiding undang-undang syarikat. 
            Syarikat kekal sebagai entiti undang-undang yang sama di bawah nama baharu. Nombor Pendaftaran Perniagaan 
            kekal tidak berubah dan tidak boleh dipinda.
          </li>
          <li>
            Anda diingatkan bahawa selepas pertukaran tersebut, nama lama mesti dipaparkan di bawah nama berdaftar baharu 
            untuk tempoh sekurang-kurangnya 12 bulan pada semua surat-menyurat dan dokumen perniagaan yang berkaitan. Penyata 
            Kewangan bagi Tahun Kewangan semasa anda juga mestilah mencerminkan pertukaran nama ini di dalam laporan tersebut.
          </li>
        </ul>
        <b>Rujukan:</b> Seksyen 27, 28 dan 30 Akta Syarikat 2016.
      `
    }

    return `
      <ul>
        <li>
          A company may change its registered name by passing a Special Resolution and notifying SSM within 30 days 
          from the date the resolution is passed.
        </li>
        <li>
          The new name must first be available and acceptable to SSM. This follows the same method as the 
          <span class='glossary' id='name-reservation'>Name Search & Reservation</span< of Proposed Name under the 
          New Sdn Bhd application.
        </li>
        <li>
          Once the New Proposed Name is approved, the change takes effect from the date SSM issues the Notice of Registration 
          of New Name (available for download under Company Documents).
        </li>
        <li>
          Changing the Sdn Bhd name does not affect the company’s rights, obligations, contracts, liabilities, or legal proceedings. 
          The company remains the same legal entity under a new name. The Business Registration Number remains unchanged and cannot 
          be altered.
        </li>
        <li>
          You are reminded that after the change, the former name must appear beneath the new registered name for at least 12 months on 
          all relevant business correspondence and documents. Your current Financial Year End Financial Statements must reflect this 
          change of name in the report.
        </li>
      </ul>
      <b>Reference:</b> Sections 27, 28 and 30 of the Companies Act 2016.
    `
  }

  // PASCA functions
  isMajorityReached(): boolean {
    if (!this.application.value) {
      return false
    }

    // This is a special reso
    let totalShares = this.shareholders.value.reduce((total: number, shareholder: Shareholder) => {
      return total + Number(shareholder.ordinaryShares) + Number(shareholder.preferenceShares)
    }, 0)

    let totalSigned = this.shareholders.value
      .filter((shareholder: Shareholder) => {
        if (!this.application.value) {
          return
        }

        let hasSigned = this.application.value.signatureGroups.find((sg: SignatureGroup) => {
          return sg.email === shareholder.email && sg.group?.target === "shareholder"
        })

        return hasSigned
      })
      .reduce((total: number, shareholder: Shareholder) => {
        return total + Number(shareholder.ordinaryShares) + Number(shareholder.preferenceShares)
      }, 0)

    let percentage = Math.ceil((totalSigned / totalShares) * 100)

    return percentage >= 75
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
        return sg.group?.target === "shareholder"
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

  hasMoreThanOneReservation(): boolean {
    return this.companyAmendmentName.value.nameReservations.length > 1
  }

  nameReservationTimeLine(): string {
    if (!this.isNameReserved()) {
      return ""
    }

    let content = this.companyAmendmentName.value.nameReservations.map((cnr: CompanyNameReservation, index: number) => {
      if (cnr.status === StatusConstants.PENDING) {
        return ``
      }

      if (!this.showMoreTimeline.value && index < this.companyAmendmentName.value.nameReservations.length - 1) {
        return ""
      }

      let items = []
      if (StringUtil.isNullOrEmpty(cnr.proposedName)) {
        let action = this.language.isMalay() ? "Tindakan Anda Diperlukan" : "Your Action Required"
        let status = this.language.isMalay() ? "Cadang Nama Baharu" : "Propose New Names"
        items.push(`<b>${action}</b><br>${status}`)
      }

      if (cnr.status === StatusConstants.PAID) {
        let action = this.language.isMalay() ? "Sedang Diproses" : "Processing"
        items.push(`
          <b>${action}</b>  <i class='fa-regular fa-spin fa-loader'></i>
          ${this.showMoreTimeline.value ? `<br>${this.reservedName(cnr)}` : ""}
        `)
      }

      if (!StringUtil.isNullOrEmpty(cnr.submittedAt)) {
        let action = this.language.isMalay() ? "Nama Ditempah" : "Name Reserved"
        let date = this.time.formatDateOnlyShort(cnr.submittedAt)
        items.push(`<b>${action}</b><br>${this.reservedName(cnr)}<br>${date}`)
      }

      if (!StringUtil.isNullOrEmpty(cnr.approvedAt)) {
        let action = this.language.isMalay() ? "Nama Diluluskan SSM" : "Name Approved by SSM"
        let date = this.time.formatDateOnlyShort(cnr.approvedAt)
        items.push(`<b>${action}</b><br>${date}`)
      }

      if (!StringUtil.isNullOrEmpty(cnr.rejectedAt)) {
        let action = this.language.isMalay() ? "Nama Ditolak SSM" : "Name Rejected by SSM"
        let date = this.time.formatDateOnlyShort(cnr.rejectedAt)
        items.push(`<b>${action}</b><br>${date}<div class='reject-reason'>${cnr.rejectionReason}</div>`)
      }

      return items.join("<br><br>")
    })

    return content.join("")
  }

  isNameReserved(): boolean {
    if (
      this.companyAmendmentName.value.status === StatusConstants.DRAFT ||
      this.companyAmendmentName.value.status === StatusConstants.DRAFT
    ) {
      return false
    }

    return this.companyAmendmentName.value.nameReservations.length > 0
  }

  isNewProposedNameRequired(): boolean {
    return this.companyAmendmentName.value.isNewProposeNameRequired()
  }

  isReservedNameApproved(): boolean {
    return this.companyAmendmentName.value.status === StatusConstants.APPROVED && this.isNameReserved()
  }

  isLodgedToSSM(): boolean {
    return this.companyAmendmentName.value.status === StatusConstants.SUBMITTED && this.isReservedNameApproved()
  }

  reservedName(nameReservation: CompanyNameReservation): string {
    return nameReservation.proposedName
  }

  nameRejected(): string {
    return this.language.isMalay() ? "Nama ditolak" : "Name Rejected"
  }

  proposeNewLabel(): string {
    return this.language.isMalay() ? "Cadang Baharu" : "Propose New"
  }

  abandonLabel(): string {
    return this.language.isMalay() ? "Batal" : "Abandon"
  }

  showMoreTimeLineLabel(): string {
    if (!this.showMoreTimeline.value) {
      return this.language.isMalay() ? "Lihat Lagi" : "Show More"
    }
    return this.language.isMalay() ? "Tutup" : "Hide"
  }

  resolvedResolutionCopywriting(): string {
    return this.language.isMalay()
      ? "Resolusi ini berkuat kuasa dan terpakai sepenuhnya"
      : "This resolution is in full force and effect"
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyAmendmentName() : this.companyAmendmentName.value
    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }

    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyAmendmentName.value, //application
      this.companyId, //companyId
      this.target, //target
      this.slipCaseTitle(), //slipCaseTitle
      this.viewType.value, //viewType
      this.hasOngoingApplication.value, //hasOngoingApplication
      this.hasPastApplications.value, //hasPastApplications
      this.companyAmendmentName.value.id, //targetId
      this.currentPage.value, //currentPage
      this.totalPages.value, //totalPages
      "DCR", //earMarkText
      showPasca, //showServiceSteps
      this.hasPaid(), //hasPaid
      this.price.value, //price
      this.isMajorityReached(), //haveAllSigned
      this.hasSigned(), //hasUserSigned
      this.signatureDate(), //signatureDate
      this.hasDcr.value, //isDcr
      this.hasMcr.value, //isMcr
      this.totalNumberOfDirectors.value, //numberOfDirectors
      this.totalNumberOfShareholders.value, //numberOfShareholders
      false, //canSkipToConfirmation
      false, //useDefaultConfirmation
      this.backLabel(), //backButtonLabel
      this.payLabel(), //proceedButtonLabel
      this.hoveredButtonLabel(), //hoveredProceedButtonLabel
      isInPreviewMode, //isInPreviewMode
      this.isSubmitting.value, //isMakingPayment
      CompanyAmendmentName, //applicationClassType
      useCompanyAmendmentNameStore(), //repository
      false, //isByShareholder
      true //hasMajorityRule
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAmendmentName>(
      this.companyId,
      this.companyAmendmentName.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }

  get applicationValue(): CompanyAmendmentName {
    return this.companyAmendmentName.value as CompanyAmendmentName
  }
}
