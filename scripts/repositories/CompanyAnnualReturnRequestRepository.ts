import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { CompanyAnnualReturnRequest } from "../models/CompanyAnnualReturnRequest"
import { Repository } from "./Repository"

export class CompanyAnnualReturnRequestRepository extends Repository<CompanyAnnualReturnRequest> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAnnualReturnRequest)
  }

  override async fetchAll<CompanyAnnualReturnRequest>(filter: Filter): Promise<ApiRecord<CompanyAnnualReturnRequest>> {
    try {
      const slug = filter.getSlug()
      const response = await this.get<ApiRecord<CompanyAnnualReturnRequest>>(
        `api/company/annual-return-requests/all${slug ? "?" + slug : ""}`
      )
      let record = new ApiRecord<CompanyAnnualReturnRequest>(response, this.itemClassType as any)
      return record
    } catch (error) {
      throw error
    }
  }
}
