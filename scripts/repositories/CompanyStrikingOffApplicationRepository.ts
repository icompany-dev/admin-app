import { CompanyStrikingOffApplication } from "../models/CompanyStrikingOffApplication"
import { Repository } from "./Repository"

export class CompanyStrikingOffApplicationRepository extends Repository<CompanyStrikingOffApplication> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyStrikingOffApplication)
  }

  override fetch<CompanyStrikingOffApplication>(
    strikingOffResolutionId: string
  ): Promise<CompanyStrikingOffApplication> {
    try {
      let response = this.get<CompanyStrikingOffApplication>(
        `${this.singleResourceUrl}/fetch/${strikingOffResolutionId}`
      )
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

  override update<CompanyStrikingOffApplication>(
    strikingOffResolutionId: string,
    data: object
  ): Promise<CompanyStrikingOffApplication> {
    try {
      let response = this.post<CompanyStrikingOffApplication>(
        `${this.singleResourceUrl}/update/${strikingOffResolutionId}`,
        data
      )
      return response
    } catch (e) {
      throw e
    }
  }
}
