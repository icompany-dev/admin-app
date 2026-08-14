import { ApiRecord } from "../library/ApiRecord"
import { Filter } from "../library/Filter"
import { CompanyAmendmentConstitution } from "../models/CompanyAmendmentConstitution"
import { Repository } from "./Repository"

export class CompanyAmendmentConstitutionRepository extends Repository<CompanyAmendmentConstitution> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAmendmentConstitution)
  }

  override async ongoing<CompanyAmendmentConstitution>(companyId: string): Promise<CompanyAmendmentConstitution> {
    try {
      let filter = new Filter()
      filter.companyId = companyId
      filter.take = 1
      filter.statuses = ["paid", "approved", "submitted"]
      filter.orderBy = "created_at"
      filter.sortOrder = "desc"

      const response = await this.get<CompanyAmendmentConstitution>(`${this.resourceUrl}?${filter.getSlug()}}`)
      return response
    } catch (error) {
      throw error
    }
  }

  override async fetchAll<CompanyAmendmentConstitution>(
    filter: Filter
  ): Promise<ApiRecord<CompanyAmendmentConstitution>> {
    try {
      let slug = filter.getSlug()
      const response: any = await this.get(`${this.singleResourceUrl}/all${slug ? "?" + slug : ""}`)
      return new ApiRecord<CompanyAmendmentConstitution>(response, this.itemClassType as any)
    } catch (e) {
      throw e
    }
  }
}
