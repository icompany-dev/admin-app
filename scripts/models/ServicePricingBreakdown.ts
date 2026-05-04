import type { IModel } from "./IModel"

export class ServicePricingBreakdown implements IModel<ServicePricingBreakdown> {
  id: string = ""
  servicePricingId: string | null = null
  orderNumber: number = 1
  itemName: string = ""
  price: number = 0.0
  isSstApplicable: boolean = false
  isDstApplicable: boolean = false
  status: string = "draft"
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServicePricingBreakdown) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.servicePricingId = data.service_pricing_id
    this.orderNumber = data.order_number
    this.itemName = data.item_name.toUpperCase()
    this.price = parseFloat(data.price)
    this.isSstApplicable = data.is_sst_applicable
    this.isDstApplicable = data.is_dst_applicable
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: ServicePricingBreakdown): void {
    this.id = data.id
    this.servicePricingId = data.servicePricingId
    this.orderNumber = data.orderNumber
    this.itemName = data.itemName
    this.price = data.price
    this.isSstApplicable = data.isSstApplicable
    this.isDstApplicable = data.isDstApplicable
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody() {
    return {
      id: this.id,
      service_pricing_id: this.servicePricingId,
      order_number: this.orderNumber,
      item_name: this.itemName,
      price: this.price,
      is_sst_applicable: this.isSstApplicable,
      is_dst_applicable: this.isDstApplicable,
      status: this.status,
    }
  }
}
