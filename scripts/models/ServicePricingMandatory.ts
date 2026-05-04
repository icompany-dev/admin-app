import type { IModel } from "./IModel"
import { ServicePricing } from "./ServicePricing"

export class ServicePricingMandatory implements IModel<ServicePricingMandatory> {
  id: string = ""
  servicePricingId: string | null = null
  mandatoryServiceId: string | null = null
  mandatoryServicePrice: ServicePricing = new ServicePricing()
  basePrice: number | null = null
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServicePricingMandatory) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.servicePricingId = data.service_pricing_id
    this.mandatoryServiceId = data.mandatory_service_id
    this.mandatoryServicePrice = new ServicePricing(data.mandatory_service_price)
    this.basePrice = parseFloat(data.base_price) ?? 0.0
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: ServicePricingMandatory): void {
    this.id = data.id
    this.servicePricingId = data.servicePricingId
    this.mandatoryServiceId = data.mandatoryServiceId
    this.mandatoryServicePrice = new ServicePricing(data.mandatoryServicePrice)
    this.basePrice = data.basePrice
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody() {
    return {
      id: this.id,
      mandatory_service_id: this.mandatoryServiceId,
      base_price: this.basePrice,
    }
  }
}
