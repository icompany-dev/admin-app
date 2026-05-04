export class PaymentOrderItemOptional {
  id: string = ""
  poItemId: string = ""
  servicePricingId: string = ""
  serviceName: string = ""
  serviceTarget: string = ""
  basePrice: number = 0.0
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentOrderItemOptional) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.poItemId = data.po_item_id
    this.servicePricingId = data.service_pricing_id
    this.serviceName = data.service_name
    this.serviceTarget = data.service_target
    this.basePrice = data.base_price
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: PaymentOrderItemOptional): void {
    this.id = data.id
    this.poItemId = data.poItemId
    this.servicePricingId = data.servicePricingId
    this.serviceName = data.serviceName
    this.serviceTarget = data.serviceTarget
    this.basePrice = data.basePrice
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      service_pricing_id: this.servicePricingId,
      service_name: this.serviceName,
      base_price: this.basePrice,
    }
  }
}
