import type { IModel } from "./IModel"
import { ServicePricing } from "./ServicePricing"

export class ServicePricingOptional implements IModel<ServicePricingOptional> {
  id: string = ""
  servicePricingId: string | null = null
  optionalServiceId: string | null = null
  optionalServicePrice: ServicePricing = new ServicePricing()
  isOutcome: boolean = false
  isRecommendedService: boolean = false
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServicePricingOptional) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.servicePricingId = data.service_pricing_id
    this.optionalServiceId = data.optional_service_id
    this.optionalServicePrice = new ServicePricing(data.optional_service_price)
    this.isOutcome = data.is_outcome
    this.isRecommendedService = data.is_recommended_service
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: ServicePricingOptional): void {
    this.id = data.id
    this.servicePricingId = data.servicePricingId
    this.optionalServiceId = data.optionalServiceId
    this.optionalServicePrice = new ServicePricing(data.optionalServicePrice)
    this.isOutcome = data.isOutcome
    this.isRecommendedService = data.isRecommendedService
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody() {
    return {
      optional_service_id: this.optionalServiceId,
      is_outcome: this.isOutcome,
      is_recommended_service: this.isRecommendedService,
    }
  }
}
