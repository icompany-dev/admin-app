import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { CartItem } from "./CartItem"
import { DeliveryData } from "./DeliveryData"
import { Discount } from "./Discount"
import type { IModel } from "./IModel"
import { Location } from "./Location"

export class Cart implements IModel<Cart> {
  id: string = ""
  payeeId: string = ""
  billingName: string = ""
  billingEmail: string = ""
  billingPhone: string = ""
  billingLocationId: string | null = null
  billingLocation: Location | null = null
  notes: string = ""
  discountId: string = ""
  discount: Discount | null = null
  items: CartItem[] = []
  cartSummary: CartSummary = new CartSummary()
  target: string = ""
  targetId: string = ""
  deliveryData: DeliveryData | null = null
  status: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Cart) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.payeeId = data.payeeId
    this.billingName = data.billing_name
    this.billingEmail = data.billing_email
    this.billingPhone = data.billing_phone
    this.billingLocationId = data.billing_location?.id ?? null
    this.billingLocation = data.billing_location ? new Location(data.billing_location) : null
    this.notes = data.notes
    this.discountId = data.discount_id
    this.discount = data.discount ? new Discount(data.discount) : null
    this.items =
      data.items && Array.isArray(data.items)
        ? data.items.map((it: any) => {
            return new CartItem(it)
          })
        : []
    this.cartSummary = new CartSummary(data.cartSummary)
    this.target = data.target ? data.target.target : ""
    this.targetId = data.target ? data.target.id : ""
    this.deliveryData = data.delivery_data ? new DeliveryData(data.delivery_data) : null
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: Cart): void {
    this.id = data.id
    this.payeeId = data.payeeId
    this.billingName = data.billingName
    this.billingEmail = data.billingEmail
    this.billingPhone = data.billingPhone
    this.billingLocationId = data.billingLocationId
    this.billingLocation = data.billingLocation ? new Location(data.billingLocation) : null
    this.notes = data.notes
    this.discountId = data.discountId
    this.discount = data.discount ? new Discount(data.discount) : null
    this.items =
      data.items && Array.isArray(data.items)
        ? data.items.map((it: any) => {
            return new CartItem(it)
          })
        : []
    this.cartSummary = new CartSummary(data.cartSummary)
    this.target = data.target
    this.targetId = data.targetId
    this.deliveryData = data.deliveryData ? new DeliveryData(data.deliveryData) : null
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      billing_name: this.billingName,
      billing_email: this.billingEmail,
      billing_phone: this.billingPhone,
      billing_location_id: this.billingLocationId,
      billing_location: this.billingLocation ? this.billingLocation.getRequestBody() : [],
      notes: this.notes,
      target: this.target,
      target_id: this.targetId,
      discount_id: this.discountId,
      items: this.items.map((item: CartItem) => {
        return item.getRequestBody()
      }),
      status: "new",
      delivery_data: this.deliveryData?.getRequestBody() ?? null,
    }
  }

  canSubmit(): boolean {
    if (this.billingLocation && !this.billingLocation.canCreate()) {
      return false
    }

    return (
      !StringUtil.isNullOrEmpty(this.billingName) &&
      !StringUtil.isNullOrEmpty(this.billingEmail) &&
      !StringUtil.isNullOrEmpty(this.billingPhone) &&
      (!StringUtil.isNullOrEmpty(this.billingLocationId) || this.billingLocation !== null)
    )
  }

  async create(repository: ReturnType<typeof useCartStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(repository.cart)
  }

  async update(repository: ReturnType<typeof useCartStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      await this.create(repository)
      return
    }

    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(repository.cart)
  }
}

export class CartSummary {
  tax: number = 0.0
  discount: number = 0.0
  shipping: number = 0.0
  subtotal: number = 0.0
  total: number = 0.0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CartSummary) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.tax = data.tax ?? 0.0
    this.discount = data.discount ?? 0.0
    this.shipping = data.shipping ?? 0.0
    this.subtotal = data.subtotal ?? 0.0
    this.total = data.total ?? 0.0
  }

  clone(data: CartSummary): void {
    this.tax = data.tax
    this.discount = data.discount
    this.shipping = data.shipping
    this.subtotal = data.subtotal
    this.total = data.total
  }
}
