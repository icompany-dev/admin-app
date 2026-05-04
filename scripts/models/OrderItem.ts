import type { IModel } from "./IModel"
import { PurchasedDocumentTemplate } from "./PurchasedDocumentTemplate"

export class OrderItem implements IModel<OrderItem> {
  id: string = ""
  orderId: string = ""
  name: string = ""
  summary: string = ""
  description: string = ""
  type: string = ""
  price: number = 0.0
  auto: number = 0
  quantity: number = 1
  productMetaData: any | null = null
  itemMetaData: any | null = null
  purchasedDocumentTemplates: PurchasedDocumentTemplate[] = []
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof OrderItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.orderId = data.order_id
    this.name = data.name
    this.summary = data.summary
    this.description = data.description
    this.type = data.type
    this.price = data.price
    this.auto = data.auto
    this.quantity = data.quantity
    this.productMetaData = data.product_meta_data
    this.itemMetaData = data.item_meta_data
    this.purchasedDocumentTemplates =
      data.purchased_document_templates && Array.isArray(data.purchased_document_templates)
        ? data.purchased_document_templates.map((pdt: any) => {
            return new PurchasedDocumentTemplate(pdt)
          })
        : []
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: OrderItem): void {
    this.id = data.id
    this.orderId = data.orderId
    this.name = data.name
    this.summary = data.summary
    this.description = data.description
    this.type = data.type
    this.price = data.price
    this.auto = data.auto
    this.quantity = data.quantity
    this.productMetaData = data.productMetaData
    this.itemMetaData = data.itemMetaData
    this.purchasedDocumentTemplates = data.purchasedDocumentTemplates.map((pdt: PurchasedDocumentTemplate) => {
      return new PurchasedDocumentTemplate(pdt)
    })
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {}
  }
}
