export enum PreferenceSharePaymentTermType {
  LumpSum = "lump-sum",
  MilestoneBasis = "milestone-basis",
  ScheduleTranches = "schedule-tranches",
}

export enum PreferenceShareType {
  RPS = "RPS",
  RCPS = "RCPS",
  ICPS = "ICPS",
  CPS = "CPS",
  NonCumulative = "Non-cumulative",
  Others = "Others",
}

export enum PreferenceSharePriorityInPayment {
  SeniorToJunior = "payment-priority-senior-to-junior",
  JuniorToSenior = "payment-priority-junior-to-senior",
  AmongPariPassu = "payment-priority-among-pari-passu",
  PreferentialRateApplies = "payment-priority-preferential-rate",
  MustPaidInFull = "payment-priority-must-paid-full",
}

export enum PreferenceSharePreEmptiveRights {
  PerSection85 = "prn-per-section-85",
  WaivedWithinSameClass = "prn-waived-within-same-class",
  ApplyToSameClass = "prn-apply-within-same-class",
  Others = "prn-others",
}

export enum PreferenceShareConfidentialityType {
  Mutual = "mutual",
  InvestorOnly = "investor-only",
  CompanyOnly = "company-only",
}

export enum PreferenceShareExpenseBearerType {
  EachPartyBearsOwn = "each-party-bears-own",
  CompanyBearsAll = "company-bears-all",
  InvestorBearsAll = "investor-bears-all",
  SharedEqually = "shared-equally",
}

export enum PreferenceShareDividendCycle {
  Quarterly = "quarterly",
  HalfYearly = "half-yearly",
  Yearly = "yearly",
}

export enum PreferenceShareCumulativeCapType {
  TimeLimit = "time-limit",
  TriggerEvent = "trigger-event",
  AmountCap = "amount-cap",
  Indefinite = "indefinite",
}

export enum PreferenceShareNonCumulativeTerm {
  Fixed = "non-cumulative-term-fixed",
  Variable = "non-cumulative-term-variable",
}

export enum PreferenceShareDividendPaymentMethod {
  CashPayable = "cash-payable",
  ConvertibleAccrual = "convertible-accrual",
}

export enum PreferenceShareDividentAccrualTerms {
  ConvertibleToOrdinaryPreference = "convert-to-ordinary-preference",
  ConvertTriggerEvent = "convert-trigger-event",
  TotalAccruedCap = "total-accrued-cap",
  TotalAccrualLimitTime = "total-accrual-time-limit",
}

export enum PreferenceShareConversionOption {
  Holders = "conversion-option-holders",
  Automatic = "conversion-option-automatic",
  Company = "conversion-option-company",
}

export enum PreferenceShareConversionPeriod {
  OneYear = "conversion-period-one-year",
  TwoYears = "conversion-period-two-years",
  Others = "conversion-period-others",
}

export enum PreferenceShareAntiDilutionMethod {
  FullRatchet = "full-ratchet",
  BroadWeightedAverage = "broad-weighted-average",
  NarrowWeightedAverage = "narrow-weighted-average",
}

export enum PreferenceShareAntiDilutionExemption {
  Esos = "anti-dilution-exemption-esos",
  Bonus = "anti-dilution-exemption-bonus",
  MAIssues = "anti-dilution-exemption-ma-issued",
  Partnership = "anti-dilution-exemption-partnership",
  Section75Mandate = "anti-dilution-exemption-section-75-mandate",
  Conversion = "anti-dilution-exemption-conversion",
  Others = "anti-dilution-exemption-others",
}

export enum PreferenceShareRedemptionTriggerType {
  CompanyOption = "company-option",
  HolderOption = "holder-option",
  Maturity = "maturity",
}

export enum PreferenceShareRedemptionPriceMethod {
  IssuePrice = "issue-price",
  Premium = "premium",
  Formula = "formula",
}

export enum PreferenceShareLiquidationPreferenceType {
  OneXNonParticipating = "1x-non-participating",
  OneXParticipating = "1x-participating",
  TwoXParticipating = "2x-participating",
  Other = "other",
}

export enum PreferenceShareTransferabilityStatus {
  FreelyTransferable = "freely-transferable",
  BoardApproval = "board-approval",
  PreEmptiveRights = "pre-emptive-rights",
}

export enum PreferenceShareDisputeMediationAdministrator {
  AIAC = "dispute-adminitrator-aiac",
  MMC = "dispute-adminitrator-mmc",
  Other = "dispute-adminitrator-other",
}

export enum PreferenceShareDisputeResolutionMethod {
  ArbitrationAiac = "arbitration-aiac",
  CourtMalaysia = "court-malaysia",
  ExpertDetermination = "expert-determination",
  HyBridMechanism = "hybrid-mechanism",
}

export enum PreferenceShareChecklistCategory {
  ConditionPrecedent = "condition-precedent",
  ConditionSubsequent = "condition-subsequent",
  EventOfDefault = "event-of-default",
}

