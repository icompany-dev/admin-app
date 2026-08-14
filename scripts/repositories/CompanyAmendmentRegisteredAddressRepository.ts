import { CompanyAmendmentRegisteredAddress } from "../models/CompanyAmendmentRegisteredAddress"
import { Repository } from "./Repository"

export class CompanyAmendmentRegisteredAddressRepository extends Repository<CompanyAmendmentRegisteredAddress> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAmendmentRegisteredAddress)
  }

  async hasOngoing(companyId: string): Promise<object> {
    try {
      const response = this.get<object>(`${this.singleResourceUrl}/has-ongoing/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
