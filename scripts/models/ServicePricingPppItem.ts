export class ServicePricingPppItem {
  id: string = ""
  pppId: string = ""
  servicePricingId: string = ""
  price: number = 0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServicePricingPppItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.pppId = data.ppp_id
    this.servicePricingId = data.service_pricing_id
    this.price = data.price
  }

  clone(data: ServicePricingPppItem): void {
    this.id = data.id
    this.pppId = data.pppId
    this.servicePricingId = data.servicePricingId
    this.price = data.price
  }

  getRequestBody(): object {
    return {
      id: this.id,
      ppp_id: this.pppId,
      service_pricing_id: this.servicePricingId,
      price: this.price,
    }
  }
}
