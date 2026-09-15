import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { Director } from "../models/Director"
import { Repository } from "./Repository"

export class DirectorRepository extends Repository<Director> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Director)
  }

  override async fetchAll<Director>(filter: Filter): Promise<ApiRecord<Director>> {
    try {
      const rawResponse = await this.get<Director>(`${this.singleResourceUrl}/all?${filter.getSlug()}`)
      const apiRecord = new ApiRecord<Director>(rawResponse, this.itemClassType as any)
      return apiRecord
    } catch (error) {
      throw error
    }
  }

  async fetchForUserByCompanyId(companyId: string): Promise<Director> {
    try {
      const response = this.get<Director>(`/api/user/director/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchAllForCompany(companyId: string): Promise<Director[]> {
    try {
      const response = this.get<Director[]>(`/api/company/directors/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async isDirectorForCompany(companyId: string): Promise<any> {
    try {
      const response = this.get<any>(`${this.singleResourceUrl}/check/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
