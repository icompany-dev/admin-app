import { CompanyStrikingOffRegistrarLetter } from "../models/CompanyStrikingOffRegistrarLetter"
import { Repository } from "./Repository"

export class CompanyStrikingOffRegistrarLetterRepository extends Repository<CompanyStrikingOffRegistrarLetter> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyStrikingOffRegistrarLetter)
  }

  override fetch<CompanyStrikingOffRegistrarLetter>(
    strikingOffResolutionId: string
  ): Promise<CompanyStrikingOffRegistrarLetter> {
    try {
      let response = this.get<CompanyStrikingOffRegistrarLetter>(
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

  override update<CompanyStrikingOffRegistrarLetter>(
    strikingOffResolutionId: string,
    data: object
  ): Promise<CompanyStrikingOffRegistrarLetter> {
    try {
      let response = this.post<CompanyStrikingOffRegistrarLetter>(
        `${this.singleResourceUrl}/update/${strikingOffResolutionId}`,
        data
      )
      return response
    } catch (e) {
      throw e
    }
  }
}
