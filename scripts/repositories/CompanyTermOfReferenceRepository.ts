import { CompanyTermOfReference } from "../models/CompanyTermOfReference"
import { Repository } from "./Repository"

export class CompanyTermOfReferenceRepository extends Repository<CompanyTermOfReference> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyTermOfReference)
  }

  hasExistingTor(companyId: string): Promise<any> {
    try {
      let response = this.get<any>(`${this.singleResourceUrl}/has-existing/${companyId}`)
      return response
    } catch (e) {
      throw e
    }
  }
}
