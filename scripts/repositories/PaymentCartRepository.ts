import { PaymentCart } from "../models/PaymentCart"
import { Repository } from "./Repository"

export class PaymentCartRepository extends Repository<PaymentCart> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, PaymentCart)
  }

  async fetchByEntity(entityId: string, entityType: string): Promise<PaymentCart> {
    try {
      const response = this.get<PaymentCart>(
        `${this.singleResourceUrl}/entity?entity_type=${entityType}&entity_id=${entityId}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async addToCart(id: string, data: any): Promise<PaymentCart> {
    try {
      const response = this.post<PaymentCart>(`${this.singleResourceUrl}/${id}/item/add`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async updateCartItem(id: string, data: any): Promise<PaymentCart> {
    try {
      const response = this.post<PaymentCart>(`${this.singleResourceUrl}/${id}/item/update`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async removeFromCart(id: string, paymentCartItemId: string, data: any): Promise<PaymentCart> {
    try {
      const response = this.post<PaymentCart>(`${this.singleResourceUrl}/${id}/item/delete/${paymentCartItemId}`, data)
      return response
    } catch (error) {
      throw error
    }
  }
}
