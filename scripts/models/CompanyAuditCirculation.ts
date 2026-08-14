import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { CompanyAuditCycle } from "./CompanyAuditCycle"
import { CompanyFinancialPeriod } from "./CompanyFinancialPeriod"
import type { IModelApplication } from "./IModelApplication"
import { User } from "./User"

export class CompanyAuditCirculation
  extends Application
  implements IModelApplication<CompanyAuditCirculation, ReturnType<typeof useCompanyAuditCirculationStore>>
{
  financialPeriodId: string = ""
  financialPeriod: CompanyFinancialPeriod = new CompanyFinancialPeriod()

  financialYearEndDate: string | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyAuditCirculation) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.financialPeriodId = data.financial_period_id
    this.financialPeriod = new CompanyFinancialPeriod(data.financial_period)

    this.financialYearEndDate = this.financialPeriod.endDate
  }

  cloneDetails(data: CompanyAuditCirculation): void {
    super.clone(data)
    this.financialPeriodId = data.financialPeriodId
    this.financialPeriod = new CompanyFinancialPeriod(data.financialPeriod)

    this.financialYearEndDate = this.financialPeriod.endDate
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      financial_period_id: this.financialPeriodId,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.financialPeriodId)
  }

  async create(repository: ReturnType<typeof useCompanyAuditCirculationStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyAuditCirculationStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyAuditCirculationStore>): Promise<void> {
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
