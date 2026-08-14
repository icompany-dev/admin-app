import { UserArchiveAccess } from "../models/UserArchiveAccess"
import { Repository } from "./Repository"

export class UserArchiveAccessRepository extends Repository<UserArchiveAccess> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, UserArchiveAccess)
  }

  async hasAccess(type: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/has-access/${type}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
