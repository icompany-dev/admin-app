import type { IModel } from "./IModel"

export class Product implements IModel<Product> {
  id: string = ""
  name: string = ""
  refNo: string = ""
  summary: string = ""
  description: string = ""
  type: string = ""
  price: number = 0.0
  stock: number | null = null
  // meta_data: string = '' // Shelve until the patterns for this emerges

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Product) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.refNo = data.ref_no
    this.summary = data.summary
    this.description = data.description
    this.type = data.type
    this.price = data.price
    this.stock = data.stock
  }

  clone(data: Product): void {
    this.id = data.id
    this.name = data.name
    this.refNo = data.refNo
    this.summary = data.summary
    this.description = data.description
    this.type = data.type
    this.price = data.price
    this.stock = data.stock
  }

  getRequestBody(): object {
    return {}
  }
}
