import { ServicePricing } from "../models/ServicePricing"
import { Repository } from "./Repository"

export class ServicePricingRepository extends Repository<ServicePricing> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, ServicePricing)
  }

  async fetchDefault(serviceTarget: string): Promise<any> {
    try {
      const response = this.get<any>(`api/price/default?target=${serviceTarget}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchByName(serviceName: string): Promise<any> {
    try {
      const response = this.get<any>(`api/price/by-name?service_name=${serviceName}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchForTarget(targetType: string, targetId: string): Promise<any> {
    try {
      const response = this.get<any>(`api/price/for-target?target=${targetType}&target_id=${targetId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async removeBreakdown(breakdownId: string): Promise<any> {
    try {
      const response = this.post<any>(`${this.singleResourceUrl}/breakdown/delete/${breakdownId}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async removeMandatory(mandatoryId: string): Promise<any> {
    try {
      const response = this.post<any>(`${this.singleResourceUrl}/mandatory/delete/${mandatoryId}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async removeOptional(optionalId: string): Promise<any> {
    try {
      const response = this.post<any>(`${this.singleResourceUrl}/optional/delete/${optionalId}`, {})
      return response
    } catch (error) {
      throw error
    }
  }
}
