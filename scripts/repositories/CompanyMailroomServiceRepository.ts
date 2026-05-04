import { CompanyMailroomService } from "../models/CompanyMailroomService"
import { Repository } from "./Repository"

export class CompanyMailroomServiceRepository extends Repository<CompanyMailroomService> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyMailroomService)
  }

  async hasUnclaimedMails (companyId: string): Promise<any> {
    try {
      const slug = `?company_id=${companyId}`
      const response = await this.get<any>(`${this.singleResourceUrl}/has-unclaimed-mails${slug}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
