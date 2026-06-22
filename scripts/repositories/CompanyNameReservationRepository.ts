import { CompanyNameReservation } from "../models/CompanyNameReservation"
import { Repository } from "./Repository"

export class CompanyNameReservationRepository extends Repository<CompanyNameReservation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyNameReservation)
  }

  async reservedName(amendmentId: string, name: string): Promise<any> {
    try {
      let data = {
        proposed_name: name,
      }

      const response = this.post(`${this.singleResourceUrl}/reserve/${amendmentId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async approve(id: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/approve/${id}`, {})
      return response
    } catch (e) {
      throw e
    }
  }

  async reject(id: string, reason: string): Promise<any> {
    try {
      let data = {
        reason: reason,
      }

      const response = this.post(`${this.singleResourceUrl}/reject/${id}`, data)
      return response
    } catch (e) {
      throw e
    }
  }
}
