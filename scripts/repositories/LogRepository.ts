import type { Filter } from "../library/Filter"
import type { DirectorLog } from "../models/DirectorLog"
import { ServiceLog } from "../models/ServiceLog"
import { Repository } from "./Repository"

export class LogRepository extends Repository<ServiceLog> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, ServiceLog)
  }

  async fetchDirectorLogs(companyId: string, year: number, directorId: string, filter: Filter): Promise<any> {
    try {
      const response = this.get<any>(
        `${this.resourceUrl}/directors?year=${year}&company_id=${companyId}&director_id=${directorId}&${filter.getSlug()}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchShareholderLogs(companyId: string, year: number, shareholderId: string, filter: Filter): Promise<any> {
    try {
      const response = this.get<any>(
        `${this.resourceUrl}/shareholders?year=${year}&company_id=${companyId}&shareholder_id=${shareholderId}&${filter.getSlug()}`
      )
      return response
    } catch (error) {
      throw error
    }
  }
}
