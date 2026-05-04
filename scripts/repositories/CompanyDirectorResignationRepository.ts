import { ApiRecord } from "../library/ApiRecord"
import { Filter } from "../library/Filter"
import { CompanyDirectorResignation } from "../models/CompanyDirectorResignation"
import { Repository } from "./Repository"

export class CompanyDirectorResignationRepository extends Repository<CompanyDirectorResignation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyDirectorResignation)
  }

  override async ongoing<CompanyDirectorResignation>(companyId: string): Promise<CompanyDirectorResignation> {
    try {
      let filter = new Filter()
      filter.companyId = companyId
      filter.take = 1
      filter.statuses = ["paid", "approved", "submitted"]
      filter.orderBy = "created_at"
      filter.sortOrder = "desc"

      const response = await this.get<CompanyDirectorResignation>(`${this.resourceUrl}?${filter.getSlug()}}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
