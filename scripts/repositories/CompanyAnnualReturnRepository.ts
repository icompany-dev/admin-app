import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { CompanyAnnualReturn } from "../models/CompanyAnnualReturn"
import { Repository } from "./Repository"

export class CompanyAnnualReturnRepository extends Repository<CompanyAnnualReturn> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAnnualReturn)
  }

  override async fetchAll<CompanyAnnualReturn>(filter: Filter): Promise<ApiRecord<CompanyAnnualReturn>> {
    try {
      const slug = filter.getSlug()
      const response = await this.get<ApiRecord<CompanyAnnualReturn>>(
        `${this.singleResourceUrl}/all${slug ? "?" + slug : ""}`
      )
      let record = new ApiRecord<CompanyAnnualReturn>(response, this.itemClassType as any)
      return record
    } catch (error) {
      throw error
    }
  }

  async fetchDues(companyId: string): Promise<any> {
    try {
      const response = await this.get<any>(`${this.singleResourceUrl}/dues/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
