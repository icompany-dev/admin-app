import type { Filter } from "../library/Filter"
import { Model } from "../models/Model"
import { Repository } from "./Repository"

export class AnalyticsRepository extends Repository<Model> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Model)
  }

  async fetchIncorporationBy(filter: Filter): Promise<any> {
    try {
      const response = this.get<any>(`${this.singleResourceUrl}/summary/incorporation?${filter.getSlug()}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchSwitchBy(filter: Filter): Promise<any> {
    try {
      const response = this.get<any>(`${this.singleResourceUrl}/summary/switch?${filter.getSlug()}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchPaymentBy(filter: Filter): Promise<any> {
    try {
      const response = this.get<any>(`${this.singleResourceUrl}/summary/payment?${filter.getSlug()}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchUserCoordinates(): Promise<any> {
    try {
      const response = this.get<any>(`${this.resourceUrl}/user-coordinates`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchCompanyCoordinates(): Promise<any> {
    try {
      const response = this.get<any>(`${this.resourceUrl}/company-coordinates`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchCompanyCounts(): Promise<any> {
    try {
      const response = this.get<any>(`${this.resourceUrl}/companies`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchUserCounts(): Promise<any> {
    try {
      const response = this.get<any>(`${this.resourceUrl}/users`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchPaymentCounts(): Promise<any> {
    try {
      const response = this.get<any>(`${this.resourceUrl}/payments`)
      return response
    } catch (e) {
      throw e
    }
  }
}
