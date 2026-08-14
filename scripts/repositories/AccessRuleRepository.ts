import { AccessRule } from "../models/AccessRule"
import { Repository } from "./Repository"

export class AccessRuleRepository extends Repository<AccessRule> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, AccessRule)
  }

  async fetchByServices(): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/get-by-services`)
      return response
    } catch (e) {
      throw e
    }
  }
}
