import { useCartStore } from "#imports"
import { Cart } from "~/scripts/models/Cart"
import { Location } from "~/scripts/models/Location"
import { Error } from "../library/Error"

export class GenerateCart {
  static async empty(
    billingName: string,
    billingEmail: string,
    billingPhone: string,
    billingLocationId: string | null,
    billingLocation: Location | null
  ): Promise<Cart> {
    if (!billingLocationId && !billingLocation) {
      let errorMessage = new Error(Error.ERROR_TYPE_DATA, "Billing location or location id is required.")
      throw errorMessage
    }

    const cartRepository = useCartStore()
    let cart = new Cart()
    cart.billingName = billingName
    cart.billingEmail = billingEmail
    cart.billingPhone = billingPhone
    cart.billingLocationId = billingLocationId
    if (billingLocation) {
      cart.billingLocation = new Location(billingLocation)
    }

    await cart.create(cartRepository)

    return cart
  }

  static async forApplication(target: string, targetId: string): Promise<Cart> {
    const cartRepository = useCartStore()
    await cartRepository.createApplicationCart(target, targetId)
    if (cartRepository.error) {
      throw cartRepository.error
    }

    let cart = new Cart(cartRepository.cart)

    return cart
  }
}
