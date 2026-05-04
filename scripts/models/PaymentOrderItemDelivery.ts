import { DeliveryInfo } from "./DeliveryInfo"
import type { IModel } from "./IModel"

export class PaymentOrderItemDelivery
  implements IModel<PaymentOrderItemDelivery>
{
  id: string = ""
  paymentOrderItemId: string = ""
  deliveryInfo: DeliveryInfo = new DeliveryInfo()
  deliveryMethod: string = ""
  deliveryPartner: string = ""
  deliveryPartnerPayload: string = ""
  deliveryRemarks: string = ""
  deliveryRates: string = ""
  status: string = ""
  trackingUrl: string | null = null
  trackingNumber: string | null = null
  shippedAt: string | null = null
  deliveredAt: string | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentOrderItemDelivery) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.paymentOrderItemId = data.payment_order_item_id
    this.deliveryInfo = new DeliveryInfo({
      dalivery_name: data.recipient_name,
      dalivery_email: data.recipient_email,
      dalivery_phone: data.recipient_phone,
      dalivery_address_line_1: data.address_line_1,
      dalivery_address_line_2: data.address_line_2,
      dalivery_address_postcode: data.address_postcode,
      dalivery_address_city: data.address_city,
      dalivery_address_state: data.address_state,
      dalivery_address_country: data.address_country,
    })
    this.deliveryMethod = data.delivery_method
    this.deliveryPartner = data.delivery_partner
    this.deliveryPartnerPayload = data.delivery_partner_payload
    this.deliveryRemarks = data.delivery_remarks
    this.deliveryRates = data.delivery_rates
    this.status = data.status
    this.trackingUrl = data.tracking_url
    this.trackingNumber = data.tracking_number
    this.shippedAt = data.shipped_at
    this.deliveredAt = data.delivered_at
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: PaymentOrderItemDelivery): void {
    this.id = data.id
    this.paymentOrderItemId = data.paymentOrderItemId
    this.deliveryInfo = new DeliveryInfo(data.deliveryInfo)
    this.deliveryMethod = data.deliveryMethod
    this.deliveryPartner = data.deliveryPartner
    this.deliveryPartnerPayload = data.deliveryPartnerPayload
    this.deliveryRemarks = data.deliveryRemarks
    this.deliveryRates = data.deliveryRates
    this.status = data.status
    this.trackingUrl = data.trackingUrl
    this.trackingNumber = data.trackingNumber
    this.shippedAt = data.shippedAt
    this.deliveredAt = data.deliveredAt
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {}
  }
}
