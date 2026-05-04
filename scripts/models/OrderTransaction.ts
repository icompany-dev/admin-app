import type { IModel } from "./IModel"

//NOTE(Bahiyah): This is an old data type - only for old data prior to the release of our v2 (in Nuxt3)
export class OrderTransaction implements IModel<OrderTransaction> {
  id: string = "" // Not used by backend
  companyName: string = ""
  paymentFor: string = ""
  paymentAttemptDate: string = ""
  status: string = ""
  orderId: string = ""
  referenceNumber: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof OrderTransaction) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.companyName = data.company_name
    this.paymentFor = data.payment_for
    this.paymentAttemptDate = data.payment_attempt_date
    this.status = data.status
    this.orderId = data.order_id
    this.referenceNumber = data.reference_number
  }

  clone(data: OrderTransaction): void {
    this.companyName = data.companyName
    this.paymentFor = data.paymentFor
    this.paymentAttemptDate = data.paymentAttemptDate
    this.status = data.status
    this.orderId = data.orderId
    this.referenceNumber = data.referenceNumber
  }

  getRequestBody(): object {
    return {}
  }
}
