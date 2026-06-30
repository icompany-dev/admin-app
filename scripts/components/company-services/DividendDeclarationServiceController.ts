import { CompanyDividendDeclaration } from "~/scripts/models/CompanyDividendDeclaration"
import { CompanyServiceController } from "./CompanyServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { Company } from "~/scripts/models/Company"
import { DeliveryConstants, PaymentConstants } from "~/scripts/constants/Payment"
import type { PaymentCartItem } from "~/scripts/models/PaymentCartItem"
import { Error } from "~/scripts/library/Error"
import { useCompanyDividendDeclarationStore } from "~/stores/CompanyDividendDeclarations"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { ObjectUtil } from "~/scripts/utils/Object"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DividendDeclarationServiceController extends CompanyServiceController<CompanyDividendDeclaration> {
  companyDividendDeclaration = ref<CompanyDividendDeclaration>(new CompanyDividendDeclaration())

  wrapperRef: any | null = null
  section132Ref: any | null = null

  constructor(companyId: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyDividendDeclaration, useCompanyDividendDeclarationStore(), emitEvents)
    this.target = CompanyConstants.TARGET_DIVIDEND_DECLARATION
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])

    if (this.companyServiceInitializer.existingApplication) {
      this.hasOngoingApplication.value = true
      this.viewType.value = ViewMode.Existing
      this.companyDividendDeclaration.value = new CompanyDividendDeclaration(
        this.companyServiceInitializer.existingApplication
      )
      this.isInPreviewMode.value = false
    } else {
      this.hasOngoingApplication.value = false
      this.companyDividendDeclaration.value = new CompanyDividendDeclaration(
        this.companyServiceInitializer.newApplication
      )
      this.isInPreviewMode.value = true
    }

    this.init(this.companyDividendDeclaration.value as CompanyDividendDeclaration)
    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    this.companyDividendDeclaration.value = new CompanyDividendDeclaration()
    this.companyDividendDeclaration.value.companyId = this.companyId

    let companyRepository = useCompanyStore()
    let response = await companyRepository.fetch(this.companyId)
    if (!companyRepository.error) {
      this.companyDividendDeclaration.value.company = new Company(response)
    }
  }

  async fetchPreviousSubmission(): Promise<void> {
    this.hasSubmittedBefore.value = false
    this.lastApplicationDate.value = ""
  }

  onWrapperMinimized(applicationData: any): void {
    if (!applicationData) {
      return
    }

    this.companyDividendDeclaration.value = new CompanyDividendDeclaration(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyDividendDeclaration.value)
    }
  }

  async onApplicationUpdated(application: CompanyDividendDeclaration): Promise<void> {
    if (!application) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyDividendDeclaration.value)
    }
  }

  setApplicationData(applicationData: CompanyDividendDeclaration): void {
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
        this.companyDividendDeclaration.value.id
      )
      await makePayment.setPaymentCart()

      makePayment.paymentCart.items.forEach((pci: PaymentCartItem) => {
        if (pci.targetType !== this.target) {
          return
        }
        pci.deliveryType = DeliveryConstants.DELIVERY_EMAIL
      })

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
    if (StringUtil.isNullOrEmpty(this.companyDividendDeclaration.value.id)) {
      this.companyDividendDeclaration.value = new CompanyDividendDeclaration()
      this.companyDividendDeclaration.value.companyId = this.companyId
      await this.companyDividendDeclaration.value.create(useCompanyDividendDeclarationStore())
    } else {
      await this.companyDividendDeclaration.value.update(useCompanyDividendDeclarationStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyDividendDeclaration.value.id) || !this.hasPaid()) {
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

  setSection132Ref(section132Ref: any | null): void {
    this.section132Ref = section132Ref
    if (section132Ref) {
      this.setTotalPages()
    }
  }

  showSlipCase(): boolean {
    return StringUtil.isNullOrEmpty(this.companyDividendDeclaration.value?.id ?? "")
  }

  helpTitle(): string {
    return this.language.isMalay() ? `Pengisytiharan Dividen` : "Dividend Declaration"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Pengisytiharan dividen adalah proses rasmi di mana Lembaga Pengarah mengisytiharkan pembayaran dividen
        kepada pemegang saham. Pengarah mesti memastikan syarikat adalah solven sebelum mengisytiharkan dividen.
        <br><br>
        Dividen boleh diisytiharkan sebagai dividen interim atau dividen akhir bergantung kepada polisi syarikat.
      `
    }

    return `
      A dividend declaration is a formal process where the Board of Directors declares a dividend payment
      to shareholders. Directors must ensure the company is solvent before declaring dividends.
      <br><br>
      Dividends can be declared as interim or final dividends depending on company policy.
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Mengisytihar Dividen" : "Resolution: Declaring Dividend"
  }

  override async setTotalPages(): Promise<void> {
    await nextTick()

    // DCR pages from the ref if available, otherwise default to 2
    let dcrPages = 2
    if (this.dcrRef && typeof this.dcrRef.totalPages === "function") {
      dcrPages = this.dcrRef.totalPages()
    }

    // Section132 pages from the ref if available, otherwise use director count
    let section132Pages = this.totalNumberOfDirectors.value
    if (this.section132Ref && typeof this.section132Ref.totalPages === "function") {
      section132Pages = this.section132Ref.totalPages()
    }

    this.totalPages.value = dcrPages + section132Pages
  }

  // PASCA functions
  isMajorityReached(): boolean {
    if (!this.application.value) {
      return false
    }

    let totalSigned = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "director"
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
        return sg.group?.target === "director"
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
      this.viewType.value === ViewMode.New ? new CompanyDividendDeclaration() : this.companyDividendDeclaration.value
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
      CompanyDividendDeclaration,
      useCompanyDividendDeclarationStore(),
      false,
      true
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyDividendDeclaration>(
      this.companyId,
      this.companyDividendDeclaration.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
