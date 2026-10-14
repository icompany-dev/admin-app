import { CompanyDirectorPayment } from "~/scripts/models/CompanyDirectorPayment"
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
import { TypeOfPaymentToDirectors } from "~/scripts/constants/PaymentToDirectors"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import type { Shareholder } from "~/scripts/models/Shareholder"
import { ObjectUtil } from "~/scripts/utils/Object"

export class PaymentToDirectorServiceController extends CompanyServiceController<CompanyDirectorPayment> {
  companyDirectorPayment = ref<CompanyDirectorPayment>(new CompanyDirectorPayment())
  typeOfPayment: Ref<TypeOfPaymentToDirectors> = ref<TypeOfPaymentToDirectors>(TypeOfPaymentToDirectors.Salary)

  constructor(companyId: string, viewType: string, typeOfPayment: TypeOfPaymentToDirectors, emitEvents: any | null) {
    super(companyId, true, true, CompanyDirectorPayment, useCompanyDirectorPaymentStore(), emitEvents)

    this.target = CompanyConstants.TARGET_DIRECTOR_PAYMENT
    this.typeOfPayment.value = typeOfPayment
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyDirectorPayment.value = new CompanyDirectorPayment(this.companyServiceInitializer.newApplication)
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        this.hasOngoingApplication.value = false
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
        } else {
          this.hasOngoingApplication.value = false
        }
        this.companyDirectorPayment.value = new CompanyDirectorPayment(
          this.companyServiceInitializer.existingApplication
        )
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    await this.init(this.companyDirectorPayment.value as CompanyDirectorPayment)

    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyDirectorPayment.value = new CompanyDirectorPayment()
        this.companyDirectorPayment.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyDirectorPayment.value = new CompanyDirectorPayment(apiRecord.data[0])
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

      let lastApplication = new CompanyDirectorPayment(apiRecord.data[0])
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

  setTypeOfPayment(typeOfPayment: TypeOfPaymentToDirectors): void {
    this.typeOfPayment.value = typeOfPayment
  }

  isPreview(): boolean {
    return this.isInPreviewMode.value
  }

  async onApplicationUpdated(application: CompanyDirectorPayment): Promise<void> {
    if (this.viewType.value === ViewMode.New) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyDirectorPayment.value)
    }
  }

  setApplicationData(applicationData: CompanyDirectorPayment): void {
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
        this.companyDirectorPayment.value.id
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
    if (StringUtil.isNullOrEmpty(this.companyDirectorPayment.value.id)) {
      this.companyDirectorPayment.value.companyId = this.companyId
      await this.companyDirectorPayment.value.create(useCompanyDirectorPaymentStore())
    } else {
      await this.companyDirectorPayment.value.update(useCompanyDirectorPaymentStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyDirectorPayment.value.id) || !this.hasPaid()) {
      this.makePayment()
      return
    }
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Bayaran kepada Pengarah" : "Resolution: Remuneration to Director"
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Maklumat Lanjut: Bayaran kepada Pengarah" : "Learn More: Remuneration to Director"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        lorem ipsum
      `
    }

    return `
      <p>
        For governance purposes, we recommend that the amount, purpose and outstanding
        balance be properly monitored and documented even if you are single director or
        shareholder. The money is not automatically your personal money because your Company is
        still a separate legal entity.
      </p>
      <table>
        <thead>
          <tr>
            <th>Situation / Description</th>
            <th>Classification</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Director paid monthly</td><td>Salary</td></tr>
          <tr><td>Director paid yearly</td><td>Fees</td></tr>
          <tr><td>Director paid performance</td><td>Bonus</td></tr>
          <tr><td>Director reimbursed</td><td>Reimbursement</td></tr>
          <tr><td>Director uses company assets</td><td>Benefit in Kind</td></tr>
          <tr><td>Company pays personal expenses</td><td>Perquisite</td></tr>
          <tr><td>Director takes money</td><td>Loan</td></tr>
          <tr><td>Company owes director</td><td>Amount Due to Director</td></tr>
          <tr><td>Director owes company</td><td>Amount Due from Director</td></tr>
        </tbody>
      </table>
    `
  }

  get serviceWrapperProps() {
    if (this.isProcessComplete) {
      this.companyDirectorPayment.value.status = "converted"
    }
    let showPasca = this.viewType.value === ViewMode.Existing

    let props = new PropsCompanyServiceWrapper(
      this.companyDirectorPayment.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyDirectorPayment.value.id,
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
      CompanyDirectorPayment,
      useCompanyDirectorPaymentStore()
    )

    // props.isSubmittingDocument = this.isUpdatingDocument.value

    return props
  }

  get resolutionDocumentProps() {
    let props = new PropsResolutionDocument<CompanyDirectorPayment>(
      this.companyId,
      this.companyDirectorPayment.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )

    props.type = this.typeOfPayment.value
    props.isShowTag = this.isShowTags

    return props
  }

  get isShowMcrFirst(): boolean {
    let route = useRoute()

    return route.fullPath.includes("shareholders")
  }

  // PASCA
  get shareholderSignatures(): SignatureGroup[] {
    if (!this.application.value) {
      return []
    }

    return this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "shareholder"
    })
  }

  get totalPercentageSigned(): number {
    let shareholdersSigned = this.shareholders.value.filter((s: Shareholder) => {
      return this.shareholderSignatures.some((sg: SignatureGroup) => {
        return sg.email === s.email
      })
    })

    return shareholdersSigned
      .map((s: Shareholder) => {
        return Number(s.ordinaryShares)
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)
  }

  get totalShares(): number {
    return this.shareholders.value
      .map((s: Shareholder) => {
        return Number(s.ordinaryShares)
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)
  }

  get isMajorityAchieved(): boolean {
    return this.totalPercentageSigned > 0.5 * this.totalShares
  }

  get hasPastFourteenDays(): boolean {
    if (!this.application.value || this.hasPaid()) {
      return false
    }

    return this.dayjs().diff(this.dayjs(this.application.value.paidAt), "days") > 14
  }

  get isProposalRejected(): boolean {
    return !this.isMajorityAchieved && this.hasPastFourteenDays
  }

  get isProcessing(): boolean {
    return !this.isMajorityAchieved && !this.hasPastFourteenDays
  }

  get isProcessComplete(): boolean {
    return this.isMajorityAchieved || this.hasPastFourteenDays
  }

  get decisionDate(): string {
    if (!this.application.value) {
      return ""
    }

    if (this.isProposalRejected) {
      let fourteenDaysLater = this.dayjs(this.application.value.paidAt).add(14, "days").format("YYYY-MM-DD")
      return this.time.formatDateOnlyShort(fourteenDaysLater)
    }

    let orderedSignatures = ObjectUtil.sort<SignatureGroup>(this.shareholderSignatures, "createdAt", "desc")
    let lastSignature = orderedSignatures[0]

    return this.time.formatDateOnlyShort(lastSignature.createdAt ?? "")
  }

  get status(): string {
    if (!this.isMajorityAchieved) {
      if (this.hasPastFourteenDays) {
        return this.language.isMalay() ? "Cadangan ditolak" : "Proposal Rejected"
      } else {
        return this.language.isMalay() ? "Menunggu Kelulusan dari Pemegang Saham" : "Awaiting Approval from Members"
      }
    }

    return this.language.isMalay() ? "Cadangan diterima oleh Pemegang Saham" : "Proposal approved by Members"
  }

  get statusNotes(): string {
    return this.language.isMalay() ? "Majoriti tidak dicapai" : "Majority not achieved"
  }
}
