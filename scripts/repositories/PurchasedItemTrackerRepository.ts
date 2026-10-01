import { PurchasedItemTracker } from "../models/PurchasedItemTracker"
import { Repository } from "./Repository"

export class PurchasedItemTrackerRepository extends Repository<PurchasedItemTracker> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, PurchasedItemTracker)
  }

  async ongoingForCompany(companyId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/ongoing/${companyId}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async orderChop(id: string, companyId: string): Promise<any> {
    try {
      const data = {
        company_id: companyId,
      }
      const response = this.post(`${this.singleResourceUrl}/order-chop/${id}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async orderChopUntracked(companyId: string): Promise<any> {
    try {
      const data = {
        company_id: companyId,
      }
      const response = this.post(`${this.singleResourceUrl}/order-chop-untracked`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async markReady(id: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/ready/${id}`, {})
      return response
    } catch (e) {
      throw e
    }
  }

  async markDelivered(id: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/delivered/${id}`, {})
      return response
    } catch (e) {
      throw e
    }
  }
}
