export enum AlloteeType {
  New = "new",
  Existing = "existing",
}

export enum ConsiderationPerShareType {
  Cash = "cash",
  NonCash = "non-cash",
}

export enum ConsiderationType {
  FullyPaid = "fully-paid",
  PartiallyPaid = "partially-paid",
  Unpaid = "unpaid",
}

export enum PurposeOfAllotment {
  WorkingCapital = "working-capital",
  OperationalFunding = "operational-funding",
  BusinessExpansion = "business-expansion",
  InvestmentPurposes = "investment-purposes",
  Restructuring = "restructuring",
  SettlementOfObligations = "settlement-of-obligations",
  OtherCommercialPurposes = "other-commercial-purposes",
}

export enum AllotmentInCaseOfUnsubscribe {
  None = "none",
  PendingBoardAction = "pending-board-action",
  AmendResolution = "amend-resolution",
}

export enum AuthorizationEffectiveType {
  EndOfFye = "end-of-fye",
  Revoked = "revoked",
  SpecificDate = "specific-date",
  OneAllotmentOnly = "one-allotment-only",
}

export enum FundDeclarationConsiderationType {
  Cash = "cash",
  NonCash = "non-cash",
  Mixed = "mixed",
}

export enum FundDeclarationSource {
  EmploymentIncome = "employment-income",
  BusinessIncome = "business-income",
  Savings = "savings",
  InvestmentReturns = "investment-returns",
  SaleOfAssets = "sale-of-assets",
  Inheritance = "inheritance",
  Gift = "gift",
  LoanOrFinancing = "loan-or-financing",
  CapitalContributionFromParentCompany = "capital-contribution-from-parent-company",
  IntellectualProperty = "intellectual-property",
  SoftwareTechnologyDigitalAssets = "software-technology-digital-assets",
  Other = "other",
}
