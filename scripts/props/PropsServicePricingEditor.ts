import type { ServicePricing } from "../models/ServicePricing"

export interface IPropsServicePricingEditor {
  servicePricing: ServicePricing
  isAddingService: boolean
}

export class PropsServicePricingEditor implements IPropsServicePricingEditor {
  servicePricing: ServicePricing
  isAddingService: boolean

  constructor(servicePricing: ServicePricing, isAddingService: boolean) {
    this.servicePricing = servicePricing
    this.isAddingService = isAddingService
  }
}
