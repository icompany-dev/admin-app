export class ServicePricingCtcDiscount {
  id: string = ""
  servicePricingId: string = ""
  maxNumberPages: number = 0
  discountAmount: number = 0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServicePricingCtcDiscount) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.servicePricingId = data.service_pricing_id
    this.maxNumberPages = data.max_number_pages
    this.discountAmount = data.discount_amount
  }

  clone(data: ServicePricingCtcDiscount): void {
    this.id = data.id
    this.servicePricingId = data.servicePricingId
    this.maxNumberPages = data.maxNumberPages
    this.discountAmount = data.discountAmount
  }

  getRequestBody(): object {
    return {
      service_pricing_id: this.servicePricingId,
      max_number_pages: this.maxNumberPages,
      discount_amount: this.discountAmount,
    }
  }
}