export enum PreferenceShareCommonConditionPrecedent {
  BoardResolutionForApproval = "common-board-resolution-for-approval",
  ShareholdersApprovalUnderSection76 = "common-shareholders-approval-under-section76",
  PreEmptiveRightsWaiverOrApproval = "common-pre-emptive-rights-waiver-or-approval",
  ApprovalUnderSection90 = "common-approval-under-section90",
  AdoptionOrAmendmentOfTheConstitution = "common-adoption-or-amendment-of-the-constitution",
  CompletionOfLegalDueDiligence = "common-completion-of-legal-due-diligence",
  CompletionOfFinancialDueDiligence = "common-completion-of-financial-due-diligence",
  ExecutionOfTheSubscriptionAgreement = "common-execution-of-the-subscription-agreement",
  ExecutionOfTheShareholdersAgreement = "common-execution-of-the-shareholders-agreement",
  ExecutionOfTheAmendedConstitution = "common-execution-of-the-amended-constitution",
  DeliveryOfDisclosureLetter = "common-delivery-of-disclosure-letter",
  FilingOfAmendedConstitutionWithSSM = "common-filing-of-amended-constitution-with-ssm",
  IndustrySpecificApprovals = "common-industry-specific-approvals",
  ComplianceWithAllApplicableLawsAndLicences = "common-compliance-with-all-applicable-laws-and-licences",
  WarrantiesRemainTrueAndAccurateAtCompletion = "common-warranties-remain-true-and-accurate-at-completion",
  NoMaterialUndisclosedLiabilities = "common-no-material-undisclosed-liabilities",
  NoLitigationOrInvestigationPending = "common-no-litigation-or-investigation-pending",
  NoMACBetweenSigningAndCompletion = "common-no-mac-between-signing-and-completion",
}

export enum PreferenceShareCompletion {
  InvestorPayment = "completion-investor-payment",
  AllotmentOfPreferenceShares = "completion-allotment-of-preference-shares",
  AllotmentConfirmation = "completion-allotment-confirmation",
  LodgementWithSSMSection78 = "completion-lodgement-with-ssm-section78",
  UpdatedCapTable = "completion-updated-cap-table",
  ExecutedFinalDocuments = "completion-executed-final-documents",
}

export enum PreferenceShareCompletionOverdueAction {
  Terminate = "terminate",
  Extend = "extend",
}

export enum PreferenceShareConditionSubsequent {
  LodgementOfReturnOfAllotment = "subsequent-lodgement-of-return-of-allotment",
  FilingOfAmendedConstitutionWithSSM = "subsequent-filing-of-amended-constitution-with-ssm",
  UpdatingOfTheRegisterOfMembers = "subsequent-updating-of-the-register-of-members",
  PostCompletionOthers = "subsequent-post-completion-others",
  AppointmentOfInvestorNominatedDirector = "subsequent-appointment-of-investor-nominated-director",
  BoardObserverConfirmationLetter = "subsequent-board-observer-confirmation-letter",
  AdoptionOfReservedMatters = "subsequent-adoption-of-reserved-matters",
  ImplementationOfUpdatedSigningMandates = "subsequent-implementation-of-updated-signing-mandates",
  AssignmentOfAllIPToTheCompany = "subsequent-assignment-of-all-ip-to-the-company",
  RegistrationOfIPWithMyIPO = "subsequent-registration-of-ip-with-my-ipo",
  ExecutionOfSAOrNCA = "subsequent-execution-of-sa-or-nca",
  CompletionOfOperationalRestructuring = "subsequent-completion-of-operational-restructuring",
  DeliveryOfUpdatedManagementAccounts = "subsequent-delivery-of-updated-management-accounts",
  DeliveryOfAFSForFY = "subsequent-delivery-of-afs-for-fy",
  ImplementationOfAgreedFinancialCovenants = "subsequent-implementation-of-agreed-financial-covenants",
  ProcurementOfDOInsurance = "subsequent-procurement-of-do-insurance",
  ProcurementOfKeyManInsurance = "subsequent-procurement-of-key-man-insurance",
  OtherInsuranceRequirements = "subsequent-other-insurance-requirements",
  DefaultAndRequireRemedyWithinDays = "subsequent-default-and-require-remedy-within-days",
  SuspendCertainPreferenceShareRights = "subsequent-suspend-certain-preference-share-rights",
  UnwindTheTransactionOrTriggerRedemption = "subsequent-unwind-the-transaction-or-trigger-redemption",
  OtherRemedy = "subsequent-other-remedy",
}

