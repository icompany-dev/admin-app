import { Director } from "../models/Director"
import { Repository } from "./Repository"

export class DirectorRepository extends Repository<Director> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Director)
  }

  async fetchForUserByCompanyId(companyId: string): Promise<Director> {
    try {
      const response = this.get<Director>(`/api/user/director/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchAllForCompany(companyId: string): Promise<Director[]> {
    try {
      const response = this.get<Director[]>(`/api/company/directors/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
