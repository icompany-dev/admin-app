import type { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { Order } from "../models/Order"
import type { OrderTransaction } from "../models/OrderTransaction"
import type { ReceiptData } from "../models/ReceiptData"
import { Repository } from "./Repository"

export class OrderRepository extends Repository<Order> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Order)
  }

  override fetchAll<Order>(filter: Filter): Promise<ApiRecord<Order>> {
    try {
      const slug = filter.getSlug()
      const response = this.get<ApiRecord<Order>>(
        `${this.singleResourceUrl}/all${slug ? "?" + slug : ""}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async receipt(id: string): Promise<ReceiptData> {
    try {
      const response = this.get<ReceiptData>(
        `${this.singleResourceUrl}/receipt/${id}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchPaymentHistory(
    filter: Filter
  ): Promise<ApiRecord<OrderTransaction>> {
    try {
      const slug = filter.getSlug()
      const response = this.get<ApiRecord<OrderTransaction>>(
        `api/payment-history${slug ? "?" + slug : ""}`
      )
      return response
    } catch (error) {
      throw error
    }
  }
}