export enum PreferenceShareEventDefault {
  FailureToPayCumulativeDividends = "event-default-failure-to-pay-cumulative-dividends",
  CumulativeDividendArrearsExceed = "event-default-cumulative-dividend-arrears-exceed",
  BreachOfDividendPriority = "event-default-breach-of-dividend-priority",
  NonPaymentOfRedemptionAmount = "event-default-non-payment-of-redemption-amount",
  FailureToDeclareDividends = "event-default-failure-to-declare-dividends",
  IssuingNewSharesBreachedPRN = "event-default-issuing-new-shares-breached-prn",
  IssuingSharesBelowTheAntiDilutionFloor = "event-default-issuing-shares-below-the-anti-dilution-floor",
  VariationClassRightsOfPreferenceSharesWithoutConsent = "event-default-variation-class-rights-of-preference-shares-without-consent",
  AllotSharesNoProperAuthority = "event-default-allot-shares-no-proper-authority",
  IssuingSharesWithoutConsideration = "event-default-issuing-shares-without-consideration",
  FailureToHonourConversion = "event-default-failure-to-honour-conversion",
  FailureToDeliverOrdinaryShares = "event-default-failure-to-deliver-ordinary-shares",
  FailureToRedeemPreferenceShares = "event-default-failure-to-redeem-preference-shares",
  ImproperOrUnlawfulRedemption = "event-default-improper-or-unlawful-redemption",
  FailureToDeliverFinancialStatements = "event-default-failure-to-deliver-financial-statements",
  FailureToProvideAgreedInformation = "event-default-failure-to-provide-agreed-information",
  FailureToAppointInvestorDirector = "event-default-failure-to-appoint-investor-director",
  BreachOfReservedMattersOrVetoRights = "event-default-breach-of-reserved-matters-or-veto-rights",
  MaterialAdverseChange = "event-default-material-adverse-change",
  MisconductByTheCompanyOrPromoters = "event-default-misconduct-by-the-company-or-promoters.",
  BreachOfWarranties = "event-default-breach-of-warranties",
  MisappropriationCompanyAssets = "event-default-misappropriation-company-assets",
  RevocationOfKeyLicences = "event-default-revocation-of-key-licences",
  BreachOfTheCompaniesAct2016 = "event-default-breach-of-the-companies-act2016",
  BreachOfConstitutionAgreements = "event-default-breach-of-constitution-agreements",
  CompanyBecomesInsolvent = "event-default-company-becomes-insolvent",
  WindingUp = "event-default-winding-up",
}

export enum PreferenceShareConsequenceOfDefault {
  DemandImmediateRedemption = "consequence-demand-immediate-redemption",
  ConvertPreferenceSharesWithPenalty = "consequence-convert-preference-shares-with-penalty",
  GainAdditionalVotingRights = "consequence-gain-additional-voting-rights",
  AppointAdditionalDirectors = "consequence-appoint-additional-directors",
  RequireCompanyCeaseTransactions = "consequence-require-company-cease-transactions",
  TriggerDragAlongRight = "consequence-trigger-drag-along-right",
  SeekInjunctiveRelief = "consequence-seek-injunctive-relief",
  TerminateTheInvestment = "consequence-terminate-the-investment",
}

export enum PreferenceShareDividendRightConsequence {
  DemandImmediateRedemption = "dividend-consequence-demand-immediate-redemption",
  ConvertPenaltyConversionPrice = "dividend-consequence-convert-penalty-conversion-price",
  GainsEnhancedVotingRights = "dividend-consequence-gains-enhanced-voting-rights",
  AppointAdditionalDirectors = "dividend-consequence-appoint-additional-directors",
  TriggerVetoOnReservedMatters = "dividend-consequence-trigger-veto-on-reserved-matters",
  RequireSaleOrDragAlong = "dividend-consequence-require-sale-or-drag-along",
  SeekRemediesForBreachRights = "dividend-consequence-seek-remedies-for-breach-rights",
  SeekInjunctiveRelief = "dividend-consequence-seek-injunctive-relief",
}

export enum PreferenceShareInformationRightsGranted {
  AnnualAFS = "annual-afs",
  QuarterlyMA = "quarterly-ma",
  AccessBoardMeetings = "access-board-meetings",
  InspectCompanyRecords = "inspect-company-records",
  BusinessKPIsUpdates = "business-kp-is-updates",
}

export enum PreferenceShareVotingRights {
  NoVotingRights = "voting-right-no-voting-rights",
  OneVotePerShare = "voting-right-one-vote-per-share",
  VotesAffectingRights = "voting-right-votes-affecting-rights",
  HasVetos = "voting-right-has-vetos",
}

export enum PreferenceShareVetoMatters {
  ChangeOfConstitution = "veto-matters-change-of-constitution",
  IssueOfNewShares = "veto-matters-issue-of-new-shares",
  AlterationOfClassRights = "veto-matters-alteration-of-class-rights",
  MajorAcquisitionsDisposals = "veto-matters-major-acquisitions-disposals",
  AppointmentRemovalOfDirectors = "veto-matters-appointment-removal-of-directors",
  Liquidation = "veto-matters-liquidation",
  Others = "veto-matters-others",
}

export enum PreferenceSharePermittedTransfer {
  ToHoldingAffiliateCompanies = "permitted-transfer-to_holding_affiliate_companies",
  ToFamilyMembers = "permitted-transfer-to_family_members",
  ToTrustsForSuccession = "permitted-transfer-to_trusts_for_succession",
  WithPriorBoardApproval = "permitted-transfer-with_prior_board_approval",
  Other = "permitted-transfer-other",
}
