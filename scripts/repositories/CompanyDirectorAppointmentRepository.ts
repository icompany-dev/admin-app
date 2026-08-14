import { ApiRecord } from "../library/ApiRecord"
import { Filter } from "../library/Filter"
import { CompanyDirectorAppointment } from "../models/CompanyDirectorAppointment"
import { Repository } from "./Repository"

export class CompanyDirectorAppointmentRepository extends Repository<CompanyDirectorAppointment> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyDirectorAppointment)
  }

  override async fetchAll<CompanyDirectorAppointment>(filter: Filter): Promise<ApiRecord<CompanyDirectorAppointment>> {
    try {
      const slug = filter.getSlug()
      const rawResponse: any = await this.get(`/api/company/director/all-appointments${slug ? "?" + slug : ""}`)
      const apiRecord = new ApiRecord<CompanyDirectorAppointment>(rawResponse, this.itemClassType as any)
      return apiRecord
    } catch (error) {
      throw error
    }
  }

  override async ongoing<CompanyDirectorAppointment>(companyId: string): Promise<CompanyDirectorAppointment> {
    try {
      let filter = new Filter()
      filter.companyId = companyId
      filter.take = 1
      filter.statuses = ["paid", "approved", "submitted"]
      filter.orderBy = "created_at"
      filter.sortOrder = "desc"

      const response = await this.get<CompanyDirectorAppointment>(
        `/api/company/director/all-appointments?${filter.getSlug()}}`
      )
      return response
    } catch (error) {
      throw error
    }
  }
}
