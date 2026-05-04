import { ServicePricing } from "../models/ServicePricing"

export class RecommendedItemToPay {
  isSelected: boolean = false
  label: string = ""
  description: string = ""
  servicePricing: ServicePricing = new ServicePricing()

  constructor(isSelected: boolean, label: string, description: string, servicePricing: ServicePricing) {
    this.isSelected = isSelected
    this.label = label
    this.description = description
    this.servicePricing = new ServicePricing(servicePricing)
  }
}
