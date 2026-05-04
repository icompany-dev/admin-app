import { CompanyAuditorAppointment } from "../models/CompanyAuditorAppointment"
import { Repository } from "./Repository"
import { Filter } from "../library/Filter"

export class CompanyAuditorAppointmentRepository extends Repository<CompanyAuditorAppointment> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAuditorAppointment)
  }

  override async ongoing<CompanyAuditorAppointment>(companyId: string): Promise<CompanyAuditorAppointment> {
    try {
      const response = await this.get<any>(`${this.singleResourceUrl}/last?company_id=${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchLast(companyId: string): Promise<any> {
    try {
      const response = await this.get<any>(`${this.singleResourceUrl}/last?company_id=${companyId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
