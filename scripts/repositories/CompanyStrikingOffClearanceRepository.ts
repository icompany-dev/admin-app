import { CompanyStrikingOffClearance } from "../models/CompanyStrikingOffClearance"
import { Repository } from "./Repository"

export class CompanyStrikingOffClearanceRepository extends Repository<CompanyStrikingOffClearance> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyStrikingOffClearance)
  }

  override fetch<CompanyStrikingOffClearance>(strikingOffResolutionId: string): Promise<CompanyStrikingOffClearance> {
    try {
      let response = this.get<CompanyStrikingOffClearance>(`${this.singleResourceUrl}/fetch/${strikingOffResolutionId}`)
      return response
    } catch (e) {
      throw e
    }
  }

  create(strikingOffResolutionId: string, data: object): Promise<any> {
    try {
      let response = this.post(`${this.singleResourceUrl}/create/${strikingOffResolutionId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  override update<CompanyStrikingOffClearance>(
    strikingOffResolutionId: string,
    data: object
  ): Promise<CompanyStrikingOffClearance> {
    try {
      let response = this.post<CompanyStrikingOffClearance>(
        `${this.singleResourceUrl}/update/${strikingOffResolutionId}`,
        data
      )
      return response
    } catch (e) {
      throw e
    }
  }
}
