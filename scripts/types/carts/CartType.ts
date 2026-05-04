import { Cart } from "~/scripts/models/Cart"
import { CartItem, CartItemDeliveryMetaData } from "~/scripts/models/CartItem"
import { CartBreakdownItem } from "./CartBreakdownItem"
import type { DeliveryAddress } from "../DeliveryAddress"
import { City, Country, Location, State } from "~/scripts/models/Location"
import type { DeliveryData } from "~/scripts/models/DeliveryData"
import { Product } from "~/scripts/models/Product"

export abstract class CartType {
  name: string = ""
  breakdownItems: CartBreakdownItem[] = []

  cart: Cart
  cartItems: CartItem[]
  cartRef = ref<Cart>(new Cart())
  cartItemsRef = ref<CartItem[]>([])

  deliveryAddress: DeliveryAddress | null = null
  deliveryAddressRef = ref<DeliveryAddress | null>(null)

  requireDelivery: boolean = false
  hasHandlingFees: boolean = false
  handlingFeesAmount: number = 0.0
  hasServerCostAndFees: boolean = false
  serverCostAndFeesAmount: number = 0.0
  hasOtherRequirements: boolean = false
  otherRequirements: any = null
  canCosecCertifyTrueCopy: boolean = false
  canSsmCertifyTrueCopy: boolean = false
  ctcAmount: number = 0.0
  canEmail: boolean = false
  canDownload: boolean = false
  canExpressDelivery: boolean = false

  showDeliveryMethod: boolean = false
  showCertifyTrueCopyOption: boolean = false

  selectedCtcOption: string | null = null
  selectedDeliveryOption: string | null = null

  constructor(cart: Cart) {
    this.cart = new Cart(cart)
    this.cartRef.value = new Cart(cart)
    this.cartItems = this.cart.items.map((item: any) => {
      return new CartItem(item)
    })
    this.cartItemsRef.value = this.cartRef.value.items.map((item) => new CartItem(item))

    this.total = this.total.bind(this)
    this.addDeliveryData = this.addDeliveryData.bind(this)
    this.addProductToCart = this.addProductToCart.bind(this)
    this.addDeliveryProductToCart = this.addDeliveryProductToCart.bind(this)
    this.removeDeliveryData = this.removeDeliveryData.bind(this)
  }

  setName(name: string): void {
    this.name = name
  }

  setBreakdownItems(items: CartBreakdownItem[]): void {
    this.breakdownItems = items
  }

  addDeliveryAddress(deliveryAddress: DeliveryAddress): void {
    this.deliveryAddressRef.value = deliveryAddress
  }

  addProductToCart(product: any, quantity: number): void {
    let newCartItem = new CartItem()
    newCartItem.product = new Product(product)
    newCartItem.productId = product.id
    newCartItem.quantity = quantity

    this.cartRef.value.items.push(newCartItem)
    this.cartItemsRef.value.push(newCartItem)
    this.breakdownItems.push(new CartBreakdownItem(product.name, product.price * quantity))
  }

  addDeliveryProductToCart(product: Product): void {
    let deliveryLocation = new Location()
    if (this.deliveryAddressRef.value) {
      deliveryLocation.addressLine1 = this.deliveryAddressRef.value.addressLine1
      deliveryLocation.addressLine2 = this.deliveryAddressRef.value.addressLine2
      deliveryLocation.postcode = this.deliveryAddressRef.value.postcode
      deliveryLocation.city = new City({ name: this.deliveryAddressRef.value.city })
      deliveryLocation.state = new State({ name: this.deliveryAddressRef.value.state })
      deliveryLocation.country = new Country({ name: this.deliveryAddressRef.value.country })
    }

    let metaData = new CartItemDeliveryMetaData()
    metaData.productId = product.id
    metaData.hasDigitalCopy = true
    metaData.selectedLocation = deliveryLocation

    //check if delivery product already in cart
    let existingDeliveryProduct = this.cartItemsRef.value.find((cartItem: CartItem) => {
      return cartItem.metaData instanceof CartItemDeliveryMetaData
    })
    if (existingDeliveryProduct) {
      existingDeliveryProduct.metaData = new CartItemDeliveryMetaData(metaData)
      existingDeliveryProduct.product = new Product(product)
      existingDeliveryProduct.productId = product.id
      return
    }

    let deliveryCartItem: CartItem = new CartItem()
    deliveryCartItem.productId = product.id
    deliveryCartItem.product = new Product(product)
    deliveryCartItem.quantity = 1
    deliveryCartItem.metaData = new CartItemDeliveryMetaData(metaData)

    this.cartRef.value.items.push(deliveryCartItem)
    this.cartItemsRef.value.push(deliveryCartItem)
  }

  addDeliveryData(deliveryData: DeliveryData): void {
    this.cartRef.value.deliveryData = deliveryData
  }

  removeDeliveryData(): void {
    this.cartRef.value.deliveryData = null
  }

  total(): number {
    let total = 0.0

    this.cartItemsRef.value.forEach((item: CartItem) => {
      let price = item.customPrice ?? item.product.price
      total += price * item.quantity
    })

    if (this.cartRef.value.deliveryData !== null) {
      total += Number(this.cartRef.value.deliveryData.total) ?? 0.0
    }

    return total
  }
}
