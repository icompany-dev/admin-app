import { ServicePricing } from "~/scripts/models/ServicePricing"
import type { ServicePricingBreakdown } from "~/scripts/models/ServicePricingBreakdown"
import type { ServicePricingMandatory } from "~/scripts/models/ServicePricingMandatory"
import type { ServicePricingOptional } from "~/scripts/models/ServicePricingOptional"
import type { PropsPricing } from "~/scripts/props/PropsPricing"
import { PricingDetail } from "~/scripts/types/pricings/PricingDetail"
import { NumberUtil } from "~/scripts/utils/Number"

export class PricingController {
  emitEvents: any | null = null

  servicePricing: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsPricing): void {
    this.servicePricing.value = new ServicePricing(props.servicePricing)
  }

  getGrandTotal(servicePricing: ServicePricing): string {
    return NumberUtil.currency(Number(servicePricing.baseGrandTotal) + Number(servicePricing.config.handlingFees))
  }

  get hasBreakdowns(): boolean {
    return this.servicePricing.value.breakdowns.length > 0
  }

  get hasMandatories(): boolean {
    return this.servicePricing.value.mandatoryServices.length > 0
  }

  get hasOptionals(): boolean {
    return this.servicePricing.value.optionals.length > 0
  }

  get pricingDetails(): PricingDetail[] {
    let details: PricingDetail[] = []

    let breakdowns = this.servicePricing.value.breakdowns.filter((spb: ServicePricingBreakdown) => {
      return spb.price > 0
    })

    breakdowns.forEach((spb: ServicePricingBreakdown) => {
      details.push(new PricingDetail(spb.itemName, spb.price))
    })

    this.servicePricing.value.mandatoryServices.forEach((spm: ServicePricingMandatory) => {
      details.push(
        new PricingDetail(
          spm.mandatoryServicePrice.serviceName,
          spm.basePrice ?? Number(this.getGrandTotal(spm.mandatoryServicePrice))
        )
      )
    })

    return details
  }

  get pricingOptionalDetails(): PricingDetail[] {
    let details: PricingDetail[] = []

    this.servicePricing.value.optionals.forEach((spo: ServicePricingOptional) => {
      details.push(new PricingDetail(spo.optionalServicePrice.serviceName, spo.optionalServicePrice.baseGrandTotal))
    })

    return details
  }

  get configurationDetails(): PricingDetail[] {
    let details: PricingDetail[] = [
      new PricingDetail("Cosec Service Fee", this.servicePricing.value.config.cosecServiceFee),
      new PricingDetail("Digital Service Fee", this.servicePricing.value.config.digitalServiceFee),
      new PricingDetail("Handling Fees", this.servicePricing.value.config.handlingFees),
    ]

    return details
  }

  get grandTotal(): string {
    return this.getGrandTotal(this.servicePricing.value)
  }
}
