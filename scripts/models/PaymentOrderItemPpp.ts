import type { PaymentOrderItemPppItem } from "./PaymentOrderItemPppItem"

export class PaymentOrderItemPpp {
  id: string = ""
  poItemId: string = ""
  standardPackagingMinLimit: number = 0
  standardPackagingMaxLimit: number = 0
  standardPackagingPrice: number = 0
  premiumPackagingMinLimit: number = 0
  premiumPackagingMaxLimit: number = 0
  premiumPackagingPrice: number = 0
  bulkPackagingMinLimit: number = 0
  bulkPackagingPrice: number = 0
  packagingType: string = ""
  totalAmount: number = 0
  items: PaymentOrderItemPppItem[] = []
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentOrderItemPpp) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.poItemId = data.po_item_id ?? ""
    this.standardPackagingMinLimit = data.standard_packaging_min_limit ?? 0
    this.standardPackagingMaxLimit = data.standard_packaging_max_limit ?? 0
    this.standardPackagingPrice = data.standard_packaging_price ?? 0
    this.premiumPackagingMinLimit = data.premium_packaging_min_limit ?? 0
    this.premiumPackagingMaxLimit = data.premium_packaging_max_limit ?? 0
    this.premiumPackagingPrice = data.premium_packaging_price ?? 0
    this.bulkPackagingMinLimit = data.bulk_packaging_min_limit ?? 0
    this.bulkPackagingPrice = data.bulk_packaging_price ?? 0
    this.packagingType = data.packaging_type ?? ""
    this.totalAmount = data.total_amount ?? 0
    this.items = data.items ?? []
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
    this.deletedAt = data.deleted_at ?? ""
  }

  clone(data: PaymentOrderItemPpp): void {
    this.id = data.id
    this.poItemId = data.poItemId
    this.standardPackagingMinLimit = data.standardPackagingMinLimit
    this.standardPackagingMaxLimit = data.standardPackagingMaxLimit
    this.standardPackagingPrice = data.standardPackagingPrice
    this.premiumPackagingMinLimit = data.premiumPackagingMinLimit
    this.premiumPackagingMaxLimit = data.premiumPackagingMaxLimit
    this.premiumPackagingPrice = data.premiumPackagingPrice
    this.bulkPackagingMinLimit = data.bulkPackagingMinLimit
    this.bulkPackagingPrice = data.bulkPackagingPrice
    this.packagingType = data.packagingType
    this.totalAmount = data.totalAmount
    this.items = data.items
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      po_item_id: this.poItemId,
      standard_packaging_min_limit: this.standardPackagingMinLimit,
      standard_packaging_max_limit: this.standardPackagingMaxLimit,
      standard_packaging_price: this.standardPackagingPrice,
      premium_packaging_min_limit: this.premiumPackagingMinLimit,
      premium_packaging_max_limit: this.premiumPackagingMaxLimit,
      premium_packaging_price: this.premiumPackagingPrice,
      bulk_packaging_min_limit: this.bulkPackagingMinLimit,
      bulk_packaging_price: this.bulkPackagingPrice,
      packaging_type: this.packagingType,
      total_amount: this.totalAmount,
      items: this.items.map((i: PaymentOrderItemPppItem) => {
        return i.getRequestBody()
      }),
    }
  }
}
