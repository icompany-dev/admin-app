import { CompanyAuditCirculation } from "../models/CompanyAuditCirculation"
import { Repository } from "./Repository"

export class CompanyAuditCirculationRepository extends Repository<CompanyAuditCirculation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAuditCirculation)
  }

  async byFinancialPeriod(companyId: string, financialPeriodId: string): Promise<any> {
    try {
      const response = this.get(
        `${this.singleResourceUrl}/by-financial-period/${companyId}?financial_period_id=${financialPeriodId}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async byAuditCycle(id: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/by-audit-cycle?audit_cycle_id=${id}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
