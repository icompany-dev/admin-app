import { File } from "./File"
import type { IModel } from "./IModel"
import { Location } from "./Location"
import { Payment } from "./Payment"

export class Invoice implements IModel<Invoice> {
  id: string = ""
  billingName: string = ""
  billingEmail: string = ""
  billingPhone: string = ""
  billingLocation: Location = new Location()
  receipt: File = new File()
  payments: Payment[] = []
  amount: number = 0.0
  status: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Invoice) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.billingName = data.billing_name
    this.billingEmail = data.billing_email
    this.billingPhone = data.billing_phone
    this.billingLocation = new Location(data.billing_location)
    this.receipt = new File(data.receipt)
    this.payments =
      data.payments && Array.isArray(data.payments)
        ? data.payments.map((p: any) => {
            return new Payment(p)
          })
        : []
    this.amount = data.amount
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: Invoice): void {
    this.id = data.id
    this.billingName = data.billingName
    this.billingEmail = data.billingEmail
    this.billingPhone = data.billingPhone
    this.billingLocation = new Location(data.billingLocation)
    this.receipt = new File(data.receipt)
    this.payments = data.payments.map((p: any) => {
      return new Payment(p)
    })
    this.amount = data.amount
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {}
  }
}
