import type { ApiRecord } from "../library/ApiRecord"
import { UserAccessRule } from "../models/UserAccessRule"
import { Repository } from "./Repository"

export class UserAccessRuleRepository extends Repository<UserAccessRule> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, UserAccessRule)
  }

  async byAccessRule(userId: string, companyId: string, accessRuleId: string): Promise<any> {
    try {
      const response = this.get<any>(
        `${this.singleResourceUrl}/by-access-rule?user_id=${userId}&company_id=${companyId}&access_rule_id=${accessRuleId}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async forUserCompany(userId: string, companyId: string): Promise<any> {
    try {
      const response = this.get<any>(
        `${this.singleResourceUrl}/for-user-company?user_id=${userId}&company_id=${companyId}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async accessRulesForUser(userId: string, companyId: string): Promise<any> {
    try {
      const response = this.get<any>(
        `${this.singleResourceUrl}/access-rules-for-user?user_id=${userId}&company_id=${companyId}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async createMultiple(data: any): Promise<any> {
    try {
      const response = this.post<any>(`${this.singleResourceUrl}/create-multiple`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async updateMultiple(data: any): Promise<any> {
    try {
      const response = this.post<any>(`${this.singleResourceUrl}/update-multiple`, data)
      return response
    } catch (error) {
      throw error
    }
  }
}
