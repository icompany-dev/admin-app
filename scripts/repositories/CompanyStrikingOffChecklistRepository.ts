import { CompanyStrikingOffChecklist } from "../models/CompanyStrikingOffChecklist"
import { Repository } from "./Repository"

export class CompanyStrikingOffChecklistRepository extends Repository<CompanyStrikingOffChecklist> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyStrikingOffChecklist)
  }

  override fetch<CompanyStrikingOffChecklist>(strikingOffResolutionId: string): Promise<CompanyStrikingOffChecklist> {
    try {
      let response = this.get<CompanyStrikingOffChecklist>(`${this.singleResourceUrl}/fetch/${strikingOffResolutionId}`)
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

  override update<CompanyStrikingOffChecklist>(
    strikingOffResolutionId: string,
    data: object
  ): Promise<CompanyStrikingOffChecklist> {
    try {
      let response = this.post<CompanyStrikingOffChecklist>(
        `${this.singleResourceUrl}/update/${strikingOffResolutionId}`,
        data
      )
      return response
    } catch (e) {
      throw e
    }
  }
}
