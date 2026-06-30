import { CompanyDirectorResignation } from "~/scripts/models/CompanyDirectorResignation"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import type { Director } from "~/scripts/models/Director"
import { DeliveryConstants, PaymentConstants } from "~/scripts/constants/Payment"
import type { PaymentCartItem } from "~/scripts/models/PaymentCartItem"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class ResignationOfDirectorServiceController extends CompanyServiceController<CompanyDirectorResignation> {
  companyDirectorResignation = ref<CompanyDirectorResignation>(new CompanyDirectorResignation())

  wrapperRef: any | null = null

  applicationDirectorId: Ref<string> = ref<string>("")

  letterRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyDirectorResignation, useCompanyDirectorResignationStore(), emitEvents)
    this.target = CompanyConstants.TARGET_DIRECTOR_RESIGNATION
    this.setViewType(viewType)
    this.initializeData()
  }

  setLetterRef(dcrRef: any): void {
    this.dcrRef = dcrRef
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyDirectorResignation.value = new CompanyDirectorResignation(
          this.companyServiceInitializer.newApplication
        )
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true //We need to warn users
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        this.hasOngoingApplication.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        this.companyDirectorResignation.value = new CompanyDirectorResignation(
          this.companyServiceInitializer.existingApplication
        )

        if (StringUtil.isNullOrEmpty(this.companyDirectorResignation.value.id)) {
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

    await this.init(this.companyDirectorResignation.value as CompanyDirectorResignation)
    if (StringUtil.isNullOrEmpty(this.applicationDirectorId.value)) {
      if (this.isADirector.value) {
        this.applicationDirectorId.value =
          this.directors.value.find((d: Director) => {
            return d.email === this.currentUser.value.email
          })?.id ?? ""
      } else {
        this.applicationDirectorId.value = this.directors.value[0].id
      }
    }

    this.totalPages.value = 1
    if (this.companyDirectorResignation.value.hasAcknowledgementDcr) {
      this.totalPages.value = 2
    }

    this.handleDisplayedPage()

    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyDirectorResignation.value = new CompanyDirectorResignation()
        this.companyDirectorResignation.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyDirectorResignation.value = new CompanyDirectorResignation(apiRecord.data[0])
      this.applicationDirectorId.value = this.companyDirectorResignation.value.directorId
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

      let lastApplication = new CompanyDirectorResignation(apiRecord.data[0])
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

  async onApplicationUpdated(application: CompanyDirectorResignation): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyDirectorResignation.value)
    }
  }

  setApplicationData(applicationData: CompanyDirectorResignation): void {
    if (!applicationData) {
      return
    }

    if (this.dcrRef) {
      // this.dcrRef.updateApplicationContent(applicationData)
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
        CompanyConstants.TARGET_DIRECTOR_RESIGNATION,
        this.companyDirectorResignation.value.id
      )
      await makePayment.setPaymentCart()

      makePayment.paymentCart.items.forEach((pci: PaymentCartItem) => {
        if (pci.targetType !== CompanyConstants.TARGET_DIRECTOR_RESIGNATION) {
          return
        }

        pci.deliveryType = DeliveryConstants.DELIVERY_EMAIL
      })

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
    if (this.letterRef) {
      this.companyDirectorResignation.value = new CompanyDirectorResignation(this.letterRef.getData())
    }

    let repository = useCompanyDirectorResignationStore()
    if (StringUtil.isNullOrEmpty(this.companyDirectorResignation.value.id)) {
      this.companyDirectorResignation.value.companyId = this.companyId
      this.companyDirectorResignation.value.directorId = this.applicationDirectorId.value
      await this.companyDirectorResignation.value.create(repository)
    } else {
      await this.companyDirectorResignation.value.update(repository)
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyDirectorResignation.value.id) || !this.hasPaid()) {
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

    let label = this.language.isMalay() ? `Perletakan Jawatan Pengarah` : "Resignation of Director"
  }

  showSlipCase(): boolean {
    return StringUtil.isNullOrEmpty(this.companyDirectorResignation.value?.id ?? "")
  }

  override haveAllSigned(): boolean {
    if (!this.companyDirectorResignation.value) {
      return false
    }

    return this.companyDirectorResignation.value.signatureGroups.length > 0
  }

  canSkipPascaToConfirmation(): boolean {
    return (
      this.companyDirectorResignation.value !== null &&
      this.companyDirectorResignation.value !== undefined &&
      this.companyDirectorResignation.value.signatureGroups.length > 1
    )
  }

  usePascaDefaultConfirmation(): boolean {
    return !(
      this.companyDirectorResignation.value !== null &&
      this.companyDirectorResignation.value !== undefined &&
      !this.companyDirectorResignation.value.hasAcknowledgementDcr
    )
  }

  async onDraftDcrClick(): Promise<void> {
    let repository = useCompanyDirectorResignationStore()
    this.companyDirectorResignation.value.hasAcknowledgementDcr = true
    await this.companyDirectorResignation.value.update(repository)
  }

  helpTitle(): string {
    return this.language.isMalay() ? `Perletakan Jawatan Pengarah` : "Resignation of Director"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Seorang Pengarah boleh meletakkan jawatan daripada Lembaga Pengarah dengan memberikan notis bertulis 
        kepada Syarikat. Peletakan jawatan tersebut berkuat kuasa sebaik sahaja dimaklumkan dan diserah simpan 
        di SSM.
        <br><br>
        Jika Pengarah mempunyai liabiliti atau tanggungjawab dan kewajipan tertunggak, Syarikat mungkin perlu 
        menyelesaikannya sebelum peletakan jawatan boleh diterima.
        <br><br>
        Peletakan jawatan tidak melepaskan tanggungjawab dan kewajipan terdahulu anda.
      `
    }

    return `
      A Director may step down from the Board by giving written notice to the Company. The resignation takes 
      effect once notified and lodged with SSM.
      <br><br>
      If the Director has outstanding liabilities or obligations, the Company may need to resolve these before 
      the resignation can be accepted.
      <br><br>
      Resignation does not absolve your prior obligations.
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Notis: Perletakan Jawatan sebagai Pengarah" : "Notice: Resignation as a Director"
  }

  slipCaseContentPoints(): string[] {
    if (this.language.isMalay()) {
      return [
        "Seorang Pengarah <b>meletakkan jawatan dengan memberikan notis bertulis</b> ke Alamat Berdaftar Syarikat seperti yang ditetapkan di bawah Seksyen 208(2) Akta Syarikat 2016.",
        "Peletakan jawatan <b>berkuat kuasa sebaik sahaja diserahkan</b>, melainkan jika tarikh kuat kuasa yang lebih lewat dinyatakan.",
        "Peletakan jawatan anda <b>tidak boleh ditolak</b>. Walau bagaimanapun, jika anda berhutang dengan Syarikat, Lembaga Pengarah masih boleh meneruskan tindakan penguatkuasaan dan tuntutan semula.",
      ]
    }

    return [
      "A director <b>resigns by giving a written notice</b> to the Company’s Registered Address as prescribed under Section 208(2) of the Companies Act 2016",
      "The resignation becomes <b>effective upon delivery</b>, unless a later effective date is specified.",
      "Your resignation <b>cannot be refused</b>. But if you owe the Company, the Board may still pursue enforcement and recovery.",
    ]
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  override payLabel(): string {
    return this.language.isMalay() ? "dari RM19" : "from RM19"
  }

  statusPascaLabel(): string {
    if (
      !this.companyDirectorResignation.value ||
      StringUtil.isNullOrEmpty(this.companyDirectorResignation.value.submittedAt)
    ) {
      return this.language.isMalay() ? "Dihantar" : "Delivered"
    }

    return this.language.isMalay() ? "Selesai" : "Completed"
  }

  statusDate(): string {
    if (!this.companyDirectorResignation.value) {
      return "-"
    }

    if (StringUtil.isNullOrEmpty(this.companyDirectorResignation.value.submittedAt)) {
      let signature = this.companyDirectorResignation.value.signatureGroups.find((sg: SignatureGroup) => {
        if (!sg.group) {
          return false
        }

        return sg.group.id === this.applicationDirectorId.value
      })

      if (!signature) {
        return "-"
      }

      return this.time.formatDateOnlyFull(signature.createdAt ?? "")
    }

    return this.time.formatDateOnlyFull(this.companyDirectorResignation.value.submittedAt ?? "")
  }

  draftDcrLabel(): string {
    return this.language.isMalay()
      ? "Drafkan DCR untuk Mengambil Maklum<br>Peletakan Jawatan"
      : "Draft a DCR to Acknowledge<br>the Resignation"
  }

  noThanksLabel(): string {
    return this.language.isMalay() ? "Tidak Mengapa" : "No, Thanks"
  }

  proceedLabel(): string {
    return this.language.isMalay() ? "Teruskan" : "Proceed"
  }

  override handleDisplayedPage(): void {
    let page = this.currentPage.value
    let allDocuments = document.querySelectorAll(".paper-wrapper")
    if (allDocuments.length > 0) {
      let pageNoToHide = page === 1 ? 1 : 0
      let pageToHide = allDocuments[pageNoToHide] as HTMLElement
      pageToHide.style.display = "none"

      let pageNoToShow = page - 1
      let pageToShow = allDocuments[pageNoToShow] as HTMLElement
      pageToShow.style.display = "block"
    }
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyDirectorResignation() : this.companyDirectorResignation.value
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
      CompanyDirectorResignation,
      useCompanyDirectorResignationStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyDirectorResignation>(
      this.companyId,
      this.companyDirectorResignation.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
