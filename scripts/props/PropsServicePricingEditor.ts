import type { ServicePricing } from "../models/ServicePricing"

export interface IPropsServicePricingEditor {
  servicePricing: ServicePricing
}

export class PropsServicePricingEditor implements IPropsServicePricingEditor {
  servicePricing: ServicePricing

  constructor(servicePricing: ServicePricing) {
    this.servicePricing = servicePricing
  }
}
