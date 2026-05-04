export class PaymentOrderItemMandatory {
  id: string = ""
  poItemId: string = ""
  servicePricingId: string = ""
  serviceName: string = ""
  basePrice: number = 0
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentOrderItemMandatory) {
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
    this.basePrice = data.base_price
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: PaymentOrderItemMandatory): void {
    this.id = data.id
    this.poItemId = data.poItemId
    this.servicePricingId = data.servicePricingId
    this.serviceName = data.serviceName
    this.basePrice = data.basePrice
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      mandatory_service_id: this.servicePricingId,
      service_name: this.serviceName,
      base_price: this.basePrice,
    }
  }
}
