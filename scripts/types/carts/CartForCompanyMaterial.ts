import { Cart } from "~/scripts/models/Cart"
import { CartType } from "./CartType"
import type { ICartType } from "./ICartType"
import { CartBreakdownItem } from "./CartBreakdownItem"
import type { CartItem } from "~/scripts/models/CartItem"

export class CartForCompanyMaterial extends CartType implements ICartType {
  constructor(cart: Cart) {
    super(cart)

    this.requireDelivery = true
    this.hasServerCostAndFees = true
    this.serverCostAndFeesAmount = 2.6

    this.showDeliveryMethod = true

    this.name = "Purchase of Company Materials"
    this.breakdownItems = this.cartItemsRef.value.map((ci: CartItem) => {
      let amount = ci.quantity * (ci.customPrice ?? ci.product.price)
      return new CartBreakdownItem(`Purchase of ${ci.product.name}`, amount)
    })
  }
}
