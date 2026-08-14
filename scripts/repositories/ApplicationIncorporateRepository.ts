import { ApplicationIncorporate } from "../models/ApplicationIncorporate"
import { Repository } from "./Repository"

export class ApplicationIncorporateRepository extends Repository<ApplicationIncorporate> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, ApplicationIncorporate)
  }

  // This method uses the old indexed endpoints - must update when the new endpoint is added
  async fetchAllOld(slug: string | null): Promise<any> {
    try {
      const response = this.get(`${this.resourceUrl}${slug ? "?" + slug : ""}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchLatestOngoing(): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/ongoing`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchProgress(id: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/progress/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async createNameReservations(data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/names`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async updateNameReservations(id: string, data: any): Promise<any> {
    try {
      const response = this.put(`${this.singleResourceUrl}/names/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async updateDescriptionMsicCodes(id: string, data: any): Promise<any> {
    try {
      const response = this.put(`${this.singleResourceUrl}/description-msic/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async updateBusinessAddress(id: string, data: any): Promise<any> {
    try {
      const response = this.put(`${this.singleResourceUrl}/address/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async notifyApproved(id: string): Promise<any> {
    try {
      const response = this.post(`api/incorporation/notify-approved/${id}`, {})
      return response
    } catch (error) {
      throw error
    }
  }
}
