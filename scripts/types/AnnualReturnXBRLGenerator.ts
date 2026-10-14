export type FilingType = "FINANCIAL_STATEMENT" | "ANNUAL_RETURN"

export type AccountingStandard = "MPERS" | "MFRS"

export interface CompanyInfo {
  companyName: string
  companyNumber: string // 12-digit format e.g. 202101012345 (1412345-X)
  oldCompanyNumber?: string
  entityType: string // e.g. Private Company Limited by Shares (Sdn. Bhd.)
  accountingStandard: AccountingStandard
  financialYearStart: string // YYYY-MM-DD
  financialYearEnd: string // YYYY-MM-DD
  priorYearEnd: string // YYYY-MM-DD
  currency: string // Default 'MYR'
  levelOfRounding: "Exact" | "Thousands" | "Millions"
  principalActivities: string
  msicCode: string
  auditorName: string
  auditorOpinion: "Unmodified" | "Qualified" | "Adverse" | "Disclaimer"
  registeredOfficeAddress: string
  businessAddress?: string
}

export interface FSTaxonomyTag {
  id: string
  ssmTag: string
  standardLabel: string
  extractedLabel: string
  currentYearValue: number
  priorYearValue?: number
  classification?: string
  balanceType: "debit" | "credit" | "none"
  confidence: number // 0.0 to 1.0
  confirmed: boolean
  notes?: string
  isTotal?: boolean
  level?: number
  activityType?: string
}

export interface FSExtractionResult {
  companyInfo: CompanyInfo
  statementOfProfitOrLoss: FSTaxonomyTag[]
  statementOfFinancialPosition: FSTaxonomyTag[]
  statementOfCashFlows: FSTaxonomyTag[]
  summaryHighlights: {
    totalRevenueCY: number
    profitBeforeTaxCY: number
    profitForYearCY: number
    totalAssetsCY: number
    totalEquityCY: number
    totalLiabilitiesCY: number
    isBalanceSheetBalanced: boolean
    discrepancyAmount: number
    extractionNotes?: string
  }
}

// Annual Return Types
export interface ARDirector {
  id: string
  name: string
  idNumber: string // NRIC or Passport
  residentialAddress: string
  nationality: string
  designation: "Director" | "Managing Director" | "Executive Director" | "Alternate Director"
  appointmentDate: string
}

export interface ARSecretary {
  id: string
  name: string
  idNumber: string
  licenseNumber: string // e.g. MAICSA 7012345 / LS 0009876
  registeredAddress: string
  appointmentDate: string
}

export interface ARAuditor {
  firmName: string
  firmNumber: string // e.g. AF 001928
  firmAddress: string
  appointmentDate: string
}

export interface ARShareCapital {
  shareClass: "Ordinary" | "Preference" | "Redeemable Preference"
  numberOfShares: number
  amountPaidUp: number
  currency: string
}

export interface ARShareholder {
  id: string
  name: string
  idOrRegNumber: string
  address: string
  nationalityOrCountry: string
  shareClass: "Ordinary" | "Preference"
  numberOfShares: number
  percentage: number
}

export interface ARIndebtedness {
  hasCharges: boolean
  totalAmountSecured: number
  descriptionOfSecurities?: string
}

export interface ARMsicItem {
  id: string
  code: string
  description: string
  isPrimary?: boolean
}

export interface AnnualReturnData {
  companyName: string
  companyNumber: string
  oldCompanyNumber?: string
  companyType: "Private Limited (Sdn. Bhd.)" | "Public Limited (Berhad)" | "Exempt Private Company"
  registeredOfficeAddress: {
    addressLine1: string
    addressLine2: string
    postcode: string
    city: string
    state: string
  }
  businessAddress: {
    addressLine1: string
    addressLine2: string
    postcode: string
    city: string
    state: string
  }
  principalActivities: string
  msicCode: string
  msicCodes?: ARMsicItem[]
  annualReturnDate: string
  financialYearEndDate: string
  agmDate?: string
  isExemptPrivateCompany: boolean
  shareCapital: ARShareCapital[]
  directors: ARDirector[]
  secretaries: ARSecretary[]
  auditor: ARAuditor
  shareholders: ARShareholder[]
  indebtedness: ARIndebtedness
}

export interface GeneratedXBRLPackage {
  filename: string
  xbrlFilename: string
  zipBlob: Blob
  sizeBytes: number
  xbrlXml: string
  manifestXml: string
  calculationXml: string
  validationReport: {
    isValid: boolean
    errors: string[]
    warnings: string[]
    factCount: number
  }
}
