import type { IModel } from "./IModel"
import { Location } from "./Location"
import { Product } from "./Product"

export class CartItem implements IModel<CartItem> {
  id: string = ""
  cartId: string = ""
  productId: string = ""
  product: Product = new Product()
  quantity: number = 1
  customPrice: number | null = null
  metaData: CartItemMetaData | CartItemDeliveryMetaData | null = null // we need to map out the variations for this, like what we did for delivery data
  updatedAt: string | null = null
  createdAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CartItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.cartId = data.cartId
    this.productId = data.product?.id ?? ""
    this.product = new Product(data.product)
    this.quantity = data.quantity
    this.customPrice = data.custom_price
    this.metaData = data.meta_data ? new CartItemMetaData(data.meta_data) : null
    if (this.metaData?.type === "delivery") {
      this.metaData = new CartItemDeliveryMetaData(data.meta_data)
    }
    this.updatedAt = data.updated_at
    this.createdAt = data.created_at
  }

  clone(data: CartItem): void {
    this.id = data.id
    this.cartId = data.cartId
    this.productId = data.productId
    this.product = new Product(data.product)
    this.quantity = data.quantity
    this.customPrice = data.customPrice
    this.metaData = data.metaData ? new CartItemMetaData(data.metaData) : null
    if (this.metaData?.type === "delivery") {
      this.metaData = new CartItemDeliveryMetaData(data.metaData)
    }
    this.updatedAt = data.updatedAt
    this.createdAt = data.createdAt
  }

  getRequestBody(): object {
    return {
      product_id: this.productId,
      quantity: this.quantity,
      custom_price: this.customPrice,
      meta_data: JSON.stringify(this.metaData),
    }
  }
}

export class CartItemMetaData {
  type: string = ""
  productId: string = ""
  hasDigitalCopy: boolean | null = null
  data: any | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CartItemMetaData) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    let jsonObject: any = typeof data === "string" ? JSON.parse(data) : data
    this.type = jsonObject.type ?? ""
    this.productId = jsonObject.product_id ?? ""
    this.hasDigitalCopy = jsonObject.has_digital_copy !== null ? jsonObject.has_digital_copy : null
    this.data = jsonObject.data ?? null
  }

  clone(data: CartItemMetaData): void {
    this.type = data.type
    this.productId = data.productId
    this.hasDigitalCopy = data.hasDigitalCopy
    this.data = data.data
  }

  getRequestBody(): object {
    return {
      type: this.type,
      product_id: this.productId,
      has_digital_copy: this.hasDigitalCopy,
      data: this.data,
    }
  }
}

export class CartItemDeliveryMetaData extends CartItemMetaData {
  selectedLocation: Location = new Location()

  constructor(data: any | null = null) {
    super(data)
    this.type = "delivery"

    if (!data) {
      return
    }

    if (data instanceof CartItemDeliveryMetaData) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  override convertFromResponse(data: any): void {
    let jsonObject: any = typeof data === "string" ? JSON.parse(data) : data
    this.productId = jsonObject.product_id ?? ""
    this.hasDigitalCopy = jsonObject.has_digital_copy !== null ? jsonObject.has_digital_copy : null
    this.selectedLocation = jsonObject.selected_location ? new Location(jsonObject.selectedLocation) : new Location()
  }

  override clone(data: CartItemDeliveryMetaData): void {
    this.productId = data.productId
    this.hasDigitalCopy = data.hasDigitalCopy
    this.selectedLocation = new Location(data.selectedLocation)
  }

  override getRequestBody(): object {
    return {
      type: this.type,
      product_id: this.productId,
      has_digital_copy: this.hasDigitalCopy,
      selected_location: this.selectedLocation.getRequestBody(),
    }
  }
}
