import { Repository } from "./Repository"
import { CompanyAuditExtensionOfTime } from "~/scripts/models/CompanyAuditExtensionOfTime"

export class CompanyAuditExtensionOfTimeRepository extends Repository<CompanyAuditExtensionOfTime> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAuditExtensionOfTime)
  }

  async fetchByCompany(companyId: string): Promise<any> {
    try {
      const response = await this.get<any>(`${this.singleResourceUrl}/for-company?company_id=${companyId}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async submit(id: string): Promise<any> {
    try {
      const data = {}
      const response = await this.post<any>(`${this.singleResourceUrl}/${id}/submit`, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  async pay(id: string, data: any): Promise<any> {
    try {
      const response = await this.post<any>(`${this.singleResourceUrl}/${id}/pay`, data)
      return response.data
    } catch (e) {
      throw e
    }
  }
}
