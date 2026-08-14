import { DeliveryData } from "./DeliveryData"
import { Discount } from "./Discount"
import { File } from "./File"
import type { IModel } from "./IModel"
import { Invoice } from "./Invoice"
import { Location } from "./Location"
import { OrderItem } from "./OrderItem"
import { Payment } from "./Payment"

export class Order implements IModel<Order> {
  id: string = ""
  cartId: string = ""
  invoice: Invoice = new Invoice()
  items: OrderItem[] = []
  notes: string = ""
  discountId: string | null = null
  discount: Discount | null = null
  orderSummary: OrderSummary = new OrderSummary()
  target: string = ""
  targetId: string = ""
  metaData: any | null = null
  deliveryData: DeliveryData | null = null
  status: string = ""
  trackingNumber: string | null = null
  trackingUrl: string | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Order) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.cartId = data.cart_id
    this.invoice = new Invoice(data.invoice)
    this.items =
      data.items && Array.isArray(data.items)
        ? data.items.map((item: any) => {
            return new OrderItem(item)
          })
        : []
    this.notes = data.notes
    this.discountId = data.discount_id
    this.discount = data.discount ? new Discount(data.discount) : null
    this.orderSummary = new OrderSummary(data.order_summary)
    this.target = data.target ? data.target.target : ""
    this.targetId = data.target ? data.target.id : ""
    this.metaData = data.meta_data
    this.deliveryData = data.delivery_data ? new DeliveryData(data.delivery_data) : null
    this.status = data.status
    this.trackingNumber = data.tracking_number
    this.trackingUrl = data.tracking_url
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: Order): void {
    this.id = data.id
    this.cartId = data.cartId
    this.invoice = new Invoice(data.invoice)
    this.items = data.items.map((item: OrderItem) => {
      return new OrderItem(item)
    })
    this.notes = data.notes
    this.discountId = data.discountId
    this.discount = data.discount ? new Discount(data.discount) : null
    this.orderSummary = new OrderSummary(data.orderSummary)
    this.target = data.target
    this.targetId = data.targetId
    this.metaData = data.metaData
    this.deliveryData = data.deliveryData ? new DeliveryData(data.deliveryData) : null
    this.status = data.status
    this.trackingNumber = data.trackingNumber
    this.trackingUrl = data.trackingUrl
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      cart_id: this.cartId,
    }
  }
}

export class OrderSummary {
  tax: number = 0.0
  discount: number = 0.0
  shipping: number = 0.0
  subtotal: number = 0.0
  total: number = 0.0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof OrderSummary) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.tax = data.tax ?? 0.0
    this.discount = data.discount ?? 0.0
    this.shipping = data.shipping ?? 0.0
    this.subtotal = data.subtotal ?? 0.0
    this.total = data.total ?? 0.0
  }

  clone(data: OrderSummary): void {
    this.tax = data.tax
    this.discount = data.discount
    this.shipping = data.shipping
    this.subtotal = data.subtotal
    this.total = data.total
  }
}
