import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { Shareholder } from "../models/Shareholder"
import { Repository } from "./Repository"

export class ShareholderRepository extends Repository<Shareholder> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Shareholder)
  }

  override async fetchAll<Shareholder>(filter: Filter): Promise<ApiRecord<Shareholder>> {
    try {
      const rawResponse = await this.get<Shareholder>(`${this.singleResourceUrl}/all?${filter.getSlug()}`)
      const apiRecord = new ApiRecord<Shareholder>(rawResponse, this.itemClassType as any)
      return apiRecord
    } catch (error) {
      throw error
    }
  }

  async fetchForUserByCompanyId(companyId: string): Promise<Shareholder> {
    try {
      const response = this.get<Shareholder>(`/api/user/shareholder/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchAllForCompany(companyId: string): Promise<Shareholder[]> {
    try {
      const response = this.get<Shareholder[]>(`/api/company/shareholders/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async isShareholderForCompany(companyId: string): Promise<any> {
    try {
      const response = this.get<any>(`${this.singleResourceUrl}/check/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
