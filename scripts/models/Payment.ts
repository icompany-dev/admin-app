import type { IModel } from "./IModel"

export class Payment implements IModel<Payment> {
  id: string = ""
  method: string = ""
  invoiceId: string = ""
  amount: number = 0.0
  status: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Payment) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.method = data.method
    this.invoiceId = data.invoice_id
    this.amount = data.amount
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: Payment): void {
    this.id = data.id
    this.method = data.method
    this.invoiceId = data.invoiceId
    this.amount = data.amount
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {}
  }
}
