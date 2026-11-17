import type { ServicePricing } from "../models/ServicePricing"

export interface IPropsPricing {
  servicePricing: ServicePricing
  isShowServiceName: boolean
}

export class PropsPricing implements IPropsPricing {
  servicePricing: ServicePricing
  isShowServiceName: boolean

  constructor(servicePricing: ServicePricing, isShowServiceName: boolean) {
    this.servicePricing = servicePricing
    this.isShowServiceName = isShowServiceName
  }
}
