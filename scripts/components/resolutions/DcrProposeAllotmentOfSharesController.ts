import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { ResolutionController } from "./ResolutionController"
import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { ShareType, ShareholdingType } from "~/scripts/constants/Shareholder"
import { NumberUtil } from "~/scripts/utils/Number"
import { SelectOption } from "~/scripts/types/SelectOption"
import {
  ConsiderationType,
  PurposeOfAllotment,
  AllotmentInCaseOfUnsubscribe,
} from "~/scripts/constants/AllotmentOfShares"
import { CompanyShareAllotToExternal } from "~/scripts/models/CompanyShareAllotToExternal"

export class DcrProposedAllotmentOfSharesController extends ResolutionController<CompanyShareholderAllotment> {
  companyShareholderAllotment = ref<CompanyShareholderAllotment>(new CompanyShareholderAllotment())
  companyShareholderAllotmentRepository = useCompanyShareholderAllotmentStore()
  companyRepository = useCompanyStore()

  numberOfShareholders: Ref<number> = ref<number>(1)

  constructor(props: IPropsResolutionDocument<CompanyShareholderAllotment>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyShareholderAllotment,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.isUsingTemplate.value = false
    this.signatureStartOnPage.value = 2
    this.maxSignatureOnFirstPage.value = 2
    this.maxSignatureOnOtherPages.value = 6
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyShareholderAllotmentRepository.fetch(id)
    if (!this.companyShareholderAllotmentRepository.error && response !== null) {
      this.application.value = new CompanyShareholderAllotment(response)
      this.companyShareholderAllotment.value = new CompanyShareholderAllotment(response)
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    this.application.value = new CompanyShareholderAllotment()
    this.application.value.companyId = this.companyId.value

    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
    }
    this.initializeData()
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  async otherDataInitiation(): Promise<void> {
    let response = await this.shareholderRepository.fetchAllForCompany(this.companyId.value)
    this.numberOfShareholders.value = response.length
  }

  setContent(): void {
    //do nothing
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 2
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  getAllotteesOnPage(page: number): CompanyShareAllotToExternal[] {
    if (this.isInPreviewMode.value) {
      let naturalPersonAllotTo = new CompanyShareAllotToExternal()
      let artificialPersonAllotTo = new CompanyShareAllotToExternal()
      artificialPersonAllotTo.shareholdingType = ShareholdingType.Representative

      return [naturalPersonAllotTo, artificialPersonAllotTo]
    } else if (this.companyShareholderAllotment.value.details.newAllottees.length <= 0) {
      this.companyShareholderAllotment.value.details.newAllottees.push(new CompanyShareAllotToExternal())
    }

    if (page === 1) {
      return this.companyShareholderAllotment.value.details.newAllottees.slice(0, this.maxAllotteeOnPageOne)
    }

    let start = (page - 2) * this.maxAllotteeOnOtherPages + this.maxAllotteeOnPageOne
    return this.companyShareholderAllotment.value.details.newAllottees.slice(start, this.maxAllotteeOnOtherPages)
  }

  isArtificialPerson(allotTo: CompanyShareAllotToExternal): boolean {
    return allotTo.shareholdingType === ShareholdingType.Representative
  }

  getAllotteeType(allotTo: CompanyShareAllotToExternal): string {
    let matchedOption = this.allotteeTypes.find((at: SelectOption) => {
      return at.value === allotTo.shareholdingType
    })

    return matchedOption ? matchedOption.label : this.allotteeTypes[0].label
  }

  getAllotteeName(allotTo: CompanyShareAllotToExternal): string {
    if (this.isInPreviewMode.value) {
      return `NAME OF ${this.isArtificialPerson(allotTo) ? "ENTITY" : "PERSON"}`
    }

    return allotTo.name
  }

  getAllotteeIdentification(allotTo: CompanyShareAllotToExternal): string {
    if (this.isInPreviewMode.value) {
      return this.isArtificialPerson(allotTo) ? "COMPANY REGISTRATION NUMBER" : "IDENTIFICATION NUMBER"
    }

    return allotTo.identificationNumber
  }

  getAllotteeIdentificationAlt(allotTo: CompanyShareAllotToExternal): string {
    if (this.isInPreviewMode.value) {
      return "COMPANY OTHER REGISTRATION NUMBER"
    }

    return allotTo.identificationNumberAlt ?? ""
  }

  getAllotteeNumberOfShares(allotTo: CompanyShareAllotToExternal): string {
    if (this.isInPreviewMode.value) {
      return "NUMBER OF SHARES"
    }

    return `${allotTo.numberOfShares}`
  }

  onAddAllotteeClicked(): void {
    this.companyShareholderAllotment.value.details.newAllottees.push(new CompanyShareAllotToExternal())

    this.updateSignatureOnPage()
    this.setContent()
  }

  getActualIndex(page: number, index: number): number {
    if (page === 1) {
      return index
    }

    let start = (page - 2) * this.maxAllotteeOnOtherPages + this.maxAllotteeOnPageOne

    return start + index
  }

  onRemoveAllotteeClicked(index: number): void {
    this.companyShareholderAllotment.value.details.newAllottees.splice(index, 1)

    this.updateSignatureOnPage()
    this.setContent()
  }

  onDuePayableClicked(id: string): void {
    this.companyShareholderAllotment.value.details.isPayableUponCall = id === "call"
  }

  isShowFurtherResolvedOnPage(page: number): boolean {
    let allotteesOnPage = this.getAllotteesOnPage(page)

    return allotteesOnPage.length <= 2
  }

  isShowPaymentStatusOnPage(page: number): boolean {
    let allotteesOnPage = this.getAllotteesOnPage(page)

    if (allotteesOnPage.length > 3) {
      return false
    }

    let previousPage = page - 1
    if (previousPage <= 1) {
      return true
    }

    let allotteesOnPreviousPage = this.getAllotteesOnPage(previousPage)

    return allotteesOnPreviousPage.length > 3
  }

  isShowBasisIssuePriceOnPage(page: number): boolean {
    let allotteesOnPage = this.getAllotteesOnPage(page)

    if (allotteesOnPage.length > 5) {
      return false
    }

    let previousPage = page - 1
    if (previousPage <= 1) {
      return true
    }

    let allotteesOnPreviousPage = this.getAllotteesOnPage(previousPage)

    return allotteesOnPreviousPage.length > 5
  }

  updateSignatureOnPage(): void {
    let lastPageForAllottee = this.additionalPageRanges[this.additionalPageRanges.length - 1] ?? 0
    if (lastPageForAllottee === 0) {
      this.signatureStartOnPage.value = 2
      this.maxSignatureOnFirstPage.value = 2
      return
    }

    let allotteesOnPage = this.getAllotteesOnPage(lastPageForAllottee)
    let numberOfAllottees = allotteesOnPage.length

    if (numberOfAllottees < 1) {
      this.signatureStartOnPage.value = lastPageForAllottee
      this.maxSignatureOnFirstPage.value = 6
      return
    }

    this.signatureStartOnPage.value = lastPageForAllottee + 1
    this.maxSignatureOnFirstPage.value = 6
  }

  canAddMoreOnPage(page: number): boolean {
    if (this.companyShareholderAllotment.value.details.newAllottees.length >= 7) {
      return false
    }

    if (page === 1) {
      return this.companyShareholderAllotment.value.details.newAllottees.length <= this.maxAllotteeOnPageOne
    }

    let allotteesOnPage = this.getAllotteesOnPage(page)

    return allotteesOnPage.length > 0 && allotteesOnPage.length <= this.maxAllotteeOnOtherPages
  }

  override getApplication(): CompanyShareholderAllotment {
    return new CompanyShareholderAllotment(this.companyShareholderAllotment.value)
  }

  onSelectedActionUnsubscribed(value: string): void {
    if (!this.application.value) {
      return
    }

    this.application.value.details.actionInCaseUnsubscribed = value
  }

  //getters
  get classOfShares(): string {
    return this.companyShareholderAllotment.value.details.typeOfShares === ShareType.Ordinary
      ? "Ordinary"
      : "Preference"
  }

  get pricePerShare(): string {
    if (this.isInPreviewMode.value) {
      return "Price per Share"
    }

    return NumberUtil.currency(this.companyShareholderAllotment.value.details.considerationPerShare ?? 1)
  }

  get totalSubscriptionAmount(): string {
    if (this.isInPreviewMode.value) {
      return "Total Subscription Amount"
    }

    return NumberUtil.currency(this.companyShareholderAllotment.value.details.proposedTotalSubscriptionAmount ?? 1)
  }

  get purposeOfAllotmentOptions(): SelectOption[] {
    return [
      new SelectOption(PurposeOfAllotment.WorkingCapital, PurposeOfAllotment.WorkingCapital, "working capital"),
      new SelectOption(
        PurposeOfAllotment.OperationalFunding,
        PurposeOfAllotment.OperationalFunding,
        "operational funding"
      ),
      new SelectOption(
        PurposeOfAllotment.BusinessExpansion,
        PurposeOfAllotment.BusinessExpansion,
        "business expansion"
      ),
      new SelectOption(
        PurposeOfAllotment.InvestmentPurposes,
        PurposeOfAllotment.InvestmentPurposes,
        "investment purposes"
      ),
      new SelectOption(PurposeOfAllotment.Restructuring, PurposeOfAllotment.Restructuring, "restructuring"),
      new SelectOption(
        PurposeOfAllotment.SettlementOfObligations,
        PurposeOfAllotment.SettlementOfObligations,
        "settlement of obligations"
      ),
    ]
  }

  get purposeOfAllotment(): string {
    if (this.isInPreviewMode.value) {
      return this.purposeOfAllotmentOptions[0].label
    }

    let matchedOption = this.purposeOfAllotmentOptions.find((so: SelectOption) => {
      return so.value === this.companyShareholderAllotment.value.details.purposeOfAllotment
    })

    return matchedOption ? matchedOption.label : this.purposeOfAllotmentOptions[0].label
  }

  get withConstitutionLine(): string {
    if (!this.application.value || !this.application.value.company || !this.application.value.company.hasConstitution) {
      return `.`
    }

    return ` and the Constitution of the Company.`
  }

  get typesOfNewAllottees(): string {
    if (this.companyShareholderAllotment.value.details.newAllottees.length <= 0) {
      return "persons"
    }

    let areAllNaturalPersons = this.companyShareholderAllotment.value.details.newAllottees.every(
      (d: CompanyShareAllotToExternal) => {
        return d.shareholdingType === ShareholdingType.Individual
      }
    )

    let areAllArtificialPersons = this.companyShareholderAllotment.value.details.newAllottees.every(
      (d: CompanyShareAllotToExternal) => {
        return d.shareholdingType === ShareholdingType.Representative
      }
    )

    if (this.companyShareholderAllotment.value.details.newAllottees.length === 1) {
      return areAllNaturalPersons ? "person" : "entity"
    }

    return areAllNaturalPersons ? "persons" : areAllArtificialPersons ? "entities" : "persons and entities"
  }

  get allotteeTypes(): SelectOption[] {
    return [
      new SelectOption(ShareholdingType.Individual, ShareholdingType.Individual, "Natural Person / Individual"),
      new SelectOption(
        ShareholdingType.Representative,
        ShareholdingType.Representative,
        "Artificial Person / Legal Entity"
      ),
    ]
  }

  get canAddMoreAllottee(): boolean {
    return this.numberOfShareholders.value + this.companyShareholderAllotment.value.details.newAllottees.length < 50
  }

  get canRemoveAllottee(): boolean {
    return this.companyShareholderAllotment.value.details.newAllottees.length > 1
  }

  get isShowAllotteeOfPageTwo(): boolean {
    return (
      this.companyShareholderAllotment.value.details.newAllottees.length > this.maxAllotteeOnPageOne &&
      this.isShowExternalAllotToOptions
    )
  }

  get isOnlyOneAllottee(): boolean {
    return this.companyShareholderAllotment.value.details.newAllottees.length === 1
  }

  get issuePriceBasisStart(): string {
    if (this.isShowAllotteeOfPageTwo) {
      return "1"
    }

    if (this.isOnlyOneAllottee) {
      return "5"
    }

    return "4"
  }

  get considerationType(): string {
    if (this.isInPreviewMode.value) {
      return "Fully Paid"
    }

    if (this.companyShareholderAllotment.value.details.considerationType === ConsiderationType.FullyPaid) {
      return "Fully Paid"
    }

    if (this.companyShareholderAllotment.value.details.considerationType === ConsiderationType.PartiallyPaid) {
      return "Partly Paid"
    }

    if (this.companyShareholderAllotment.value.details.considerationType === ConsiderationType.Unpaid) {
      return "Unpaid"
    }

    return ""
  }

  get amountPaid(): string {
    if (this.isInPreviewMode.value) {
      return "Total Amount Paid"
    }

    if (this.companyShareholderAllotment.value.details.considerationType === ConsiderationType.FullyPaid) {
      return NumberUtil.currency(this.companyShareholderAllotment.value.details.proposedTotalSubscriptionAmount)
    }

    return NumberUtil.currency(this.companyShareholderAllotment.value.details.amountPaid)
  }

  get outstandingAmount(): string {
    if (this.isInPreviewMode.value) {
      return "Total Amount to be Paid"
    }

    if (this.companyShareholderAllotment.value.details.considerationType === ConsiderationType.FullyPaid) {
      return "0.00"
    }

    let outstanding =
      Number(this.companyShareholderAllotment.value.details.proposedTotalSubscriptionAmount) -
      Number(this.companyShareholderAllotment.value.details.amountPaid)

    return NumberUtil.currency(outstanding)
  }

  get hasDueAndPayable(): boolean {
    return (
      this.companyShareholderAllotment.value.details.considerationType !== ConsiderationType.FullyPaid &&
      this.companyShareholderAllotment.value.details.amountPaid !==
        this.companyShareholderAllotment.value.details.proposedTotalSubscriptionAmount
    )
  }

  get dueAndPayable(): string {
    if (this.isInPreviewMode.value) {
      return "Payment Due Date"
    }

    let time = useLocalTime()
    return this.companyShareholderAllotment.value.details.isPayableUponCall
      ? "Upon Call by Directors"
      : time.formatDateOnlyFull(this.companyShareholderAllotment.value.details.paymentDueDate ?? "")
  }

  get dueAndPayableOption(): SelectOption[] {
    return [
      new SelectOption(
        "date",
        "date",
        "To pay before",
        false,
        !this.companyShareholderAllotment.value.details.isPayableUponCall
      ),
      new SelectOption(
        "call",
        "call",
        "Upon Call by Directors",
        false,
        this.companyShareholderAllotment.value.details.isPayableUponCall
      ),
    ]
  }

  get showAddMoreOnPageOne(): boolean {
    if (!this.isDocumentEditable()) {
      return false
    }

    return this.canAddMoreAllottee && !this.isShowAllotteeOfPageTwo
  }

  get maxAllotteeOnPageOne(): number {
    return this.isDocumentEditable() ? 2 : 3
  }

  get maxAllotteeOnOtherPages(): number {
    return this.isDocumentEditable() ? 7 : 8
  }

  get additionalNumberOfPagesForAllottees(): number {
    let balance = this.companyShareholderAllotment.value.details.newAllottees.length - this.maxAllotteeOnPageOne
    if (balance <= 0) {
      return 1 // always have extra one
    }

    let groupedItems = Math.ceil(balance / this.maxAllotteeOnOtherPages)

    return groupedItems
  }

  get additionalPageRanges(): number[] {
    let lastPageForAllottee = this.additionalNumberOfPagesForAllottees + 1
    let totalPagesToAdd = this.additionalNumberOfPagesForAllottees
    if (!this.isShowFurtherResolvedOnPage(lastPageForAllottee)) {
      totalPagesToAdd = totalPagesToAdd + 1
    }

    return Array.from({ length: totalPagesToAdd }, (_, i) => i + 2)
  }

  get optionsForUnsubscribed(): SelectOption[] {
    let pendingBoardActionLabel = `
      + Add: unless and until the Board of Directors resolves to allot such shares in 
      accordance with the Companies Act 2016${this.hasConstitution ? " and the Constitution of the Company" : ""}. (+RM69)`

    return [
      new SelectOption(
        AllotmentInCaseOfUnsubscribe.None,
        AllotmentInCaseOfUnsubscribe.None,
        "",
        false,
        this.application.value?.details.actionInCaseUnsubscribed === AllotmentInCaseOfUnsubscribe.None
      ),
      new SelectOption(
        AllotmentInCaseOfUnsubscribe.PendingBoardAction,
        AllotmentInCaseOfUnsubscribe.PendingBoardAction,
        pendingBoardActionLabel,
        false,
        this.application.value?.details.actionInCaseUnsubscribed === AllotmentInCaseOfUnsubscribe.PendingBoardAction
      ),
      new SelectOption(
        AllotmentInCaseOfUnsubscribe.AmendResolution,
        AllotmentInCaseOfUnsubscribe.AmendResolution,
        "+ Amend to include Allotment of Unissued Shares to a third party (+RM159)",
        false,
        this.application.value?.details.actionInCaseUnsubscribed === AllotmentInCaseOfUnsubscribe.AmendResolution
      ),
    ]
  }

  get selectedOptionForUnsubscribed(): string {
    if (
      !this.application.value ||
      this.application.value?.details.actionInCaseUnsubscribed === AllotmentInCaseOfUnsubscribe.None
    ) {
      return ""
    }

    let pendingBoardActionLabel = `
      unless and until the Board of Directors resolves to allot such shares in 
      accordance with the Companies Act 2016${this.hasConstitution ? " and the Constitution of the Company" : ""}`

    return this.application.value?.details.actionInCaseUnsubscribed === AllotmentInCaseOfUnsubscribe.PendingBoardAction
      ? pendingBoardActionLabel
      : "Amend to include Allotment of Unissued Shares to a third party"
  }

  get isShowExternalAllotToOptions(): boolean {
    return (
      this.application.value !== null &&
      this.application.value.details.actionInCaseUnsubscribed === AllotmentInCaseOfUnsubscribe.AmendResolution
    )
  }

  get selectedDueAndPayable(): string {
    return this.companyShareholderAllotment.value.details.isPayableUponCall ? "Upon Call by Directors" : "To Pay Before"
  }

  get isShowDueAndPayableTag(): boolean {
    if (!this.isDocumentEditable()) {
      return false
    }

    if (this.companyShareholderAllotment.value.details.isPayableUponCall) {
      return false
    }

    return (
      !this.companyShareholderAllotment.value.details.isPayableUponCall &&
      this.companyShareholderAllotment.value.details.paymentDueDate === null
    )
  }
}
