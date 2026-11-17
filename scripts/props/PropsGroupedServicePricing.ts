import type { Label } from "../models/Label"
import type { LabelItem } from "../models/LabelItem"
import type { ServicePricing } from "../models/ServicePricing"

export interface IPropsGroupedServicePricing {
  label: Label
  labelItems: LabelItem[]
  allPricings: ServicePricing[]
}

export class PropsGroupedServicePricing {
  label: Label
  labelItems: LabelItem[]
  allPricings: ServicePricing[]

  constructor(label: Label, labelItems: LabelItem[], allPricings: ServicePricing[]) {
    this.label = label
    this.labelItems = labelItems
    this.allPricings = allPricings
  }
}
