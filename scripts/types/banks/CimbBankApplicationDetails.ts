import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { AddressDetail } from "~/scripts/models/AddressDetail"

export class CimbBizChannelUser {
  name: string = ""
  mobileNumber: string = ""
  email: string = ""
  role: string = ""

  constructor(data: any | null = null) {
    if (data) Object.assign(this, data)
  }
}

export class CimbSystemAdministrator {
  name: string = ""
  mobileNumber: string = ""
  email: string = ""

  constructor(data: any | null = null) {
    if (data) Object.assign(this, data)
  }
}

export class CimbApplicant {
  nameLine1: string = ""
  nameLine2: string = ""
  identification: string = ""

  constructor(data: any | null = null) {
    if (data) Object.assign(this, data)
  }
}

export class CimbAccountSignatory {
  name: string = ""
  dateOfBirth: string = ""
  nric: string = ""
  nationality: string = ""
  designation: string = ""
  passportNumber: string = ""
  address: string = ""
  signingGroup: string = ""

  constructor(data: any | null = null) {
    if (data) Object.assign(this, data)
  }
}

export class CimbBankApplicationDetails {
  typeOfApplication: string | null = null // prefilled-information, just-resolution
  accountType: string = "" // First selected type, for existing consumers
  accountTypes: string[] = []
  otherAccountDescription: string = ""
  businessType: string = "company-sdn-bhd"
  otherBusinessType: string = ""
  registeredNameSecondLine: string = ""
  otherMailingAddress: AddressDetail = new AddressDetail()
  mailingAddressState: string = ""
  isResident: boolean | null = null
  isBumiputraControlled: boolean | null = null

  officeContactNo: string = ""
  companyWebsite: string = ""
  businessEmail: string = ""
  businessWithForeignCompany: string = ""
  additionalForeignCountry: string = ""
  natureOfBusiness: string = ""
  additionalNatureOfBusiness: string = ""
  expectedNumberOfTransactionsPerMonth: number | null = null
  expectedAmountOfTransactionsPerMonth: number | null = null

  paidUpCapital: number | null = null
  annualSales: number | null = null
  employeeCount: number | null = null
  isGovernmentOwned: boolean | null = null
  groupName: string | null = null
  groupNameSecondLine: string = ""
  totalGroupAnualSales: number | null = null
  groupSalesSecondLine: string = ""

  contactPersonName: string = ""
  contactPersonNameSecondLine: string = ""
  contactPersonEmail: string = ""
  contactPersonNumber: string = ""
  contactPersonDesignation: string = ""
  contactPersonDesignationSecondLine: string = ""

  purposeOfAccount: string[] = []
  purposeOfAccountOthers: string = ""
  sourceOfFunds: string[] = []
  sourceOfFundOthers: string = ""
  businessOwners: CompanyBankSignatory[] = []

  applicationChoiceOption: string | null = null // A, B, C, D
  bizChannelUsers: CimbBizChannelUser[] = []
  systemAdministrators: CimbSystemAdministrator[] = []
  idDuitnowIDRegistration: boolean | null = null

  applicants: CimbApplicant[] = []
  documentDate: string | null = null // YYYY-MM-DD
  debitCardHolderNameLine1: string = ""
  debitCardHolderNameLine2: string = ""
  debitCardHolderIdentification: string = ""

  signatureBranch: string = ""
  signatureAccountNumber: string = ""
  signaturePurpose: string = "" // new-account, add, update, condition
  accountSignatories: CimbAccountSignatory[] = []

  generalOperationAuthorisedPersons: CompanyBankSignatory[] = []
  omnibusAuthorisedCount: number | null = null
  generalOperationSigningCondition: string = "" // any, all
  generalOperationSigningCount: number | null = null
  boardResolutionDate: string | null = null
  extractPassedDate: string | null = null
  extractCertificationDate: string | null = null
  omnibusCertifiers: CimbApplicant[] = []

  constructor(data: any | null = null) {
    if (!data) return

    Object.assign(this, data)
    this.accountTypes = [...(data.accountTypes ?? (data.accountType ? [data.accountType] : []))]
    this.purposeOfAccount = [...(data.purposeOfAccount ?? [])]
    this.sourceOfFunds = [...(data.sourceOfFunds ?? [])]
    this.otherMailingAddress = Object.assign(new AddressDetail(), data.otherMailingAddress ?? {})
    this.businessOwners = (data.businessOwners ?? []).map((owner: any) => new CompanyBankSignatory(owner))
    this.bizChannelUsers = (data.bizChannelUsers ?? []).map((user: any) => new CimbBizChannelUser(user))
    this.systemAdministrators = (data.systemAdministrators ?? []).map(
      (admin: any) => new CimbSystemAdministrator(admin)
    )
    this.applicants = (data.applicants ?? []).map((applicant: any) => new CimbApplicant(applicant))
    this.accountSignatories = (data.accountSignatories ?? []).map(
      (signatory: any) => new CimbAccountSignatory(signatory)
    )
    this.generalOperationAuthorisedPersons = (data.generalOperationAuthorisedPersons ?? []).map(
      (person: any) => new CompanyBankSignatory(person)
    )
    this.omnibusCertifiers = (data.omnibusCertifiers ?? []).map((certifier: any) => new CimbApplicant(certifier))
  }

