import { CompanyFinancialPeriod } from "../models/CompanyFinancialPeriod"
import { Repository } from "./Repository"

export class CompanyFinancialPeriodRepository extends Repository<CompanyFinancialPeriod> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyFinancialPeriod)
  }

  async current(companyId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/current/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async byDates(companyId: string, startDate: string, endDate: string): Promise<any> {
    try {
      const response = this.get(
        `${this.singleResourceUrl}/current/${companyId}?start_date=${startDate}&end_date=${endDate}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async hasSetFinancialYearEnd(companyId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/has-set/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
