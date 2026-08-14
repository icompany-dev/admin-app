import { CompanyStrikingOffWaiver } from "../models/CompanyStrikingOffWaiver"
import { Repository } from "./Repository"

export class CompanyStrikingOffWaiverRepository extends Repository<CompanyStrikingOffWaiver> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyStrikingOffWaiver)
  }

  override fetch<CompanyStrikingOffWaiver>(strikingOffResolutionId: string): Promise<CompanyStrikingOffWaiver> {
    try {
      let response = this.get<CompanyStrikingOffWaiver>(`${this.singleResourceUrl}/fetch/${strikingOffResolutionId}`)
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

  override update<CompanyStrikingOffWaiver>(
    strikingOffResolutionId: string,
    data: object
  ): Promise<CompanyStrikingOffWaiver> {
    try {
      let response = this.post<CompanyStrikingOffWaiver>(
        `${this.singleResourceUrl}/update/${strikingOffResolutionId}`,
        data
      )
      return response
    } catch (e) {
      throw e
    }
  }
}
