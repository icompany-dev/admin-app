import type { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { Cart } from "../models/Cart"
import type { UnpaidCart } from "../models/UnpaidCart"
import { Repository } from "./Repository"

export class CartRepository extends Repository<Cart> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Cart)
  }

  async createApplicationCart(target: string, targetId: string): Promise<any> {
    try {
      const data = {
        target,
        target_id: targetId,
      }
      const response: any = this.post<any>(`${this.singleResourceUrl}/applications`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchUnpaids(filter: Filter): Promise<ApiRecord<UnpaidCart>> {
    try {
      const slug = filter.getSlug()
      const response = this.get<ApiRecord<UnpaidCart>>(`${this.singleResourceUrl}/unpaids${slug ? "?" + slug : ""}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
