import { ServicePricing } from "./ServicePricing"

export class PaymentCartItemOptional {
  id: string = ""
  paymentCartItemId: string = ""
  servicePricingId: string = ""
  servicePricing: ServicePricing = new ServicePricing()
  isLateLodgement: boolean = false
  lateLodgementFees: number | null = null
  total: number = 0

  //display purposes
  suffixToServiceName: string = ""
  isDisabled: boolean = true

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentCartItemOptional) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.paymentCartItemId = data.payment_cart_item_id
    this.servicePricingId = data.service_pricing_id
    this.servicePricing = new ServicePricing(data.service_pricing)
    this.isLateLodgement = data.is_late_lodgement
    this.lateLodgementFees = Number(data.late_lodgement_fees)
    this.total = data.total
  }

  clone(data: PaymentCartItemOptional): void {
    this.id = data.id
    this.paymentCartItemId = data.paymentCartItemId
    this.servicePricingId = data.servicePricingId
    this.servicePricing = new ServicePricing(data.servicePricing)
    this.isLateLodgement = data.isLateLodgement
    this.lateLodgementFees = Number(data.lateLodgementFees)
    this.total = data.total
    this.suffixToServiceName = data.suffixToServiceName
    this.isDisabled = data.isDisabled
  }
}
