import type { Cart } from "~/scripts/models/Cart"
import type { CartItem } from "~/scripts/models/CartItem"
import type { CartBreakdownItem } from "./CartBreakdownItem"
import type { Product } from "~/scripts/models/Product"
import type { DeliveryAddress } from "../DeliveryAddress"
import type { DeliveryData } from "~/scripts/models/DeliveryData"

export interface ICartType {
  name: string
  breakdownItems: CartBreakdownItem[]

  cart: Cart
  cartItems: CartItem[]

  deliveryAddress: DeliveryAddress | null

  requireDelivery: boolean
  hasHandlingFees: boolean
  handlingFeesAmount: number
  hasServerCostAndFees: boolean
  serverCostAndFeesAmount: number
  hasOtherRequirements: boolean
  otherRequirements: any
  canCosecCertifyTrueCopy: boolean
  canSsmCertifyTrueCopy: boolean
  ctcAmount: number
  canEmail: boolean
  canDownload: boolean
  canExpressDelivery: boolean

  showDeliveryMethod: boolean
  showCertifyTrueCopyOption: boolean

  selectedCtcOption: string | null
  selectedDeliveryOption: string | null

  setName(name: string): void
  setBreakdownItems(items: CartBreakdownItem[]): void
  addProductToCart(product: Product, quantity: number): void
  addDeliveryAddress(deliveryAddress: DeliveryAddress): void
  addDeliveryProductToCart(product: Product): void
  addDeliveryData(deliveryData: DeliveryData): void
  removeDeliveryData(): void
  total(): number
}
