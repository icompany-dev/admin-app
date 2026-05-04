import type { ApiRecord } from "../library/ApiRecord"
import { UserAccessRole } from "../models/UserAccessRole"
import { Repository } from "./Repository"

export class UserAccessRoleRepository extends Repository<UserAccessRole> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, UserAccessRole)
  }

  async fetchAllForCompany(companyId: string): Promise<any> {
    try {
      const response = this.get<any>(`/api/access/user-access-roles-for-company/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
