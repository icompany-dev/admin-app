import { CompanyManagementAccount } from "../models/CompanyManagementAccount"
import { Repository } from "./Repository"

export class CompanyManagementAccountRepository extends Repository<CompanyManagementAccount> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyManagementAccount)
  }

  async fetchStartDate(companyId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/start-date?company_id=${companyId}`)
      return response
    } catch (e) {
      throw e
    }
  }
}
