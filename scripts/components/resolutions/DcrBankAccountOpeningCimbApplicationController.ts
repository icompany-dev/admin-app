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
import {
  CimbBankApplicationDetails,
  CimbBizChannelUser,
  CimbSystemAdministrator,
  CimbApplicant,
  CimbAccountSignatory,
} from "~/scripts/types/banks/CimbBankApplicationDetails"
import { Shareholder } from "~/scripts/models/Shareholder"

export class DcrBankAccountOpeningCimbApplicationController extends ResolutionController<CompanyBankAccountOpening> {
  isDocumentLoaded: Ref<boolean> = ref<boolean>(false)

  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()

  bankId: string = BankConstants.CIMB_DETAIL.id
  bank = ref<Bank>(new Bank())
  bankBranches = ref<BankBranch[]>([])

  company: Ref<Company> = ref<Company>(new Company())
  directors = ref<Director[]>([])
  directorUsers = ref<User[]>([])
  shareholders = ref<Shareholder[]>([])
  signatories = ref<CompanyBankSignatory[]>([])

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

  additionalCssClass: string = "cimb-application-form"
  cimbBankApplicationDetails = ref<CimbBankApplicationDetails>(new CimbBankApplicationDetails())
  documentDateDay = ref<string>("")
  documentDateMonth = ref<string>("")
  documentDateYear = ref<string>("")

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

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)
      this.loadOtherDetails()

      if (this.application.value.companyId === this.companyDataManager.companyId) {
        this.application.value.company = new Company(this.companyDataManager.company)
      } else {
        let companyRepository = useCompanyStore()
        let companyResponse = await companyRepository.fetch(this.application.value.companyId)
        this.application.value.company = new Company(companyResponse)
      }

      this.application.value.signatories.forEach((s: CompanyBankSignatory, index: number) => {
        this.signatoryPlaceholders.value[index] = s
      })

      if (this.application.value.paidAt !== this.application.value.updatedAt) {
        this.selectedBranchId.value = this.application.value.bankBranchId
      }

      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    this.application.value = new CompanyBankAccountOpening()
    this.application.value.companyId = this.companyId.value

    if (this.companyId.value === this.companyDataManager.companyId) {
      this.application.value.company = new Company(this.companyDataManager.company)
    } else {
      let response = await this.companyRepository.fetch(this.companyId.value)
      if (!this.companyRepository.error) {
        this.application.value.company = new Company(response)
      }
    }

    this.application.value.bankId = this.bankId
    this.cimbBankApplicationDetails.value = new CimbBankApplicationDetails()
    this.documentDateDay.value = ""
    this.documentDateMonth.value = ""
    this.documentDateYear.value = ""
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
    this.loadOtherDetails()

    this.signaturePlaceholders.value = this.directors.value.map((d: Director) => {
      return d.name
    })

    this.signaturePlaceholders.value.splice(1, 0, SecretaryInformation.SECRETARY_NAME_LIST[1].name)

    this.signatoryPlaceholders.value = []
    if (this.application.value !== null) {
      if (this.application.value.signatories.length > 0) {
        this.signatoryPlaceholders.value = this.application.value.signatories.map((s: CompanyBankSignatory) => {
          return new CompanyBankSignatory(s)
        })
      }
    }

    if (this.signatoryPlaceholders.value.length <= 0) {
      this.directorUsers.value.forEach((u: User) => {
        let signatory = new CompanyBankSignatory()
        signatory.name = u.name
        signatory.type = u.detail?.identificationType ?? "ic"
        signatory.designation = "COMPANY DIRECTOR"
        signatory.identification = u.detail?.identification ?? ""
        signatory.nationality = u.detail?.citizenship?.toUpperCase() ?? ""
        signatory.email = u.email
        signatory.phone = u.phone
        signatory.role = "maker"

        this.signatoryPlaceholders.value.push(signatory)
      })
    }

    this.isDocumentLoaded.value = true
  }

  loadOtherDetails(): void {
    const saved = this.application.value?.cimbBankApplicationDetails
    if (!saved) {
      return
    }

    this.cimbBankApplicationDetails.value = new CimbBankApplicationDetails(saved)
    const date = this.cimbBankApplicationDetails.value.documentDate
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split("-")
      this.documentDateDay.value = day
      this.documentDateMonth.value = month
      this.documentDateYear.value = year
    } else {
      this.documentDateDay.value = ""
      this.documentDateMonth.value = ""
      this.documentDateYear.value = ""
    }
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

  isAccountTypeSelected(accountType: string): boolean {
    return this.cimbBankApplicationDetails.value.accountTypes.includes(accountType)
  }

  isBusinessTypeSelected(businessType: string): boolean {
    return this.cimbBankApplicationDetails.value.businessType === businessType
  }

  onBusinessTypeClicked(businessType: string): void {
    const details = this.cimbBankApplicationDetails.value
    details.businessType = details.businessType === businessType ? "" : businessType
    this.onOtherDetailsChanged()
  }

  onAccountTypeClicked(accountType: string): void {
    const details = this.cimbBankApplicationDetails.value
    details.accountTypes = details.accountTypes.includes(accountType)
      ? details.accountTypes.filter((value: string) => value !== accountType)
      : [...details.accountTypes, accountType]
    details.accountType = details.accountTypes[0] ?? ""
    this.onOtherDetailsChanged()
  }

  isBooleanEmpty(
    field: "isResident" | "isBumiputraControlled" | "isGovernmentOwned" | "idDuitnowIDRegistration"
  ): boolean {
    return typeof this.cimbBankApplicationDetails.value[field] !== "boolean"
  }

  isBooleanSelected(
    field: "isResident" | "isBumiputraControlled" | "isGovernmentOwned" | "idDuitnowIDRegistration",
    value: boolean
  ): boolean {
    return this.cimbBankApplicationDetails.value[field] === value
  }

  onBooleanClicked(
    field: "isResident" | "isBumiputraControlled" | "isGovernmentOwned" | "idDuitnowIDRegistration",
    value: boolean
  ): void {
    const details = this.cimbBankApplicationDetails.value
    // A second click clears the selection; yes and no can never both be selected.
    details[field] = details[field] === value ? null : value
    this.onOtherDetailsChanged()
  }

  isPurposeOfAccountSelected(purpose: string): boolean {
    return this.cimbBankApplicationDetails.value.purposeOfAccount.includes(purpose)
  }

  onPurposeOfAccountClicked(purpose: string): void {
    const details = this.cimbBankApplicationDetails.value
    details.purposeOfAccount = details.purposeOfAccount.includes(purpose)
      ? details.purposeOfAccount.filter((value: string) => value !== purpose)
      : [...details.purposeOfAccount, purpose]
    this.onOtherDetailsChanged()
  }

  isSourceOfFundsSelected(source: string): boolean {
    return this.cimbBankApplicationDetails.value.sourceOfFunds.includes(source)
  }

  onSourceOfFundsClicked(source: string): void {
    const details = this.cimbBankApplicationDetails.value
    details.sourceOfFunds = details.sourceOfFunds.includes(source)
      ? details.sourceOfFunds.filter((value: string) => value !== source)
      : [...details.sourceOfFunds, source]
    this.onOtherDetailsChanged()
  }

  isApplicationChoiceSelected(choice: "A" | "B" | "C" | "D"): boolean {
    return this.cimbBankApplicationDetails.value.applicationChoiceOption === choice
  }

  onApplicationChoiceClicked(choice: "A" | "B" | "C" | "D"): void {
    const details = this.cimbBankApplicationDetails.value
    details.applicationChoiceOption = details.applicationChoiceOption === choice ? null : choice
    this.onOtherDetailsChanged()
  }

  businessOwnerAt(index: number): CompanyBankSignatory {
    const owners = this.cimbBankApplicationDetails.value.businessOwners
    while (owners.length <= index) {
      owners.push(new CompanyBankSignatory())
    }
    return owners[index]
  }

  onBusinessOwnerNameChanged(index: number): void {
    let owner = this.cimbBankApplicationDetails.value.businessOwners[index]

    if (!owner) {
      this.onOtherDetailsChanged()
      return
    }

    const ownerName = owner.name?.toUpperCase().trim() ?? ""
    const matchShareholder = this.shareholders.value.find((s: Shareholder) => {
      return StringUtil.isEqual(s.name, ownerName) && !s.isCorporateRepresentative()
    })

    if (ownerName) {
      owner.phone = !StringUtil.isNullOrEmpty(owner.phone) ? owner.phone : (matchShareholder?.phone ?? null)
      owner.email = !StringUtil.isNullOrEmpty(owner.email) ? owner.email : (matchShareholder?.email ?? null)
      this.cimbBankApplicationDetails.value.businessOwners[index] = new CompanyBankSignatory(owner)
    }

    this.onOtherDetailsChanged()
  }

  onBusinessOwnerChanged(): void {
    this.onOtherDetailsChanged()
  }

  directorDataListForBusinessOwner(index: number): string[] {
    let selectedNames = this.cimbBankApplicationDetails.value.businessOwners
      .filter((s: CompanyBankSignatory, i: number) => {
        return i !== index && !StringUtil.isNullOrEmpty(s.name)
      })
      .map((d: CompanyBankSignatory) => {
        return d.name
      })

    let shareholderNames = this.shareholders.value
      .filter((s: Shareholder) => {
        return !selectedNames.includes(s.name)
      })
      .map((s: Shareholder) => {
        return s.name
      })

    return shareholderNames
  }

  bizChannelUserAt(index: number): CimbBizChannelUser {
    const users = this.cimbBankApplicationDetails.value.bizChannelUsers
    while (users.length <= index) users.push(new CimbBizChannelUser())
    return users[index]
  }

  isBizChannelRoleSelected(index: number, role: string): boolean {
    return this.bizChannelUserAt(index).role === role
  }

  onBizChannelRoleClicked(index: number, role: string): void {
    const user = this.bizChannelUserAt(index)
    user.role = user.role === role ? "" : role
    this.onOtherDetailsChanged()
  }

  systemAdministratorAt(index: number): CimbSystemAdministrator {
    const administrators = this.cimbBankApplicationDetails.value.systemAdministrators
    while (administrators.length <= index) administrators.push(new CimbSystemAdministrator())
    return administrators[index]
  }

  applicantAt(index: number): CimbApplicant {
    const applicants = this.cimbBankApplicationDetails.value.applicants
    while (applicants.length <= index) applicants.push(new CimbApplicant())
    return applicants[index]
  }

  accountSignatoryAt(index: number): CimbAccountSignatory {
    const signatories = this.cimbBankApplicationDetails.value.accountSignatories
    while (signatories.length <= index) signatories.push(new CimbAccountSignatory())
    return signatories[index]
  }

  isSignaturePurposeSelected(purpose: string): boolean {
    return this.cimbBankApplicationDetails.value.signaturePurpose === purpose
  }

  onSignaturePurposeClicked(purpose: string): void {
    const details = this.cimbBankApplicationDetails.value
    details.signaturePurpose = details.signaturePurpose === purpose ? "" : purpose
    this.onOtherDetailsChanged()
  }

  onNumberChanged(
    field:
      | "expectedNumberOfTransactionsPerMonth"
      | "expectedAmountOfTransactionsPerMonth"
      | "paidUpCapital"
      | "annualSales"
      | "employeeCount"
      | "totalGroupAnualSales",
    rawValue: string
  ): void {
    const value = rawValue.trim().replace(/,/g, "")
    this.cimbBankApplicationDetails.value[field] =
      value === "" || !Number.isFinite(Number(value)) ? null : Number(value)
    this.onOtherDetailsChanged()
  }

  getDocumentDatePart(part: "day" | "month" | "year"): string {
    if (part === "day") return this.documentDateDay.value
    if (part === "month") return this.documentDateMonth.value
    return this.documentDateYear.value
  }

  onDocumentDatePartChanged(part: "day" | "month" | "year", value: string): void {
    if (part === "day") this.documentDateDay.value = value
    else if (part === "month") this.documentDateMonth.value = value
    else this.documentDateYear.value = value

    const day = this.documentDateDay.value
    const month = this.documentDateMonth.value
    const year = this.documentDateYear.value
    this.cimbBankApplicationDetails.value.documentDate =
      /^\d{2}$/.test(day) && /^\d{2}$/.test(month) && /^\d{4}$/.test(year) ? `${year}-${month}-${day}` : null
    this.onOtherDetailsChanged()
  }

  async otherDataInitiation(): Promise<void> {
    await Promise.all([this.fetchBank(), this.fetchDirectors(), this.fetchShareholders(), this.fetchCompany()])
  }

  async fetchDirectors(): Promise<void> {
    try {
      if (this.companyId.value === this.companyDataManager.companyId) {
        this.directors.value = this.companyDataManager.directors.map((d: Director) => {
          return new Director(d)
        })
      } else {
        let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
        this.directors.value = response.map((d: Director) => {
          return new Director(d)
        })
      }

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

  async fetchShareholders(): Promise<void> {
    try {
      if (this.companyId.value === this.companyDataManager.companyId) {
        this.shareholders.value = this.companyDataManager.shareholders.map((s: Shareholder) => {
          return new Shareholder(s)
        })
      } else {
        let response = await this.shareholderRepository.fetchAllForCompany(this.companyId.value)
        this.shareholders.value = response.map((s: Shareholder) => {
          return new Shareholder(s)
        })
      }
    } catch (e) {
      console.error("Failed to fetch directors:", e)
    }
  }

  async fetchCompany(): Promise<void> {
    try {
      const companyRepository = useCompanyStore()
      let response = await companyRepository.fetch(this.companyId.value)
      this.company.value = new Company(response)
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

  resetSignatoryPlaceholder(): void {
    this.signatoryPlaceholders.value = [
      new CompanyBankSignatory(),
      new CompanyBankSignatory(),
      new CompanyBankSignatory(),
      new CompanyBankSignatory(),
      new CompanyBankSignatory(),
      new CompanyBankSignatory(),
    ]
  }

  setSignatoryPlaceholder(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.signatories.forEach((s: CompanyBankSignatory, index: number) => {
      this.signatoryPlaceholders.value[index] = s
    })
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
    if (!this.application.value) {
      return
    }

    if (!this.application.value.signatories) {
      this.application.value.signatories = []
    }

    this.application.value.signatories = this.signatoryPlaceholders.value
      .filter((s: CompanyBankSignatory) => {
        return !StringUtil.isNullOrEmpty(s.name) && !StringUtil.isNullOrEmpty(s.identification)
      })
      .map((s: CompanyBankSignatory) => {
        return new CompanyBankSignatory(s)
      })

    this.application.value.onlineBanking = this.signatoryPlaceholders.value
      .filter((s: CompanyBankSignatory) => {
        return !StringUtil.isNullOrEmpty(s.name) && !StringUtil.isNullOrEmpty(s.identification)
      })
      .map((s: CompanyBankSignatory) => {
        return new OnlineBanking(s)
      })

    this.emitEvents("updated")
  }

  onSignatoryNameChange(signatory: CompanyBankSignatory): void {
    signatory.name = signatory.name ? signatory.name.trim().toUpperCase() : ""

    let matchedDirector = this.directors.value.find((d: Director) => {
      return d.name === signatory.name
    })

    if (!matchedDirector) {
      signatory.identification = ""
      signatory.type = ""
      signatory.nationality = ""
      signatory.designation = ""
      signatory.email = ""
      signatory.phone = ""

      this.onCompanySignatoryChanged()
      return
    }

    signatory.identification = matchedDirector.identification
    signatory.type = matchedDirector.identificationType
    signatory.nationality = matchedDirector.identificationType === "ic" ? "MALAYSIA" : ""
    signatory.designation = "COMPANY DIRECTOR"
    signatory.role = "maker"
    signatory.email = matchedDirector.email
    signatory.phone = matchedDirector.phone

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
    signatory.type = signatory.nationality === "Malaysia" ? "ic" : "passport"
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

  isContactPersonIncomplete(): boolean {
    const details = this.cimbBankApplicationDetails.value
    return [
      details.contactPersonName,
      details.contactPersonNumber,
      details.contactPersonDesignation,
      details.contactPersonEmail,
    ].some((value) => this.isPaperTagFieldEmpty(value))
  }

  isBusinessOwnersIncomplete(): boolean {
    const owners = this.cimbBankApplicationDetails.value.businessOwners

    const filledOwners = owners.filter((b) => {
      return (
        !StringUtil.isNullOrEmpty(b.name?.trim() ?? "") ||
        !StringUtil.isNullOrEmpty(b.email?.trim() ?? "") ||
        !StringUtil.isNullOrEmpty(b.phone?.trim() ?? "")
      )
    })

    if (filledOwners.length === 0) {
      return true
    }

    return filledOwners.some((b) => {
      return (
        StringUtil.isNullOrEmpty(b.name?.trim() ?? "") ||
        StringUtil.isNullOrEmpty(b.email?.trim() ?? "") ||
        StringUtil.isNullOrEmpty(b.phone?.trim() ?? "")
      )
    })
  }

  private isPaperTagFieldEmpty(value: unknown): boolean {
    return value === null || value === undefined || (typeof value === "string" && value.trim() === "")
  }

  private isPaperTagListIncomplete<T>(
    rows: T[],
    isStarted: (row: T) => boolean,
    isComplete: (row: T) => boolean
  ): boolean {
    const startedRows = rows.filter(isStarted)
    return startedRows.length === 0 || startedRows.some((row) => !isComplete(row))
  }

  isApplicantsIncomplete(): boolean {
    // The second name line is optional, but entering it starts the row.
    return this.isPaperTagListIncomplete(
      this.cimbBankApplicationDetails.value.applicants,
      (row) => [row.nameLine1, row.nameLine2, row.identification].some((value) => !this.isPaperTagFieldEmpty(value)),
      (row) => [row.nameLine1, row.identification].every((value) => !this.isPaperTagFieldEmpty(value))
    )
  }

  isBranchIncomplete(): boolean {
    return this.isPaperTagFieldEmpty(this.selectedBranchId.value)
  }

  isSignaturePurposeIncomplete(): boolean {
    return !["new-account", "add", "update", "condition"].includes(
      this.cimbBankApplicationDetails.value.signaturePurpose
    )
  }

  isAccountSignatoriesIncomplete(): boolean {
    return this.isPaperTagListIncomplete(
      this.cimbBankApplicationDetails.value.accountSignatories,
      (row) =>
        [
          row.name,
          row.dateOfBirth,
          row.nric,
          row.nationality,
          row.designation,
          row.passportNumber,
          row.address,
          row.signingGroup,
        ].some((value) => !this.isPaperTagFieldEmpty(value)),
      (row) =>
        [row.name, row.dateOfBirth, row.nationality, row.designation, row.address, row.signingGroup].every(
          (value) => !this.isPaperTagFieldEmpty(value)
        ) &&
        (!this.isPaperTagFieldEmpty(row.nric) || !this.isPaperTagFieldEmpty(row.passportNumber))
    )
  }

  private getDirectorNameSuggestions(currentName: string, selectedNames: string[]): string[] {
    const normalize = (value: string) => (value ?? "").trim().toUpperCase()
    const current = normalize(currentName)
    const selected = new Set(selectedNames.map(normalize).filter(Boolean))
    return [
      ...new Set(
        this.directors.value
          .filter(
            (director) =>
              !this.isPaperTagFieldEmpty(director.name) &&
              (normalize(director.name) === current || !selected.has(normalize(director.name)))
          )
          .map((director) => director.name)
      ),
    ]
  }

  directorDataListForApplicant(index: number): string[] {
    const rows = this.cimbBankApplicationDetails.value.applicants
    return this.getDirectorNameSuggestions(
      rows[index]?.nameLine1 ?? "",
      rows.filter((_, rowIndex) => rowIndex !== index).map((row) => row.nameLine1)
    )
  }

  directorDataListForAccountSignatory(index: number): string[] {
    const rows = this.cimbBankApplicationDetails.value.accountSignatories
    return this.getDirectorNameSuggestions(
      rows[index]?.name ?? "",
      rows.filter((_, rowIndex) => rowIndex !== index).map((row) => row.name)
    )
  }

  onApplicantNameChanged(index: number): void {
    const applicant = this.applicantAt(index)
    const name = (applicant.nameLine1 ?? "").trim().toUpperCase()
    applicant.nameLine1 = name
    const director = this.directors.value.find((row) => (row.name ?? "").trim().toUpperCase() === name)
    if (name && director) {
      applicant.nameLine1 = director.name
      applicant.identification = director.identification ?? ""
    }
    this.onOtherDetailsChanged()
  }

  onAccountSignatoryNameChanged(index: number): void {
    const signatory = this.accountSignatoryAt(index)
    const name = (signatory.name ?? "").trim().toUpperCase()
    signatory.name = name
    const director = this.directors.value.find((row) => (row.name ?? "").trim().toUpperCase() === name)
    if (name && director) {
      signatory.name = director.name
      const isIc = director.identificationType === "ic"
      signatory.nric = isIc ? (director.identification ?? "") : ""
      signatory.passportNumber = isIc ? "" : (director.identification ?? "")
      signatory.designation = "COMPANY DIRECTOR"
      signatory.nationality = isIc ? "MALAYSIA" : ""
    }
    this.onOtherDetailsChanged()
  }

  onBranchSelected(selectedBranchId: string): void {
    this.selectedBranchId.value = selectedBranchId
    this.onSelectedBranchChanged()
  }

  totalPages(): number {
    return 8
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

  getDayOfDate(date: string): string {
    const dayjs = useDayjs()
    return dayjs(date).format("DD")
  }

  getMonthOfDate(date: string): string {
    const dayjs = useDayjs()
    return dayjs(date).format("MM")
  }

  getYearOfDate(date: string): string {
    const dayjs = useDayjs()
    return dayjs(date).format("YYYY")
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

  get companyIncorporationDate(): string {
    const dayjs = useDayjs()
    return dayjs(this.company.value.incorporatedAt ?? "").format("YYYY-MM-DD")
  }

  get showDocument(): boolean {
    if (!this.isDocumentLoaded.value) {
      return !this.isLoading.value
    }

    return true
  }
}
