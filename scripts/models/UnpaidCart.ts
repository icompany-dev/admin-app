import { CartItem } from "./CartItem"
import { DeliveryData } from "./DeliveryData"
import { Location } from "./Location"

export class UnpaidCart {
  description: string = ""
  companyName: string = ""
  target: string = ""
  targetId: string = ""
  applicationStatus: string = ""
  billingLocation: Location | null = null
  deliveryData: DeliveryData | null = null
  orderId: string = ""
  cartId: string = ""
  items: CartItem[] = []
  summary: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof UnpaidCart) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.description = data.description
    this.companyName = data.company_name
    this.target = data.target
    this.targetId = data.target_id
    this.applicationStatus = data.application_status
    this.billingLocation = data.billing_location ? new Location(data.billing_location) : null
    this.deliveryData = data.delivery_data ? new DeliveryData(data.delivery_data) : null
    this.orderId = data.order_id
    this.cartId = data.cart_id
    this.items =
      data.items && Array.isArray(data.items)
        ? data.items.map((item: any) => {
            return new CartItem(item)
          })
        : []
    this.summary = data.summary
  }

  clone(data: UnpaidCart): void {
    this.description = data.description
    this.companyName = data.companyName
    this.target = data.target
    this.targetId = data.targetId
    this.applicationStatus = data.applicationStatus
    this.billingLocation = data.billingLocation ? new Location(data.billingLocation) : null
    this.deliveryData = data.deliveryData ? new DeliveryData(data.deliveryData) : null
    this.orderId = data.orderId
    this.cartId = data.cartId
    this.items = data.items.map((item: any) => {
      return new CartItem(item)
    })
    this.summary = data.summary
  }
}
