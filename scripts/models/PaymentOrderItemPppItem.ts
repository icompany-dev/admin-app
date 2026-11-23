export class PaymentOrderItemPppItem {
  id: string = ""
  pppId: string = "" // refers to PaymentOrderItemPpp
  servicePricingId: string = ""
  serviceName: string = ""
  serviceTarget: string = ""
  basePrice: number = 0
  description: string = ""
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentOrderItemPppItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.pppId = data.ppp_id ?? ""
    this.servicePricingId = data.service_pricing_id ?? ""
    this.serviceName = data.service_name ?? ""
    this.serviceTarget = data.service_target ?? ""
    this.basePrice = data.base_price ?? 0
    this.description = data.description ?? ""
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
    this.deletedAt = data.deleted_at ?? ""
  }

  clone(data: PaymentOrderItemPppItem): void {
    this.id = data.id
    this.pppId = data.pppId
    this.servicePricingId = data.servicePricingId
    this.serviceName = data.serviceName
    this.serviceTarget = data.serviceTarget
    this.basePrice = data.basePrice
    this.description = data.description
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      ppp_id: this.pppId,
      service_pricing_id: this.servicePricingId,
      service_name: this.serviceName,
      service_target: this.serviceTarget,
      base_price: this.basePrice,
      description: this.description,
    }
  }
}
