import { Filter } from "../library/Filter"
import { CompanyAmendmentName } from "../models/CompanyAmendmentName"
import { Repository } from "./Repository"

export class CompanyAmendmentNameRepository extends Repository<CompanyAmendmentName> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAmendmentName)
  }

  override async ongoing<CompanyAmendmentName>(companyId: string): Promise<CompanyAmendmentName> {
    try {
      let filter = new Filter()
      filter.companyId = companyId
      filter.take = 1
      filter.statuses = ["paid", "approved", "submitted"]
      filter.orderBy = "created_at"
      filter.sortOrder = "desc"

      const response = await this.get<CompanyAmendmentName>(`${this.resourceUrl}?${filter.getSlug()}}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async hasOngoing(companyId: string): Promise<object> {
    try {
      const response = this.get<object>(`${this.singleResourceUrl}/has-ongoing/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
