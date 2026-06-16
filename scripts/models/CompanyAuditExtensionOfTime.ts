import type { IModel } from "./IModel"
import { Company } from "./Company"
import { File } from "./File"
import { SignatureGroup } from "./SignatureGroup"
import { CompanyFinancialPeriod } from "./CompanyFinancialPeriod"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyAuditExtensionOfTime
  extends Application
  implements IModelApplication<CompanyAuditExtensionOfTime, ReturnType<typeof useCompanyAuditExtensionOfTimeStore>>
{
  financialYearEndDate: string = ""
  circulationDueDate: string = ""
  proposedExtensionOfTimePeriod: number = 90
  proposedExtensionOfTimeDueDate: string = ""
  proposedLodgmentPeriod: number = 30
  proposedLodgmentDueDate: string = ""
  auditCycleId: string | null = null
  auditCycle: any | null = null
  financialPeriodId: string | null = null
  financialPeriod: CompanyFinancialPeriod = new CompanyFinancialPeriod()
  reasons: string = "The Directors require more time to prepare and finalise the Financial Statements."
  initiator: any | null = null
  supportingDocumentId: string | null = null
  supportingDocument: File | null = null
  additionalDocumentId: string | null = null
  additionalDocument: File | null = null
  rejectReason: string | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyAuditExtensionOfTime) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.financialYearEndDate = data.financial_year_end_date ?? ""
    this.circulationDueDate = data.circulation_due_date ?? ""
    this.proposedExtensionOfTimePeriod = data.proposed_circulation_period ?? 90
    this.proposedExtensionOfTimeDueDate = data.proposed_circulation_due_date ?? ""
    this.proposedLodgmentPeriod = data.proposed_lodgment_period ?? 30
    this.proposedLodgmentDueDate = data.proposed_lodgment_due_date ?? ""
    this.auditCycleId = data.audit_cycle_id ?? null
    this.auditCycle = data.audit_cycle ?? null
    this.financialPeriodId = data.financial_period_id ?? null
    this.financialPeriod = new CompanyFinancialPeriod(data.financial_period)
    this.reasons = data.reasons ?? "The Directors require more time to prepare and finalise the Financial Statements."
    this.initiator = data.initiator ?? null
    this.supportingDocumentId = data.supporting_document_id ?? null
    this.supportingDocument = data.supporting_document ? new File(data.supporting_document) : null
    this.additionalDocumentId = data.additional_document_id ?? null
    this.additionalDocument = data.additional_document ? new File(data.additional_document) : null
    this.rejectReason = data.reject_reason ?? null
  }

  cloneDetails(data: CompanyAuditExtensionOfTime): void {
    super.clone(data)
    this.financialYearEndDate = data.financialYearEndDate
    this.circulationDueDate = data.circulationDueDate
    this.proposedExtensionOfTimePeriod = data.proposedExtensionOfTimePeriod
    this.proposedExtensionOfTimeDueDate = data.proposedExtensionOfTimeDueDate
    this.proposedLodgmentPeriod = data.proposedLodgmentPeriod
    this.proposedLodgmentDueDate = data.proposedLodgmentDueDate
    this.auditCycleId = data.auditCycleId
    this.auditCycle = data.auditCycle
    this.financialPeriodId = data.financialPeriodId
    this.financialPeriod = new CompanyFinancialPeriod(data.financialPeriod)
    this.reasons = data.reasons
    this.initiator = data.initiator
    this.supportingDocumentId = data.supportingDocumentId
    this.supportingDocument = data.supportingDocument ? new File(data.supportingDocument) : null
    this.additionalDocumentId = data.additionalDocumentId
    this.additionalDocument = data.additionalDocument ? new File(data.additionalDocument) : null
    this.rejectReason = data.rejectReason
  }

  getRequestBody(): any {
    return {
      company_id: this.companyId,
      financial_year_end_date: this.financialYearEndDate,
      circulation_due_date: this.circulationDueDate,
      proposed_circulation_period: this.proposedExtensionOfTimePeriod,
      proposed_circulation_due_date: this.proposedExtensionOfTimeDueDate,
      proposed_lodgment_period: this.proposedLodgmentPeriod,
      proposed_lodgment_due_date: this.proposedLodgmentDueDate,
      audit_cycle_id: this.auditCycleId,
      financial_period_id: this.financialPeriodId,
      reasons: this.reasons,
      supporting_document_id: this.supportingDocumentId,
      additional_document_id: this.additionalDocumentId,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.financialPeriodId)
  }

  async create(repository: ReturnType<typeof useCompanyAuditExtensionOfTimeStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyAuditExtensionOfTimeStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyAuditExtensionOfTimeStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
