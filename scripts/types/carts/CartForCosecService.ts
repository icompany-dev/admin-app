import { Cart } from "~/scripts/models/Cart"
import { CartType } from "./CartType"
import type { ICartType } from "./ICartType"
import { CartBreakdownItem } from "./CartBreakdownItem"
import type { CartItem } from "~/scripts/models/CartItem"

export class CartForCosecService extends CartType implements ICartType {
  constructor(cart: Cart) {
    super(cart)
    this.serverCostAndFeesAmount = 2.6

    let numberOfBreakdownItems = this.cartItemsRef.value.length
    let serverCostAndFeesAmountPerItem = Math.floor((this.serverCostAndFeesAmount / numberOfBreakdownItems) * 100) / 100
    let difference = this.serverCostAndFeesAmount - serverCostAndFeesAmountPerItem * numberOfBreakdownItems
    this.breakdownItems = this.cartItemsRef.value.map((ci: CartItem, index: number) => {
      let amount = ci.quantity * (ci.customPrice ?? ci.product.price)
      if (index === 0) {
        amount -= serverCostAndFeesAmountPerItem - difference
      } else {
        amount += serverCostAndFeesAmountPerItem
      }

      return new CartBreakdownItem(ci.product.name, amount)
    })
  }
}