  private hasRequiredText(value: unknown): boolean {
    return typeof value === "string" && value.trim().length > 0
  }

  private isRequiredListComplete<T>(
    rows: T[],
    isStarted: (row: T) => boolean,
    isComplete: (row: T) => boolean
  ): boolean {
    const filledRows = rows.filter(isStarted)
    return filledRows.length > 0 && filledRows.every(isComplete)
  }

  private isRequiredDateComplete(value: string | null): boolean {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
    const [year, month, day] = value.split("-").map(Number)
    const date = new Date(0)
    date.setUTCFullYear(year, month - 1, day)
    date.setUTCHours(0, 0, 0, 0)
    return year > 0 && date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  }

  get isContactPersonComplete(): boolean {
    return [
      this.contactPersonName,
      this.contactPersonEmail,
      this.contactPersonNumber,
      this.contactPersonDesignation,
    ].every((value) => this.hasRequiredText(value))
  }

  get isApplicationDetailsComplete(): boolean {
    const ownersComplete = this.isRequiredListComplete(
      this.businessOwners,
      (row) => [row.name, row.email, row.phone].some((value) => this.hasRequiredText(value)),
      (row) => [row.name, row.email, row.phone].every((value) => this.hasRequiredText(value))
    )
    const applicantsComplete = this.isRequiredListComplete(
      this.applicants,
      (row) => [row.nameLine1, row.nameLine2, row.identification].some((value) => this.hasRequiredText(value)),
      (row) => [row.nameLine1, row.identification].every((value) => this.hasRequiredText(value))
    )
    const signatoriesComplete = this.isRequiredListComplete(
      this.accountSignatories,
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
        ].some((value) => this.hasRequiredText(value)),
      (row) =>
        [row.name, row.dateOfBirth, row.nationality, row.designation, row.address, row.signingGroup].every((value) =>
          this.hasRequiredText(value)
        ) &&
        (this.hasRequiredText(row.nric) || this.hasRequiredText(row.passportNumber))
    )
    return (
      typeof this.isResident === "boolean" &&
      typeof this.isBumiputraControlled === "boolean" &&
      this.isContactPersonComplete &&
      ownersComplete &&
      applicantsComplete &&
      signatoriesComplete &&
      ["new-account", "add", "update", "condition"].includes(this.signaturePurpose)
    )
  }

  get isOmnibusDetailsComplete(): boolean {
    const personsComplete = (rowCount: number) =>
      this.isRequiredListComplete(
        this.generalOperationAuthorisedPersons.slice(0, rowCount),
        (row) => this.hasRequiredText(row.name) || this.hasRequiredText(row.identification),
        (row) => this.hasRequiredText(row.name) && this.hasRequiredText(row.identification)
      )
    const signingConditionComplete = (rowCount: number): boolean => {
      if (this.generalOperationSigningCondition === "all") return true
      if (this.generalOperationSigningCondition !== "any") return false
      const count = this.generalOperationSigningCount
      const personsCount = this.generalOperationAuthorisedPersons
        .slice(0, rowCount)
        .filter((row) => this.hasRequiredText(row.name) && this.hasRequiredText(row.identification)).length
      return count !== null && Number.isInteger(count) && count >= 1 && count <= personsCount
    }
    const certifiersComplete = this.isRequiredListComplete(
      this.omnibusCertifiers.slice(0, 2),
      (row) => [row.nameLine1, row.nameLine2, row.identification].some((value) => this.hasRequiredText(value)),
      (row) => [row.nameLine1, row.identification].every((value) => this.hasRequiredText(value))
    )
    return (
      personsComplete(4) &&
      personsComplete(6) &&
      signingConditionComplete(4) &&
      signingConditionComplete(6) &&
      certifiersComplete &&
      this.isRequiredDateComplete(this.boardResolutionDate) &&
      this.isRequiredDateComplete(this.extractPassedDate) &&
      this.isRequiredDateComplete(this.extractCertificationDate)
    )
  }

  get isDetailComplete(): boolean {
    if (this.typeOfApplication === "just-resolution") return true
    return (
      this.typeOfApplication === "prefilled-information" &&
      this.isApplicationDetailsComplete &&
      this.isOmnibusDetailsComplete
    )
  }
}
