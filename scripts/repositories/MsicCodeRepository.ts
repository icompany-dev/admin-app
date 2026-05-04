import type { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { MsicCode } from "../models/MsicCode"
import { Repository } from "./Repository"

export class MsicCodeRepository extends Repository<MsicCode> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, MsicCode)
  }

  override async fetchAll<MsicCode>(filter: Filter): Promise<ApiRecord<MsicCode>> {
    try {
      const response = this.get<ApiRecord<MsicCode>>(`${this.singleResourceUrl}/all?${filter.getSlug()}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async nameSearch(name: string): Promise<any> {
    try {
      const data = {
        name,
      }
      const response = this.post(this.singleResourceUrl, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async searchByKeyword(keyword: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/recommend/keyword?search_text=${keyword}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
