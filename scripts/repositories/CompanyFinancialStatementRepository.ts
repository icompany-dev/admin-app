import { CompanyFinancialStatement } from "../models/CompanyFinancialStatement"
import { Repository } from "./Repository"

export class CompanyFinancialStatementRepository extends Repository<CompanyFinancialStatement> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyFinancialStatement)
  }

  async byFinancialPeriodId(financialPeriodId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/by-financial-period/${financialPeriodId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
