import { CompanyDirectorRemoval } from "../models/CompanyDirectorRemoval"
import { Repository } from "./Repository"

export class CompanyDirectorRemovalRepository extends Repository<CompanyDirectorRemoval> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyDirectorRemoval)
  }

  async sendOutNotice(id: string, cosecName: string, cosecLicense: string): Promise<any> {
    try {
      let data = {
        cosec_name: cosecName,
        cosec_licenses: cosecLicense,
      }

      let response = this.post(`${this.singleResourceUrl}/send-notice/${id}`, data)
      return response
    } catch (e) {
      throw e
    }
  }
}
