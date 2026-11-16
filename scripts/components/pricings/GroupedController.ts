import { Label } from "~/scripts/models/Label"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import type { PropsGroupedServicePricing } from "~/scripts/props/PropsGroupedServicePricing"

export class GroupedController {
  label: Ref<Label> = ref<Label>(new Label())
  servicePricings: Ref<ServicePricing[]> = ref<ServicePricing[]>([])

  emitEvents: any | null = null

  constructor(props: PropsGroupedServicePricing, emitEvents: any) {
    this.emitEvents = emitEvents
  }

  setDataFromProps(props: PropsGroupedServicePricing): void {
    this.label.value = new Label(props.label)
    this.servicePricings.value = props.pricings.map((sp: ServicePricing) => {
      return new ServicePricing(sp)
    })
  }
}
