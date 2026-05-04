import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { CompanyAuditCycle } from "../models/CompanyAuditCycle"
import { Repository } from "./Repository"

export class CompanyAuditCycleRepository extends Repository<CompanyAuditCycle> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAuditCycle)
  }

  async current(companyId: string): Promise<any> {
    try {
      const response = this.get(
        `${this.singleResourceUrl}/current?company_id=${companyId}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async markOngoing(id: string): Promise<any> {
    try {
      const response = this.post<any>(`${this.singleResourceUrl}/mark-ongoing/${id}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchByFinancialYearEnd(companyId: string, fyeDate: string): Promise<any> {
    try {
      const response = this.get(
        `${this.singleResourceUrl}/by-fye?company_id=${companyId}&financial_year_end_date=${fyeDate}`
      )
      return response
    } catch (error) {
      throw error
    }
  }
}
