import type { IModel } from "./IModel"

export class PaymentBill implements IModel<PaymentBill> {
  id: number = 0
  billFor: string = ""
  collectionId: string = ""
  email: string = ""
  phone: string = ""
  name: string = ""
  amount: number = 0
  callbackUrl: string = ""
  redirectUrl: string = ""
  description: string = ""
  paymentMethod: string = ""
  paymentReferenceNumber: string = ""
  billId: string = "" //Billplz bill Id
  paymentLink: string = ""
  status: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentBill) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.billFor = data.bill_for
    this.collectionId = data.collection_id
    this.email = data.email
    this.phone = data.phone
    this.name = data.name
    this.amount = data.amount
    this.callbackUrl = data.callback_url
    this.redirectUrl = data.redirect_url
    this.description = data.description
    this.paymentMethod = data.payment_method
    this.paymentReferenceNumber = data.payment_reference_number
    this.billId = data.bill_id
    this.paymentLink = data.payment_link
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: PaymentBill): void {
    this.id = data.id
    this.billFor = data.billFor
    this.collectionId = data.collectionId
    this.email = data.email
    this.phone = data.phone
    this.name = data.name
    this.amount = data.amount
    this.callbackUrl = data.callbackUrl
    this.redirectUrl = data.redirectUrl
    this.description = data.description
    this.paymentMethod = data.paymentMethod
    this.paymentReferenceNumber = data.paymentReferenceNumber
    this.billId = data.billId
    this.paymentLink = data.paymentLink
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {}
  }
}
