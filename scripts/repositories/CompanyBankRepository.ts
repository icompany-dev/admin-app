import { CompanyBank } from "../models/CompanyBank"
import { Repository } from "./Repository"
import type { Filter } from "../library/Filter"
import { ApiRecord } from "../library/ApiRecord"

export class CompanyBankRepository extends Repository<CompanyBank> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyBank)
  }

  override async fetchAll<CompanyBank>(filter: Filter): Promise<ApiRecord<CompanyBank>> {
    try {
      const slug = filter.getSlug()
      const rawResponse: any = await this.get(`${this.singleResourceUrl}/all${slug ? "?" + slug : ""}`)
      const apiRecord = new ApiRecord<CompanyBank>(rawResponse, this.itemClassType as any)
      return apiRecord
    } catch (error) {
      throw error
    }
  }
}
