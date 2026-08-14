import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { File } from "./File"
import type { IModel } from "./IModel"

export class CompanyFinancialPeriod implements IModel<CompanyFinancialPeriod> {
  id: string = ""
  companyId: string = ""
  startDate: string = ""
  endDate: string = ""
  resolutionId: string | null = null
  statementPreparationMethod: string | null = null
  financialStatementId: string | null = null
  financialStatement: File | null = null
  isRecommendedAudited: boolean | null = null
  auditRecommendation: string | null = null
  isSubmittingAudited: boolean | null = null
  financialStatementStatus: string | null = null
  status: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyFinancialPeriod) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.company_id
    this.startDate = data.start_date
    this.endDate = data.end_date
    this.resolutionId = data.resolution_id
    this.statementPreparationMethod = data.statement_preparation_method
    this.financialStatementId = data.financial_statement_id
    this.financialStatement = data.financial_statement ? new File(data.financial_statement) : null
    this.isRecommendedAudited = data.is_recommended_audited
    this.auditRecommendation = data.audit_recommendation
    this.isSubmittingAudited = data.is_submitting_audited === 1 ? true : false
    this.financialStatementStatus = data.financial_statement_status
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: CompanyFinancialPeriod): void {
    this.id = data.id
    this.companyId = data.companyId
    this.startDate = data.startDate
    this.endDate = data.endDate
    this.resolutionId = data.resolutionId
    this.statementPreparationMethod = data.statementPreparationMethod
    this.financialStatementId = data.financialStatementId
    this.financialStatement = data.financialStatement ? new File(data.financialStatement) : null
    this.isRecommendedAudited = data.isRecommendedAudited
    this.auditRecommendation = data.auditRecommendation
    this.isSubmittingAudited = data.isSubmittingAudited
    this.financialStatementStatus = data.financialStatementStatus
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {}
  }

  getRequestBodyForStatementPreparation(): object {
    return {
      statement_preparation_method: this.statementPreparationMethod,
    }
  }

  canSubmitStatementPreparationMethod(): boolean {
    return !StringUtil.isNullOrEmpty(this.statementPreparationMethod) && !StringUtil.isNullOrEmpty(this.id)
  }

  async updateStatementPreparationMethod(repository: ReturnType<typeof useCompanyFinancialPeriodStore>): Promise<void> {
    if (!this.canSubmitStatementPreparationMethod()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBodyForStatementPreparation()
    let response = await repository.update(this.id, data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  getRequestBodyForFinancialStatement(): object {
    return {
      financial_statement_id: this.financialStatementId,
      financial_statement_status: this.financialStatementStatus,
    }
  }

  canSubmitFinancialStatement(): boolean {
    return !StringUtil.isNullOrEmpty(this.financialStatementId) && !StringUtil.isNullOrEmpty(this.id)
  }

  async updateFinancialStatement(repository: ReturnType<typeof useCompanyFinancialPeriodStore>): Promise<void> {
    if (!this.canSubmitFinancialStatement()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBodyForFinancialStatement()
    let response = await repository.update(this.id, data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  getRequestBodyForRecommendedSubmission(): object {
    return {
      is_recommended_audited: this.isRecommendedAudited,
      audit_recommendation: this.auditRecommendation,
    }
  }

  canSubmitRecommendedSubmission(): boolean {
    return this.isRecommendedAudited !== null && !StringUtil.isNullOrEmpty(this.id)
  }

  async updateRecommendedSubmission(repository: ReturnType<typeof useCompanyFinancialPeriodStore>): Promise<void> {
    if (!this.canSubmitRecommendedSubmission()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBodyForRecommendedSubmission()
    let response = await repository.update(this.id, data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  getRequestBodyForSubmission(): object {
    return {
      is_submitting_audited: this.isSubmittingAudited,
    }
  }

  canSubmitSubmission(): boolean {
    return this.isSubmittingAudited !== null && !StringUtil.isNullOrEmpty(this.id)
  }

  async updateSubmission(repository: ReturnType<typeof useCompanyFinancialPeriodStore>): Promise<void> {
    if (!this.canSubmitSubmission()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBodyForSubmission()
    let response = await repository.update(this.id, data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }
}
