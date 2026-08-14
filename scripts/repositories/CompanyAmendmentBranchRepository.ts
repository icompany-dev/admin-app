import { Filter } from "../library/Filter"
import { CompanyAmendmentBranch } from "../models/CompanyAmendmentBranch"
import { Repository } from "./Repository"

export class CompanyAmendmentBranchRepository extends Repository<CompanyAmendmentBranch> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAmendmentBranch)
  }

  override async ongoing<CompanyAmendmentBranch>(companyId: string): Promise<CompanyAmendmentBranch> {
    try {
      let filter = new Filter()
      filter.companyId = companyId
      filter.take = 1
      filter.statuses = ["paid", "approved", "submitted"]
      filter.orderBy = "created_at"
      filter.sortOrder = "desc"

      const response = await this.get<CompanyAmendmentBranch>(`${this.resourceUrl}?${filter.getSlug()}}`)
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
