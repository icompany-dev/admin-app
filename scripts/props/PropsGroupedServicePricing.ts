import type { Label } from "../models/Label"
import type { LabelItem } from "../models/LabelItem"
import type { ServicePricing } from "../models/ServicePricing"

export interface IPropsGroupedServicePricing {
  label: Label
  labelItems: LabelItem[]
}

export class PropsGroupedServicePricing {
  label: Label
  labelItems: LabelItem[]

  constructor(label: Label, labelItems: LabelItem[]) {
    this.label = label
    this.labelItems = labelItems
  }
}
