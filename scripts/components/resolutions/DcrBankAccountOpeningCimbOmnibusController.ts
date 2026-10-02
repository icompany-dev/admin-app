import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { ResolutionController } from "./ResolutionController"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { BankBranch } from "~/scripts/models/BankBranch"
import { Bank } from "~/scripts/models/Bank"
import { ObjectUtil } from "~/scripts/utils/Object"
import { Director } from "~/scripts/models/Director"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import type { User } from "~/scripts/models/User"
import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { BankConstants } from "~/scripts/constants/Banks"
import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import type { State } from "~/scripts/models/Location"
import { CimbBankApplicationDetails, CimbApplicant } from "~/scripts/types/banks/CimbBankApplicationDetails"

export class DcrBankAccountOpeningCimbOmnibusController extends ResolutionController<CompanyBankAccountOpening> {
  isDocumentLoaded: Ref<boolean> = ref<boolean>(false)

  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()

  private bankId: string = BankConstants.CIMB_DETAIL.id
  bank = ref<Bank>(new Bank())
  bankBranches = ref<BankBranch[]>([])

  directors = ref<Director[]>([])
  directorUsers = ref<User[]>([])
  signatories = ref<CompanyBankSignatory[]>([])

  cimbBankApplicationDetails = ref<CimbBankApplicationDetails>(new CimbBankApplicationDetails())

  selectedBranchId: Ref<string> = ref<string>("")
  onlineAccessPersons: Ref<OnlineBanking[]> = ref<OnlineBanking[]>([])

  signatoryPlaceholders = ref<CompanyBankSignatory[]>([
    new CompanyBankSignatory(),
    new CompanyBankSignatory(),
    new CompanyBankSignatory(),
    new CompanyBankSignatory(),
  ])
  signaturePlaceholders = ref<string[]>([])

  isShowBranchOptions: Ref<boolean> = ref<boolean>(false)
  searchBranch: Ref<string> = ref<string>("")

  additionalCssClass: string = "cimb-omnibus-form-paper"
  boardResolutionDateParts = ref({ day: "", month: "", year: "" })
  extractPassedDateParts = ref({ day: "", month: "", year: "" })
  extractCertificationDateParts = ref({ day: "", month: "", year: "" })

  nonDirectorBankSignatoryRef: any | null = null

  constructor(props: IPropsResolutionDocument<CompanyBankAccountOpening>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyBankAccountOpening,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.resetSignatoryPlaceholder()

    this.signaturePlaceholders.value = ["", SecretaryInformation.SECRETARY_NAME, "", "", "", ""]
  }

  setNonDirectorBankSignatoryRef(nonDirectorBankSignatoryRef: any): void {
    this.nonDirectorBankSignatoryRef = nonDirectorBankSignatoryRef
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)

      let companyRepository = useCompanyStore()
      let companyResponse = await companyRepository.fetch(this.application.value.companyId)
      this.application.value.company = new Company(companyResponse)

      if (this.application.value.paidAt !== this.application.value.updatedAt) {
        this.selectedBranchId.value = this.application.value.bankBranchId
      }

