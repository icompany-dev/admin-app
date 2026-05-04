import { CompanyAddressSubscription } from "../models/CompanyAddressSubscription"
import { Repository } from "./Repository"

export class CompanyAddressSubscriptionRepository extends Repository<CompanyAddressSubscription> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAddressSubscription)
  }

  async renew(companyId: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/renew/${companyId}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async acknowledge(companyId: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/acknowledge/${companyId}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async expirings(): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/expirings`)
      return response
    } catch (error) {
      throw error
    }
  }

  async finalNotices(): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/final-notices`)
      return response
    } catch (error) {
      throw error
    }
  }
}
