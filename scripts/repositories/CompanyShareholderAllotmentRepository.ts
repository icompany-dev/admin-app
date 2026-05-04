import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { CompanyShareholderAllotment } from "../models/CompanyShareholderAllotment"
import { Repository } from "./Repository"

export class CompanyShareholderAllotmentRepository extends Repository<CompanyShareholderAllotment> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyShareholderAllotment)
  }

  override async fetchAll<CompanyShareholderAllotment>(
    filter: Filter
  ): Promise<ApiRecord<CompanyShareholderAllotment>> {
    try {
      const slug = filter.getSlug()
      const rawResponse: any = await this.get(`${this.singleResourceUrl}/all${slug ? "?" + slug : ""}`)
      const apiRecord = new ApiRecord<CompanyShareholderAllotment>(rawResponse, this.itemClassType as any)
      return apiRecord
    } catch (error) {
      throw error
    }
  }
}
