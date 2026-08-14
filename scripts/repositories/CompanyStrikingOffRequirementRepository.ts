import { CompanyStrikingOffRequirement } from "../models/CompanyStrikingOffRequirement"
import { Repository } from "./Repository"

export class CompanyStrikingOffRequirementRepository extends Repository<CompanyStrikingOffRequirement> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyStrikingOffRequirement)
  }

  override ongoing(companyId: string): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/ongoing?company_id=${companyId}`)
      return response
    } catch (e) {
      throw e
    }
  }
}
