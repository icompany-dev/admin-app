import type { IModel } from "./IModel"

export class PaymentOrderItemBreakdown implements IModel<PaymentOrderItemBreakdown> {
  id: string = ""
  paymentOrderItemId: string = ""
  itemName: string = ""
  isServiceTaxable: boolean = false
  isDigitalTaxable: boolean = false
  isNonTaxable: boolean = false
  sst: number = 0
  dst: number = 0
  price: number = 0
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentOrderItemBreakdown) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.paymentOrderItemId = data.payment_order_item_id
    this.itemName = data.item_name
    this.isServiceTaxable = data.is_service_taxable ?? false
    this.isDigitalTaxable = data.is_digital_taxable ?? false
    this.isNonTaxable = data.is_non_taxable ?? false
    this.sst = data.sst ?? 0
    this.dst = data.dst ?? 0
    this.price = data.price ?? 0
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: PaymentOrderItemBreakdown): void {
    this.id = data.id
    this.paymentOrderItemId = data.paymentOrderItemId
    this.itemName = data.itemName
    this.isServiceTaxable = data.isServiceTaxable
    this.isDigitalTaxable = data.isDigitalTaxable
    this.isNonTaxable = data.isNonTaxable
    this.sst = data.sst
    this.dst = data.dst
    this.price = data.price
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      item_name: this.itemName,
      price: this.price,
      is_sst_applicable: this.isServiceTaxable,
      is_dst_applicable: this.isDigitalTaxable,
    }
  }
}
