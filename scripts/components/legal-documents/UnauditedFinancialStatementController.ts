import { UnauditedFinancialStatement } from "~/scripts/types/financial-statements/UnauditedFinancialStatement"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { StringUtil } from "~/scripts/utils/String"
import { Director } from "~/scripts/models/Director"
import { Shareholder } from "~/scripts/models/Shareholder"
import { CompanyFinancialStatementAuthorisedPerson } from "~/scripts/models/CompanyFinancialStatementAuthorisedPerson"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import {
  CompanyFinancialStatement,
  FinancialStatementData,
  FinancialStatementDataItem,
  FinancialStatementDataNote,
  FinancialStatementDataNoteSubsection,
} from "~/scripts/models/CompanyFinancialStatement"
import { StatusConstants } from "~/scripts/constants/Status"
import { Filter } from "~/scripts/library/Filter"
import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
// import { dummyFSData } from "~/scripts/sample-data/FinancialStatementData"
import { Ocr } from "~/scripts/library/Ocr"
import { GeminiAiJobStatusResponse } from "~/scripts/models/GeminiAiJobStatusResponse"
import { DocumentTypes } from "~/scripts/constants/DocumentTypes"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export class UnauditedFinancialStatementController extends SdnBhdLegalDocumentController {
  appointmentOfResponsiblePerson = ref<CompanyFinancialStatementAuthorisedPerson>(
    new CompanyFinancialStatementAuthorisedPerson()
  )
  application = ref<CompanyFinancialStatement>(new CompanyFinancialStatement())
  financialYearEnd: Ref<string> = ref<string>("")
  financialPeriodId: Ref<string> = ref<string>("")

  emitEvents: any | null = null

  documentContainerRef: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  totalPages: Ref<number> = ref<number>(1)

  directors: Ref<Director[]> = ref<Director[]>([])
  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])
  totalShares: Ref<number> = ref<number>(0)

  isIncludeBankers = ref<boolean>(false)
  bankersDetails: Ref<string> = ref<string>("")
  isIncludeTaxAgents = ref<boolean>(false)
  taxAgentDetails: Ref<string> = ref<string>("")
  isIncludeCorporateSecretary = ref<boolean>(false)
  corporateSecretaryDetails: Ref<string> = ref<string>("")

  businessNatureDetails: Ref<string> = ref<string>("")

  isOcrRunning = ref<boolean>(false)
  isOcrCompleted = ref<boolean>(false)
  ocr = ref<Ocr>(new Ocr())
  jobStatusResponses = ref<GeminiAiJobStatusResponse[]>([])

  isPrintingPage: Ref<boolean> = ref<boolean>(false)

  additionalCssClass = "unaudited-financial-statement print"

  dayjs = useDayjs()
  time = useLocalTime()

  constructor(props: PropsResolutionDocument<CompanyFinancialStatement>, emitEvents: any) {
    super("Unaudited Financial Statements", props.companyId, PaperOrientation.Portrait)

    this.financialPeriodId.value = props.financialPeriodId ?? ""
    this.setFinancialYearEnd(props.financialYearEnd)
    this.setApplication(props.application)
    this.emitEvents = emitEvents

    this.init()
  }

  async init(): Promise<void> {
    try {
      this.isLoading.value = true

      await Promise.allSettled([
        this.fetchDirectors(),
        this.fetchShareholders(),
        this.fetchApplication(),
        this.fetchAuthorisedPersons(),
      ])

      this.totalShares.value = this.shareholders.value.reduce((a: number, b: Shareholder) => {
        return a + b.ordinaryShares
      }, 0)

      // if (!StringUtil.isNullOrEmpty(this.application.value.id)) {
      //   if (this.application.value.statementData.statementOfFinancialPosition.length <= 0) {
      //     await this.runOcr()
      //   }
      // }

      this.businessNatureDetails.value = this.businessNature
    } catch (e) {
      //
    } finally {
      this.isLoading.value = false
      await nextTick()
      this.setTotalPages()
    }
  }

  async fetchApplication(): Promise<void> {
    if (this.isFetchingCompany.value) {
      setTimeout(() => {
        this.fetchApplication()
      }, 200)
      return
    }

    if (StringUtil.isNullOrEmpty(this.financialPeriodId.value)) {
      return
    }

    let repository = useCompanyFinancialStatementStore()
    let response = await repository.byFinancialPeriodId(this.financialPeriodId.value)
    if (!response || StringUtil.isNullOrEmpty(response.id)) {
      return
    }

    this.application.value = new CompanyFinancialStatement(response)

    if (StringUtil.isNullOrEmpty(this.application.value.registeredOfficeAddress)) {
      this.application.value.registeredOfficeAddress =
        this.company.value.registeredAddressLocation?.getMultilineAddress() ?? "ADDRESS OF REGISTERED OFFICE"
    }

    if (StringUtil.isNullOrEmpty(this.application.value.businessAddress)) {
      this.application.value.businessAddress =
        this.company.value.businessAddressLocation?.getMultilineAddress() ?? "BUSINESS ADDRESS"
    }

    if (StringUtil.isNullOrEmpty(this.application.value.businessNature)) {
      this.application.value.businessNature = this.company.value.businessDescription
    }
  }

  setApplication(application: CompanyFinancialStatement | null): void {
    if (this.isFetchingCompany.value) {
      setTimeout(() => {
        this.setApplication(application)
      }, 200)
      return
    }
    this.application.value = new CompanyFinancialStatement(application)

    if (StringUtil.isNullOrEmpty(this.application.value.registeredOfficeAddress)) {
      this.application.value.registeredOfficeAddress =
        this.company.value.registeredAddressLocation?.getMultilineAddress() ?? "ADDRESS OF REGISTERED OFFICE"
    }

    if (StringUtil.isNullOrEmpty(this.application.value.businessAddress)) {
      this.application.value.businessAddress =
        this.company.value.businessAddressLocation?.getMultilineAddress() ?? "BUSINESS ADDRESS"
    }

    if (StringUtil.isNullOrEmpty(this.application.value.businessNature)) {
      this.application.value.businessNature = this.company.value.businessDescription
    }

    // set dummy data
    // this.application.value.statementData = new FinancialStatementData(dummyFSData)

    this.fetchShareAllotments()
  }

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useDirectorStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)

    if (!response) {
      return
    }

    this.directors.value = response.map((d: Director) => {
      return new Director(d)
    })
  }

  async fetchShareholders(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useShareholderStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)

    if (!response) {
      return
    }

    this.shareholders.value = response.map((d: Shareholder) => {
      return new Shareholder(d)
    })
  }

  setFinancialYearEnd(financialYearEnd: string | null): void {
    this.financialYearEnd.value = financialYearEnd ?? this.time.currentDateFull()
  }

  async setFinancialPeriodId(financialPeriodId: string): Promise<void> {
    this.financialPeriodId.value = financialPeriodId

    if (!this.isLoading.value) {
      try {
        this.isLoading.value = true
        await Promise.allSettled([this.fetchApplication(), this.fetchAuthorisedPersons()])
      } catch (e) {
        // do something?
      } finally {
        this.isLoading.value = false
        await nextTick()
        this.setTotalPages()
      }
    }
  }

  async fetchAuthorisedPersons(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.financialPeriodId.value)) {
      return
    }

    let repository = await useCompanyFinancialStatementAuthorisedPersonStore()
    let response = await repository.byFinancialPeriod(this.financialPeriodId.value)
    this.appointmentOfResponsiblePerson.value = new CompanyFinancialStatementAuthorisedPerson(response)
  }

  setDocumentContainerRef(documentContainerRef: any): void {
    this.documentContainerRef = documentContainerRef

    nextTick(() => {
      this.setTotalPages()
    })
  }

  setTotalPages(): void {
    if (!this.documentContainerRef) {
      this.totalPages.value = 1
      return
    }

    let documentContainer = this.documentContainerRef as HTMLDivElement

    let pages = documentContainer.getElementsByClassName("paper")

    this.totalPages.value = Array.from(pages).length - 1
  }

  formatAmount(amount: number | null): string {
    if (amount === null) {
      return ""
    }

    if (typeof amount !== "number") {
      return amount
    }

    if (amount < 0) {
      let absValue = amount * -1
      return `(${absValue.toFixed(2)})`
    }

    return amount.toFixed(2)
  }

  async fetchShareAllotments(): Promise<void> {
    let repository = useCompanyShareholderAllotmentStore()
    let filter = new Filter()
    filter.companyId = this.companyId.value
    filter.startDate = this.application.value.financialYearStartDate
    filter.endDate = this.application.value.financialYearEndDate
    filter.includeDeleted = true
    filter.statuses = [StatusConstants.CONVERTED, StatusConstants.COMPLETED]

    let response = await repository.fetchAll(filter)

    let allAllotments = response.data.map((d: any) => {
      return new CompanyShareholderAllotment(d)
    })

    this.application.value.hasIssuedNewShares = allAllotments.length > 0
    this.application.value.amountOfSharesIssued = allAllotments.reduce((a, b) => {
      return a + b.sharesAllotted
    }, 0)
  }

  getNoteForFSOnPage(page: number): any[] {
    let maxRows = 6

    let flattenedNotes: any[] = []
    this.notesToTheFinancialStatements.forEach((d: any) => {
      flattenedNotes.push(d)
      if (!d.subsections) {
        return
      }

      d.subsections.forEach((s: any) => {
        flattenedNotes.push(s)
      })
    })

    let startIndex = page * maxRows
    let endIndex = startIndex + maxRows

    let selectedData = flattenedNotes.slice(startIndex, endIndex)

    return selectedData
  }

  isNoteSubsection(note: any): boolean {
    return note instanceof FinancialStatementDataNoteSubsection
  }

  getNoteClass(note: any): string {
    if (this.isNoteSubsection(note)) {
      return "subsection"
    }

    return "note"
  }

  formatDate(unformattedDate: string): string {
    let dayjs = useDayjs()
    let date = dayjs(unformattedDate).format("YYYY-MM-DD")

    return this.time.formatDateOnlyFull(date)
  }

  // AI Section
  async runOcr(): Promise<void> {
    if (this.isOcrRunning.value || StringUtil.isNullOrEmpty(this.application.value.statementId)) {
      return
    }

    if (!this.application.value.statementFile) {
      return
    }

    try {
      let fileUrl = this.application.value.statementFile.url
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const file = new File([blob], this.application.value.statementFile.name, {
        type: this.application.value.statementFile.mimeType || blob.type || "application/octet-stream",
        lastModified: Date.now(),
      })
      this.ocr.value.documentCategory = DocumentTypes.CATEGORY_UNAUDITED
      this.ocr.value.financialYearEnd = this.formattedFinancialYearEnd
      this.ocr.value.totalShares = this.totalShares.value
      this.isOcrRunning.value = true
      this.isOcrCompleted.value = false
      await this.ocr.value.processFile(file)
      await this.ocr.value.run()

      this.checkOcrStatus()
    } catch (e) {
      //
    } finally {
      // do something
    }
  }

  async checkOcrStatus(): Promise<void> {
    if (this.ocr.value.isProcessing) {
      setTimeout(() => {
        this.checkOcrStatus()
      }, 500)
      return
    }

    await this.postOcrCompleted()
    this.isOcrRunning.value = false
  }

  async postOcrCompleted(): Promise<void> {
    this.isOcrCompleted.value = true

    this.jobStatusResponses.value = this.ocr.value.geminiAi.jobStatuses.map((js: GeminiAiJobStatusResponse) => {
      return new GeminiAiJobStatusResponse(js)
    })

    if (this.jobStatusResponses.value.length <= 0) {
      return
    }

    let firstResponse = this.jobStatusResponses.value[0]
    const data = firstResponse.result
    const regex = /```([\s\S]*?)```/
    const matchedData = data.match(regex)

    if (!matchedData || !matchedData[0]) {
      return
    }

    let info = matchedData[1].trim()
    info = info.replace("json", "")

    let jsonObject = JSON.parse(info)
    this.application.value.isProfitable = jsonObject.is_profit_or_loss === "profit" ?? false
    this.application.value.exemptionType = jsonObject.type_of_exemption ?? []
    this.application.value.statementData = new FinancialStatementData(jsonObject)

    if (!StringUtil.isNullOrEmpty(this.application.value.id)) {
      await this.application.value.update(useCompanyFinancialStatementStore())
    }
  }

  getExemptionTypeDetails(exemptionType: string): string {
    if (StringUtil.isEqual(exemptionType, "dormant")) {
      return "was dormant"
    }

    if (StringUtil.isEqual(exemptionType, "zero-revenue")) {
      return "generated no revenue."
    }

    return "generated revenue less than the threshold amount."
  }

  override async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    await nextTick()
    let pdfPages = await PdfPaperUtil.getPdfElements(this.documentRef)

    return pdfPages
  }

  // Document Generator
  async getPdfElements(): Promise<HTMLElement[]> {
    if (!this.documentContainerRef) {
      return []
    }
    this.isPrintingPage.value = true

    await nextTick()
    let pages = await PdfPaperUtil.getPdfElements(this.documentContainerRef)

    this.isPrintingPage.value = false

    return pages
  }

  // Getters
  get isLoadingData(): boolean {
    return this.isLoading.value || this.isOcrRunning.value
  }

  get isDocumentEditable(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.application.value.id) &&
      this.application.value.status !== "generated" &&
      !this.isPrintingPage.value
    )
  }

  get formattedFinancialYearStart(): string {
    if (this.isPlaceholderRequired) {
      return "FINANCIAL YEAR START DATE"
    }

    return this.formatDate(this.application.value.financialYearStartDate)
  }

  get formattedFinancialYearEnd(): string {
    if (this.isPlaceholderRequired) {
      return "FINANCIAL YEAR END DATE"
    }

    return this.formatDate(this.application.value.financialYearEndDate)
  }

  get formattedCirculationDate(): string {
    if (this.isPlaceholderRequired) {
      return "CIRCULATION DATE"
    }

    return this.formatDate(this.application.value.circulationDate)
  }

  get formattedDateOfDeclaration(): string {
    if (this.isPlaceholderRequired) {
      return "DATE OF DECLARATION"
    }

    if (StringUtil.isNullOrEmpty(this.application.value.circulationDate)) {
      return ""
    }

    return this.formatDate(this.application.value.circulationDate)
  }

  get cityOfDeclaration(): string {
    if (this.isPlaceholderRequired) {
      return "CITY OF DECLARATION"
    }

    return this.application.value.cityOfDeclaration
  }

  get stateOfDeclaration(): string {
    if (this.isPlaceholderRequired) {
      return "STATE OF DECLARATION"
    }

    return this.application.value.stateOfDeclaration
  }

  get registeredAddress(): string {
    if (this.isPlaceholderRequired || StringUtil.isNullOrEmpty(this.application.value.registeredOfficeAddress)) {
      return this.company.value.registeredAddressLocation?.getMultilineAddress() ?? ""
    }

    return this.application.value.registeredOfficeAddress
  }

  get businessAddress(): string {
    if (this.isPlaceholderRequired || StringUtil.isNullOrEmpty(this.application.value.businessAddress)) {
      return this.company.value.businessAddressLocation?.getMultilineAddress() ?? ""
    }

    return this.application.value.businessAddress
  }

  get businessNature(): string {
    return this.application.value.businessNature
  }

  get bankers(): string {
    return ""
  }

  get taxAgent(): string {
    return ""
  }

  get companySecretary(): string {
    return ""
  }

  get incorporatedAt(): string {
    return this.time.formatDateOnlyFull(this.company.value.incorporatedAt ?? "")
  }

  get exemptionType(): string {
    //dormant, zero revenue, threshold etc
    if (!this.application.value.exemptionType || this.isPlaceholderRequired) {
      return "(exemption type)"
    }

    if (!Array.isArray(this.application.value.exemptionType)) {
      return this.getExemptionTypeDetails(this.application.value.exemptionType)
    }

    if (this.application.value.exemptionType.length <= 0) {
      return this.getExemptionTypeDetails("")
    }

    return StringUtil.oxfordJoin(
      "and",
      this.application.value.exemptionType.map((s: string) => {
        return this.getExemptionTypeDetails(s)
      })
    )
  }

  get resultProfitOrLoss(): string {
    return StringUtil.capitalize(this.application.value.statementData.isProfitOrLoss) //"Loss" // can make profit?? value from P&L
  }

  get reservesOrProvisions(): string {
    if (this.application.value.hasAnyReservesOrProvisions) {
      return `There were RM ${this.application.value.reservedAmount} transferred ${this.application.value.isTransferredToReserves ? "to" : "from"} reserves or provisions during the financial year.`
    }

    return `There are no transfers to or from reserves or provisions during the financial year.`
  }

  get dividendDeclaration(): string {
    if (this.application.value.hasDeclaredAnyDividends) {
      return `Dividend of RM ${this.application.value.dividendAmount} was declared and paid during the financial year.`
    }

    return `No dividend was paid or declared during the financial year.`
  }

  get shareIssuance(): string {
    if (this.application.value.hasIssuedNewShares) {
      return `Shares with consideration amount of RM ${this.application.value.amountOfSharesIssued} were issued in the financial year.`
    }

    return `No new shares or debentures were issues in the financial year.`
  }

  get directorsBenefits(): string {
    if (this.application.value.hasDirectorsBenefits) {
      return `(What to Say??)`
    }

    return `
      Neither at the end of the financial year, nor at any time during that year, did there 
      subsist any arrangement to which the Company was a party, whereby the Director might 
      acquire benefits by means of the acquisition of shares in or debentures of the Company 
      or any other body corporate.
    `
  }

  get directorsRemunerations(): string {
    if (this.application.value.hasDirectorsRemunerations) {
      return `(What to Say??)`
    }

    return `
      None of the Director or past Director of the Company have received any remunerations 
      from and the Company during the year.
    `
  }

  get resultProfitLossAmount(): string {
    if (this.application.value.statementData.isProfitOrLoss === "loss") {
      let amount = this.application.value.statementData.totalProfitOrLoss
      if (amount < 0) {
        amount = amount * -1
      }

      return `(${amount.toFixed(2)})`
    }
    return this.application.value.statementData.totalProfitOrLoss.toFixed(2)
  }

  get reasonsForProfitOrLoss(): string {
    return this.application.value.statementData.reasonForProfitOrLoss
  }

  get signatureItem(): SignatureItem {
    return new SignatureItem(null, false, false, false, this.responsiblePersonName, "", "DIRECTOR", false)
  }

  get hasResponsiblePersons(): boolean {
    return (
      this.appointmentOfResponsiblePerson.value.authorisedForReports !== null &&
      !StringUtil.isNullOrEmpty(this.appointmentOfResponsiblePerson.value.authorisedForReports)
    )
  }

  get signatureItemsForDirectorsReport(): SignatureItem[] {
    return this.responsibleForReports.map((s: string) => {
      return new SignatureItem(null, false, false, false, s, "", "DIRECTOR", false)
    })
  }

  get commissionerForOathSignatureItem(): SignatureItem {
    return new SignatureItem(null, false, false, false, "Commissioner for Oaths", "", "", false)
  }

  get responsibleForReports(): string[] {
    if (
      !this.appointmentOfResponsiblePerson.value.authorisedForReports ||
      StringUtil.isNullOrEmpty(this.appointmentOfResponsiblePerson.value.authorisedForReports)
    ) {
      return this.responsiblePersons
    }

    return this.appointmentOfResponsiblePerson.value.authorisedForReports.split(",")
  }

  get responsiblePersonName(): string {
    if (
      !this.appointmentOfResponsiblePerson.value.authorisedForStatutory ||
      StringUtil.isNullOrEmpty(this.appointmentOfResponsiblePerson.value.authorisedForStatutory)
    ) {
      if (this.responsiblePersons.length > 0) {
        return this.responsiblePersons[0]
      }

      return this.responsiblePersons[0] ?? "RESPONSIBLE DIRECTOR"
    }

    if (StringUtil.isNullOrEmpty(this.appointmentOfResponsiblePerson.value.authorisedForStatutory)) {
      return this.responsiblePersons[0] ?? ""
    }

    return this.appointmentOfResponsiblePerson.value.authorisedForStatutory
  }

  get isPlaceholderRequired(): boolean {
    return StringUtil.isNullOrEmpty(this.application.value.id)
  }

  get statementOfFinancialPosition(): FinancialStatementDataItem[] {
    return this.application.value.statementData.statementOfFinancialPosition
  }

  get statementOfProfitOrLoss(): FinancialStatementDataItem[] {
    return this.application.value.statementData.statementOfProfitOrLoss
  }

  get statementOfCashFlows(): FinancialStatementDataItem[] {
    return this.application.value.statementData.statementOfCashFlows
  }

  get statementOfChangesInEquity(): FinancialStatementDataItem[] {
    return this.application.value.statementData.statementOfChangesInEquity
  }

  get notesToTheFinancialStatements(): FinancialStatementDataNote[] {
    return this.application.value.statementData.notesToTheFinancialStatements
  }

  get numberOfPagesForNotes(): number {
    let maxRows = 6

    let flattenedNotes: any[] = []
    this.notesToTheFinancialStatements.forEach((d: any) => {
      flattenedNotes.push(d)
      if (!d.subsections) {
        return
      }

      d.subsections.forEach((s: any) => {
        flattenedNotes.push(s)
      })
    })

    return Math.ceil(flattenedNotes.length / maxRows)
  }

  get pageRangeForNotes(): number[] {
    return Array.from({ length: this.numberOfPagesForNotes }, (_, i) => {
      return i
    })
  }

  get pageNumberForExemptionCertificate(): number {
    return 12 + this.numberOfPagesForNotes
  }

  get directorsInterest(): Shareholder[] {
    return this.shareholders.value.filter((s: Shareholder) => {
      return this.directors.value.some((d: Director) => {
        return d.email === s.email
      })
    })
  }

  get responsiblePersons(): string[] {
    return this.directors.value.map((d: Director) => {
      return d.name
    })
  }

  get isShowDirectorsInterestOnPage3(): boolean {
    return this.directors.value.length <= 1
  }
}
