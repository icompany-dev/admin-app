import { CartItem } from "../models/CartItem"
import { Repository } from "./Repository"

export class CartItemRepository extends Repository<CartItem> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CartItem)
  }
}