      this.loadOtherDetails()

      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    this.application.value = new CompanyBankAccountOpening()
    this.application.value.companyId = this.companyId.value

    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
    }

    this.application.value.bankId = this.bankId
    this.cimbBankApplicationDetails.value = new CimbBankApplicationDetails()
    this.resetSignatoryPlaceholder()
    // Set bank on application if already fetched
    if (this.bank.value?.id) {
      this.application.value.bank = this.bank.value
    }
    this.initializeData()
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  setContent(): void {
    this.signaturePlaceholders.value = this.directors.value.map((director: Director) => director.name)
    this.signaturePlaceholders.value.splice(1, 0, SecretaryInformation.SECRETARY_NAME_LIST[1].name)
    this.loadOtherDetails()

    this.isDocumentLoaded.value = true
  }

  loadOtherDetails(): void {
    const saved = this.application.value?.cimbBankApplicationDetails
    if (saved) {
      this.cimbBankApplicationDetails.value = new CimbBankApplicationDetails(saved)
    }
    this.setSignatoryPlaceholder()
    this.loadDateParts("boardResolutionDate")
    this.loadDateParts("extractPassedDate")
    this.loadDateParts("extractCertificationDate")
  }

  resetSignatoryPlaceholder(): void {
    this.cimbBankApplicationDetails.value.generalOperationAuthorisedPersons = []
    this.setSignatoryPlaceholder()
  }

  setSignatoryPlaceholder(): void {
    const persons = this.cimbBankApplicationDetails.value.generalOperationAuthorisedPersons
    while (persons.length < 6) persons.push(new CompanyBankSignatory())
    this.signatoryPlaceholders.value = persons
  }

  authorisedPersonAt(index: number): CompanyBankSignatory {
    const persons = this.cimbBankApplicationDetails.value.generalOperationAuthorisedPersons
    while (persons.length <= index) persons.push(new CompanyBankSignatory())
    return persons[index]
  }

  certifierAt(index: number): CimbApplicant {
    const certifiers = this.cimbBankApplicationDetails.value.omnibusCertifiers
    while (certifiers.length <= index) certifiers.push(new CimbApplicant())
    return certifiers[index]
  }

  directorDataListForCertifier(index: number): string[] {
    const certifiers = this.cimbBankApplicationDetails.value.omnibusCertifiers
    const normalize = (name: string) => (name ?? "").trim().toUpperCase()
    const selectedNames = new Set(
      certifiers
        .filter((_, rowIndex) => rowIndex !== index)
        .map((certifier) => normalize(certifier.nameLine1))
        .filter(Boolean)
    )
    return [
      ...new Set(
        this.directors.value
          .filter((director) => this.hasText(director.name) && !selectedNames.has(normalize(director.name)))
          .map((director) => director.name)
      ),
    ]
  }

  onCertifierNameChanged(index: number): void {
    const certifier = this.certifierAt(index)
    const name = (certifier.nameLine1 ?? "").trim().toUpperCase()
    certifier.nameLine1 = name
    const director = this.directors.value.find((row) => (row.name ?? "").trim().toUpperCase() === name)
    if (name && director) {
      certifier.nameLine1 = director.name
      certifier.identification = director.identification ?? ""
    }
    this.onOtherDetailsChanged()
  }

  getOtherDetails(): CimbBankApplicationDetails {
    return this.cimbBankApplicationDetails.value
  }

  onOtherDetailsChanged(): void {
    if (this.application.value) {
      this.application.value.cimbBankApplicationDetails = this.cimbBankApplicationDetails.value
    }
    this.emitEvents("updated")
  }

  private hasText(value: string | null | undefined): boolean {
    return typeof value === "string" && value.trim().length > 0
  }

  isAuthorisedPersonTypeIncomplete(): boolean {
    return !["solely", "one", "two", "anyone"].includes(this.application.value?.signatoryType ?? "")
  }

  isAuthorisedPersonsIncomplete(rowCount: number = 6): boolean {
    const filledPersons = this.cimbBankApplicationDetails.value.generalOperationAuthorisedPersons
      .slice(0, rowCount)
      .filter((person) => this.hasText(person.name) || this.hasText(person.identification))

    return (
      filledPersons.length === 0 ||
      filledPersons.some((person) => !this.hasText(person.name) || !this.hasText(person.identification))
    )
  }

  isSigningConditionIncomplete(rowCount: number = 6): boolean {
    const details = this.cimbBankApplicationDetails.value
    if (details.generalOperationSigningCondition === "all") {
      return false
    }
    if (details.generalOperationSigningCondition !== "any") {
      return true
    }

    const count = details.generalOperationSigningCount
    const completePersons = details.generalOperationAuthorisedPersons
      .slice(0, rowCount)
      .filter((person) => this.hasText(person.name) && this.hasText(person.identification)).length

    return count === null || !Number.isInteger(count) || count < 1 || count > completePersons
  }

  isOmnibusCertifiersIncomplete(): boolean {
    const filledCertifiers = this.cimbBankApplicationDetails.value.omnibusCertifiers
      .slice(0, 2)
      .filter(
        (certifier) =>
          this.hasText(certifier.nameLine1) ||
          this.hasText(certifier.nameLine2) ||
          this.hasText(certifier.identification)
      )

    return (
      filledCertifiers.length === 0 ||
      filledCertifiers.some(
        (certifier) => !this.hasText(certifier.nameLine1) || !this.hasText(certifier.identification)
      )
    )
  }

  isDateIncomplete(field: "boardResolutionDate" | "extractPassedDate" | "extractCertificationDate"): boolean {
    const parts = this.datePartsFor(field)
    if (!/^\d{1,2}$/.test(parts.day) || !/^\d{1,2}$/.test(parts.month) || !/^\d{4}$/.test(parts.year)) {
      return true
    }

    const day = Number(parts.day)
    const month = Number(parts.month)
    const year = Number(parts.year)
    const date = new Date(0)
    date.setUTCFullYear(year, month - 1, day)
    date.setUTCHours(0, 0, 0, 0)

    return year < 1 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day
  }

  isBoardAnnexureIncomplete(): boolean {
    return this.isAuthorisedPersonsIncomplete(4)
  }

  isExtractResolutionIncomplete(): boolean {
    return this.isAuthorisedPersonTypeIncomplete()
  }

  isExtractAnnexureIncomplete(): boolean {
    return this.isAuthorisedPersonsIncomplete(6)
  }

  isSigningConditionSelected(condition: string): boolean {
    return this.cimbBankApplicationDetails.value.generalOperationSigningCondition === condition
  }

  onSigningConditionClicked(condition: string): void {
    const details = this.cimbBankApplicationDetails.value
    details.generalOperationSigningCondition = details.generalOperationSigningCondition === condition ? "" : condition
    this.onOtherDetailsChanged()
  }

  onSigningCountChanged(rawValue: string): void {
    this.cimbBankApplicationDetails.value.generalOperationSigningCount = this.parsePositiveInteger(rawValue)
    this.onOtherDetailsChanged()
  }

  parsePositiveInteger(rawValue: string): number | null {
    const number = Number(rawValue.trim())
    return rawValue.trim() !== "" && Number.isInteger(number) && number > 0 ? number : null
  }

  datePartsFor(field: "boardResolutionDate" | "extractPassedDate" | "extractCertificationDate") {
    if (field === "boardResolutionDate") return this.boardResolutionDateParts.value
    if (field === "extractPassedDate") return this.extractPassedDateParts.value
    return this.extractCertificationDateParts.value
  }

  loadDateParts(field: "boardResolutionDate" | "extractPassedDate" | "extractCertificationDate"): void {
    const date = this.cimbBankApplicationDetails.value[field]
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return
    const [year, month, day] = date.split("-")
    Object.assign(this.datePartsFor(field), { day, month, year })
  }

  getDatePart(
    field: "boardResolutionDate" | "extractPassedDate" | "extractCertificationDate",
    part: "day" | "month" | "year"
  ): string {
    return this.datePartsFor(field)[part]
  }

  onDatePartChanged(
    field: "boardResolutionDate" | "extractPassedDate" | "extractCertificationDate",
    part: "day" | "month" | "year",
    value: string
  ): void {
    const parts = this.datePartsFor(field)
    parts[part] = value.trim()
    if (!parts.day && !parts.month && !parts.year) {
      this.cimbBankApplicationDetails.value[field] = null
      this.onOtherDetailsChanged()
      return
    }
    if (!/^\d{1,2}$/.test(parts.day) || !/^\d{1,2}$/.test(parts.month) || !/^\d{4}$/.test(parts.year)) return
    const day = Number(parts.day)
    const month = Number(parts.month)
    const year = Number(parts.year)
    const date = new Date(Date.UTC(year, month - 1, day))
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return
    this.cimbBankApplicationDetails.value[field] =
      `${parts.year}-${parts.month.padStart(2, "0")}-${parts.day.padStart(2, "0")}`
    this.onOtherDetailsChanged()
  }

  async otherDataInitiation(): Promise<void> {
    await Promise.all([this.fetchBank(), this.fetchDirectors()])
  }

  async fetchDirectors(): Promise<void> {
    try {
      let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
      this.directors.value = response.map((d: Director) => {
        return new Director(d)
      })

      this.directorUsers.value = []
      for (let i = 0; i < this.directors.value.length; i++) {
        let director = this.directors.value[i]
        let user = await director.getRegisteredUser(useUserStore())
        if (!user) {
          continue
        }
        this.directorUsers.value.push(user)
      }
    } catch (e) {
      console.error("Failed to fetch directors:", e)
    }
  }

  async fetchBank(): Promise<void> {
    try {
      let response = await this.bankRepository.fetch(this.bankId)
      if (!this.bankRepository.error && response) {
        this.bank.value = new Bank(response)
        if (this.application.value) {
          this.application.value.bank = this.bank.value
        }

        this.bankBranches.value = this.bank.value.branches.map((b: BankBranch) => {
          return new BankBranch(b)
        })

        this.bankBranches.value = ObjectUtil.sort<BankBranch>(this.bankBranches.value, "stateId", "asc")
      }
    } catch (e) {
      console.error("Failed to fetch bank:", e)
    }
  }

  onAddAnotherSignatoryClicked(): void {
    if (this.nonDirectorBankSignatoryRef) {
      this.nonDirectorBankSignatoryRef.show()
    }
  }

  onAddSignatory(): void {
    this.signatoryPlaceholders.value.push(new CompanyBankSignatory())
  }

  onRemoveSignatory(index: number): void {
    this.signatoryPlaceholders.value.splice(index, 1)
    this.onCompanySignatoryChanged()
  }

  onSignatoryTypeChanged(selectedValue: string): void {
    if (!this.application.value) {
      return
    }

    this.application.value.signatoryType = selectedValue
    this.emitEvents("updated")
  }

  isSignatoryTypeSelected(type: string): boolean {
    if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.signatoryType)) {
      return false
    }

    return this.application.value.signatoryType === type
  }

  onSelectedBranchChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.bankBranchId = this.selectedBranchId.value
    this.emitEvents("updated")
  }

  getCompanySignatoryOnPage(page: number): CompanyBankSignatory[] {
    let start = (page - 3) * 7
    let end = start + 7

    return this.signatoryPlaceholders.value.slice(start, end)
  }

  getSignatureOnLastAuthoriseSignatoryPage(): string[] {
    if (!this.isShowSignaturesOnLastSignatoryPage) {
      return []
    }

    let numberOfRows = this.numberOfSignatureRowsOnSignatoryPage
    let start = 0
    let lastIndex = numberOfRows * 2
    if (lastIndex >= this.signaturePlaceholders.value.length) {
      return this.signaturePlaceholders.value
    }

    return this.signaturePlaceholders.value.slice(start, lastIndex)
  }

  getSignaturesOnPage(page: number): string[] {
    let start = (page - this.signaturePage) * 8 + this.getSignatureOnLastAuthoriseSignatoryPage().length
    let end = start + 8

    return this.signaturePlaceholders.value.slice(start, end)
  }

  onCompanySignatoryChanged(): void {
    this.cimbBankApplicationDetails.value.generalOperationAuthorisedPersons = this.signatoryPlaceholders.value
    this.onOtherDetailsChanged()
  }

  onSignatoryNameChange(signatory: CompanyBankSignatory): void {
    signatory.name = (signatory.name ?? "").trim().toUpperCase()
    const director = this.directors.value.find((item: Director) => item.name.trim().toUpperCase() === signatory.name)
    if (director) {
      signatory.identification = director.identification
      signatory.type = director.identificationType
      signatory.nationality = director.identificationType === "ic" ? "MALAYSIA" : signatory.nationality
      signatory.designation = "COMPANY DIRECTOR"
      signatory.email = director.email
      signatory.phone = director.phone
    }
    this.onCompanySignatoryChanged()
  }

  directorDataList(signatoryName: string): string[] {
    let selectedNames = this.signatoryPlaceholders.value
      .filter((s: CompanyBankSignatory, i: number) => {
        return s.name !== signatoryName && !StringUtil.isNullOrEmpty(s.name)
      })
      .map((d: CompanyBankSignatory) => {
        return d.name
      })

    let directorNames = this.directors.value
      .filter((d: Director) => {
        return !selectedNames.includes(d.name)
      })
      .map((d: Director) => {
        return d.name
      })

    return directorNames
  }

  onNationalityChanged(signatory: CompanyBankSignatory): void {
    if (signatory.nationality) {
      signatory.type = signatory.nationality.toUpperCase() === "MALAYSIA" ? "ic" : "passport"
    }
    this.onCompanySignatoryChanged()
  }

  isReadOnlyField(signatory: CompanyBankSignatory): boolean {
    return this.directors.value.some((d: Director) => {
      return d.name === signatory.name
    })
  }

  isNationalityReadOnlyField(signatory: CompanyBankSignatory): boolean {
    return (
      this.directors.value.some((d: Director) => {
        return d.name === signatory.name
      }) && signatory.type === "ic"
    )
  }

  totalPages(): number {
    return 4
  }

  getBranchId(): string {
    return this.selectedBranchId.value
  }

  getAuthorisedPersonsForOnlineBanking(): OnlineBanking[] {
    if (!this.application.value) {
      return []
    }

    return this.application.value?.onlineBanking || []
  }

  getSignatoryType(): string {
    if (!this.application.value) {
      return ""
    }

    return this.application.value.signatoryType ?? ""
  }

  getSignatories(): CompanyBankSignatory[] {
    if (!this.application.value) {
      return []
    }

    return this.application.value.signatories || []
  }

  directorDataListForSignatories(index: number): string[] {
    let selectedNames = this.signatoryPlaceholders.value
      .filter((s: CompanyBankSignatory, i: number) => {
        return i !== index && !StringUtil.isNullOrEmpty(s.name)
      })
      .map((d: CompanyBankSignatory) => {
        return d.name
      })

    let directorNames = this.directors.value
      .filter((d: Director) => {
        return !selectedNames.includes(d.name)
      })
      .map((d: Director) => {
        return d.name
      })

    return directorNames
  }

  getBranchesInState(stateId: number): BankBranch[] {
    let branches: BankBranch[] = this.bankBranches.value.filter((b: BankBranch) => {
      return (
        b.stateId === stateId &&
        (StringUtil.isNullOrEmpty(this.searchBranch.value) ||
          b.name.toLowerCase().includes(this.searchBranch.value.toLowerCase()) ||
          b.state.name.toLowerCase().includes(this.searchBranch.value.toLowerCase()))
      )
    })

    return ObjectUtil.sort<BankBranch>(branches, "name", "asc")
  }

  onBranchOptionClicked(): void {
    this.isShowBranchOptions.value = !this.isShowBranchOptions.value
    this.searchBranch.value = ""
  }

  onBranchOptionSelected(branchId: string): void {
    this.selectedBranchId.value = branchId
    this.isShowBranchOptions.value = false
    this.searchBranch.value = ""
    this.onSelectedBranchChanged()
  }

  getDirectorName(index: number): string {
    if (this.directors.value[index]) {
      return this.directors.value[index].name
    }
    return ""
  }

  getDirectorIdentification(index: number): string {
    if (this.directors.value[index]) {
      return `${this.directors.value[index].identification}`
    }
    return ""
  }

  getBoldQuote(text: string): string {
    return `(“<b>${text}</b>”)`
  }

  get loaderLabel(): string {
    return "Preparing Your"
  }

  get loaderSublabel(): string {
    return "Resolution"
  }

  get branchStates(): State[] {
    let states = this.bankBranches.value
      .filter((b: BankBranch) => {
        return (
          StringUtil.isNullOrEmpty(this.searchBranch.value) ||
          b.name.toLowerCase().includes(this.searchBranch.value.toLowerCase()) ||
          b.state.name.toLowerCase().includes(this.searchBranch.value.toLowerCase())
        )
      })
      .map((b: BankBranch) => {
        return b.state
      })

    let uniqueStates: State[] = []
    states.forEach((s: State) => {
      if (!uniqueStates.some((us: State) => us.id === s.id)) {
        uniqueStates.push(s)
      }
    })

    return ObjectUtil.sort<State>(uniqueStates, "name", "asc")
  }

  get selectedBranch(): BankBranch | null {
    if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.bankBranchId)) {
      return null
    }

    let branch = this.bankBranches.value.find((b: BankBranch) => {
      return b.id === this.application.value?.bankBranchId
    })

    return branch ?? null
  }

  get selectedBranchName(): string {
    return this.selectedBranch?.name ?? "YOUR SELECTED BRANCH"
  }

  get isBranchPlaceholder(): boolean {
    return this.selectedBranch === null
  }

  get authorisedSignatoryPages(): number[] {
    let length = Math.ceil(this.signatoryPlaceholders.value.length / 7)

    return Array.from({ length: length }, (_, i) => 3 + i)
  }

  get signaturePage(): number {
    return this.authorisedSignatoryPages.length + 3
  }

  get numberOfSignatureRowsOnSignatoryPage(): number {
    let numberOfSignatoryOnPage = this.getCompanySignatoryOnPage(
      this.authorisedSignatoryPages[this.authorisedSignatoryPages.length - 1]
    ).length

    let numberOfSignatureRowsOnSignatoryPage = 5 - numberOfSignatoryOnPage
    if (numberOfSignatureRowsOnSignatoryPage < 0) {
      numberOfSignatureRowsOnSignatoryPage = 0
    }

    return numberOfSignatureRowsOnSignatoryPage
  }

  get signaturePages(): number[] {
    let numberOfRows = Math.ceil((this.directors.value.length + 1) / 2)

    let numberOfRowsToDisplay = numberOfRows - this.numberOfSignatureRowsOnSignatoryPage

    let numberOfPages = Math.ceil(numberOfRowsToDisplay / 8)

    return Array.from({ length: numberOfPages }, (_, i) => this.signaturePage + i)
  }

  get isShowSignaturesOnLastSignatoryPage(): boolean {
    let numberOfSignatoryOnPage = this.getCompanySignatoryOnPage(
      this.authorisedSignatoryPages[this.authorisedSignatoryPages.length - 1]
    ).length

    return numberOfSignatoryOnPage <= 5
  }

  get showDocument(): boolean {
    if (!this.isDocumentLoaded.value) {
      return !this.isLoading.value
    }

    return true
  }
}
