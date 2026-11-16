import type { Label } from "../models/Label"
import type { ServicePricing } from "../models/ServicePricing"

export interface IPropsGroupedServicePricing {
  label: Label
  pricings: ServicePricing[]
}

export class PropsGroupedServicePricing {
  label: Label
  pricings: ServicePricing[]

  constructor(label: Label, pricings: ServicePricing[]) {
    this.label = label
    this.pricings = pricings
  }
}
