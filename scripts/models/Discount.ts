import type { IModel } from "./IModel"

export class Discount implements IModel<Discount> {
  id: string = ""
  code: string = ""
  amount: number = 0.0
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Discount) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.code = data.code
    this.amount = data.amount
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: Discount): void {
    this.id = data.id
    this.code = data.code
    this.amount = data.amount
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {}
  }
}
