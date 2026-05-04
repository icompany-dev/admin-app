export class CompanyTorDutiesAndResponsibility {
  id: string = ""
  companyTermsOfReferenceId: string = ""
  isOverallCorporateGovernance: boolean = false
  isOversightOfAffairs: boolean = false
  isEnsureProperStatutoryRecords: boolean = false
  isMonitorCompliance: boolean = false
  isEnsureDecisionsMinutedAndDocumented: boolean = false
  isApproveBusinessStrategy: boolean = false
  isApproveAnnualBudgets: boolean = false
  isApproveMajorOperationalInitiatives: boolean = false
  isMonitorPerformance: boolean = false
  isApproveFinancialStatements: boolean = false
  isDetermineAuditedOrUnauditred: boolean = false
  isDeclareOrRecommendDividends: boolean = false
  isApproveFinancing: boolean = false
  isApproveCapitalExpenditure: boolean = false
  isIdentifyBusinessRisks: boolean = false
  isEnsureInternalControlsInPlace: boolean = false
  isOverseeSolvency: boolean = false
  isEnsureCompliance: boolean = false
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyTorDutiesAndResponsibility) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.tor_id
    this.isOverallCorporateGovernance = data.is_overall_corporate_governance
    this.isOversightOfAffairs = data.is_oversight_of_affairs
    this.isEnsureProperStatutoryRecords = data.is_ensure_proper_statutory_records
    this.isMonitorCompliance = data.is_monitor_compliance
    this.isEnsureDecisionsMinutedAndDocumented = data.is_ensure_decisions_minuted_and_documented
    this.isApproveBusinessStrategy = data.is_approve_business_strategy
    this.isApproveAnnualBudgets = data.is_approve_annual_budgets
    this.isApproveMajorOperationalInitiatives = data.is_approve_major_operational_initiatives
    this.isMonitorPerformance = data.is_monitor_performance
    this.isApproveFinancialStatements = data.is_approve_financial_statements
    this.isDetermineAuditedOrUnauditred = data.is_determine_audited_or_unauditred
    this.isDeclareOrRecommendDividends = data.is_declare_or_recommend_dividends
    this.isApproveFinancing = data.is_approve_financing
    this.isApproveCapitalExpenditure = data.is_approve_capital_expenditure
    this.isIdentifyBusinessRisks = data.is_identify_business_risks
    this.isEnsureInternalControlsInPlace = data.is_ensure_internal_controls_in_place
    this.isOverseeSolvency = data.is_oversee_solvency
    this.isEnsureCompliance = data.is_ensure_compliance
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: CompanyTorDutiesAndResponsibility): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.companyTermsOfReferenceId
    this.isOverallCorporateGovernance = data.isOverallCorporateGovernance
    this.isOversightOfAffairs = data.isOversightOfAffairs
    this.isEnsureProperStatutoryRecords = data.isEnsureProperStatutoryRecords
    this.isMonitorCompliance = data.isMonitorCompliance
    this.isEnsureDecisionsMinutedAndDocumented = data.isEnsureDecisionsMinutedAndDocumented
    this.isApproveBusinessStrategy = data.isApproveBusinessStrategy
    this.isApproveAnnualBudgets = data.isApproveAnnualBudgets
    this.isApproveMajorOperationalInitiatives = data.isApproveMajorOperationalInitiatives
    this.isMonitorPerformance = data.isMonitorPerformance
    this.isApproveFinancialStatements = data.isApproveFinancialStatements
    this.isDetermineAuditedOrUnauditred = data.isDetermineAuditedOrUnauditred
    this.isDeclareOrRecommendDividends = data.isDeclareOrRecommendDividends
    this.isApproveFinancing = data.isApproveFinancing
    this.isApproveCapitalExpenditure = data.isApproveCapitalExpenditure
    this.isIdentifyBusinessRisks = data.isIdentifyBusinessRisks
    this.isEnsureInternalControlsInPlace = data.isEnsureInternalControlsInPlace
    this.isOverseeSolvency = data.isOverseeSolvency
    this.isEnsureCompliance = data.isEnsureCompliance
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      tor_id: this.companyTermsOfReferenceId,
      is_overall_corporate_governance: this.isOverallCorporateGovernance,
      is_oversight_of_affairs: this.isOversightOfAffairs,
      is_ensure_proper_statutory_records: this.isEnsureProperStatutoryRecords,
      is_monitor_compliance: this.isMonitorCompliance,
      is_ensure_decisions_minuted_and_documented: this.isEnsureDecisionsMinutedAndDocumented,
      is_approve_business_strategy: this.isApproveBusinessStrategy,
      is_approve_annual_budgets: this.isApproveAnnualBudgets,
      is_approve_major_operational_initiatives: this.isApproveMajorOperationalInitiatives,
      is_monitor_performance: this.isMonitorPerformance,
      is_approve_financial_statements: this.isApproveFinancialStatements,
      is_determine_audited_or_unauditred: this.isDetermineAuditedOrUnauditred,
      is_declare_or_recommend_dividends: this.isDeclareOrRecommendDividends,
      is_approve_financing: this.isApproveFinancing,
      is_approve_capital_expenditure: this.isApproveCapitalExpenditure,
      is_identify_business_risks: this.isIdentifyBusinessRisks,
      is_ensure_internal_controls_in_place: this.isEnsureInternalControlsInPlace,
      is_oversee_solvency: this.isOverseeSolvency,
      is_ensure_compliance: this.isEnsureCompliance,
    }
  }
}
