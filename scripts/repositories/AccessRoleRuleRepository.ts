import { AccessRoleRule } from "../models/AccessRoleRule"
import { Repository } from "./Repository"

export class AccessRoleRuleRepository extends Repository<AccessRoleRule> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, AccessRoleRule)
  }

  async fetchByAccessRoleId(accessRoleId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/by-role-id?access_role_id=${accessRoleId}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async addRulesToRole(data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/add-rules-to-role`, data)
      return response
    } catch (e) {
      throw e
    }
  }
}
