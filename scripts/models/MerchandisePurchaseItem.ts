import type { IModel } from "./IModel"
import { Merchandise } from "./Merchandise"

export class MerchandisePurchaseItem implements IModel<MerchandisePurchaseItem> {
  id: string = ""
  merchandise: Merchandise = new Merchandise()
  name: string = ""
  description: string = ""
  isDownloadable: boolean = false
  downloadUrl: string = ""
  price: number = 0
  quantity: number = 0
  discount: number = 0
  totalPrice: number = 0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof MerchandisePurchaseItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.merchandise = new Merchandise(data.merchandise)
    this.name = data.name
    this.description = data.description
    this.isDownloadable = data.is_downloadable
    this.downloadUrl = data.download_url
    this.price = data.price_per_unit
    this.quantity = data.quantity
    this.discount = data.discount
    this.totalPrice = data.total_price
  }

  clone(data: MerchandisePurchaseItem): void {
    this.id = data.id
    this.merchandise = new Merchandise(data.merchandise)
    this.name = data.name
    this.description = data.description
    this.isDownloadable = data.isDownloadable
    this.downloadUrl = data.downloadUrl
    this.price = data.price
    this.quantity = data.quantity
    this.discount = data.discount
    this.totalPrice = data.totalPrice
  }

  getRequestBody(): object {
    return {
      merchandise_id: this.merchandise.id,
      price_per_unit: this.price,
      quantity: this.quantity,
      total_price: this.totalPrice,
    }
  }

  convertFromMerchandise(data: Merchandise, quantity: number): void {
    this.id = data.id
    this.merchandise = new Merchandise(data)
    this.name = data.name
    this.description = data.description
    this.isDownloadable = data.isDownloadable
    this.downloadUrl = ""
    this.price = data.price
    this.quantity = quantity
    this.discount = 0
    this.totalPrice = data.price
  }
}
