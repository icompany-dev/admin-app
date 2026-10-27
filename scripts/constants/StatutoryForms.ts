import { StatutoryFormBundleOption } from "../types/statutory-forms/StatutoryFormBundleOption"

//NOTE: This is only for now. We will pull this data from the backend
export enum StatutoryFormBundleTypes {
  MOF = "mof",
  CIDB = "cidb",
  Loan = "loan",
  CDS = "cds",
}

export class StatutoryFormBundles {
  static MOF_APPLICATION: StatutoryFormBundleOption = new StatutoryFormBundleOption(
    "MOF Application",
    "Permohonan MOF",
    StatutoryFormBundleTypes.MOF,
    false
  )

  static CIDB_APPLICATION: StatutoryFormBundleOption = new StatutoryFormBundleOption(
    "CIDB Application",
    "Permohonan CIDB",
    StatutoryFormBundleTypes.CIDB,
    false
  )

  static LOAN_APPLICATION: StatutoryFormBundleOption = new StatutoryFormBundleOption(
    "Loan Application",
    "Permohonan Loan",
    StatutoryFormBundleTypes.Loan,
    false
  )

  static CDS_ACCOUNT_OPENING: StatutoryFormBundleOption = new StatutoryFormBundleOption(
    "CDS Account Opening",
    "Pembukaan Akaun CDS",
    StatutoryFormBundleTypes.CDS,
    false
  )

  static BUNDLE_OPTIONS: StatutoryFormBundleOption[] = [
    this.MOF_APPLICATION,
    this.CIDB_APPLICATION,
    this.LOAN_APPLICATION,
    this.CDS_ACCOUNT_OPENING,
  ]
}

export enum StatutoryFormKeywords {
  COI = "certificate of incorporation",
  S14 = "S. 14,Superform,Section 14,S 14,Section 14",
  S28 = "S. 28,Certificate of Change of Name,Section 28,S 28",
  S15 = "S. 15,Notification of Incorporation,Section 15,S 15",
  S78 = "S. 78,Return of Allotment,Section 78,S 78",
  S58 = "S. 58,Register of Directors,Section 58,S 58",
  S46 = "S. 46,Notification of Change Registered Address, S 46,Section 46",
  S51 = "S. 51,Register of Member, S 51,Section 51",
  AnnualReturn = "Annual Return,Section 68,S 68",
  BankAccountResolution = "Bank Account",
  PD2 = "Notification of change in the Business Address and / or Nature of Business",
  ChangeOfName = "Change of Business Name, Change of Name, Change Co Name, Change Business Name",
  ChangeOfAddress = "Change of Business Address, Change of Address",
  ChangeOfRegisteredAddress = "Change of Registered Address, Change in the Registered Address, Change of Reg Address, Change Reg Address",
  ChangeOfBranch = "Change of Business Branch, Change of Branch, Change Business Branch",
  ChangeOfDescription = "Change of Nature of Business, Change of Business Nature, Change of Nature, Change of Business Description, Change of Description",
  AppointDirector = "Section 58 - Add New Director, Section 58 - Appoint New Director",
  AppointDirectorDcr = "DCR - Appointment of Director,DCR - Appointment of New Director",
  ResignationOfDirector = "Section 58 - Resignation of Director",
  ResignationOfDirectorDcr = "Letter - Resignation of Director",
  OpenBankAccount = "DCR Open, DCR re Open", // usually followed bank name,
  AllotmentOfShares = "Allotment of Shares, Purchase Shares, PRN, Preemptive Rights",
  TransferOfShares = "Transfer, Share Transfer",
  Constitution = "Constitution",
  SetFye = "Financial Year End",
  AppointNewDirector = "Section 58 - Appoint New Director, Section 58 - Appointment of New Director",
}
