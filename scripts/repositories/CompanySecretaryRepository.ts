import { CompanySecretary } from "../models/CompanySecretary"
import { Repository } from "./Repository"

export class CompanySecretaryRepository extends Repository<CompanySecretary> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanySecretary)
  }

  async assignCompaniesTo(id: string, companyIds: string): Promise<any> {
    try {
      let data = {
        company_ids: companyIds,
      }

      let response = this.post(`/api/master/assign-to-secretary/${id}`, data)

      return response
    } catch (e) {
      throw e
    }
  }
}
