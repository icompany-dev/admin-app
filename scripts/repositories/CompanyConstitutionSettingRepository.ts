import { CompanyConstitutionSetting } from "../models/CompanyConstitutionSetting"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingRepository extends Repository<CompanyConstitutionSetting> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSetting)
  }

  async adopt(id: string): Promise<any> {
    try {
      let response = this.post(`${this.singleResourceUrl}/adopt/${id}`, {})
      return response
    } catch (e) {
      throw e
    }
  }

  async amend(id: string): Promise<any> {
    try {
      let response = this.post(`${this.singleResourceUrl}/amend/${id}`, {})
      return response
    } catch (e) {
      throw e
    }
  }

  async abolish(companyId: string): Promise<any> {
    try {
      let response = this.post(`${this.singleResourceUrl}/abolish/${companyId}`, {})
      return response
    } catch (e) {
      throw e
    }
  }
}
