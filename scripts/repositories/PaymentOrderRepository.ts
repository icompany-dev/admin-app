import type { PaymentBill } from "../models/PaymentBill"
import { PaymentOrder } from "../models/PaymentOrder"
import { Repository } from "./Repository"

export class PaymentOrderRepository extends Repository<PaymentOrder> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, PaymentOrder)
  }

  async fetchByCart(paymentCartId: string): Promise<PaymentOrder> {
    try {
      const response = this.get<PaymentOrder>(`${this.singleResourceUrl}/${paymentCartId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async makePayment(data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/make`, data)
      return response // Response is a paymentbill
    } catch (error) {
      throw error
    }
  }

  async fetchByReferenceNumber(referenceNumber: string): Promise<PaymentOrder> {
    try {
      const response = this.get<PaymentOrder>(
        `${this.singleResourceUrl}/by-reference-number?reference_number=${referenceNumber}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchByPaymentBill(paymentBillId: number): Promise<PaymentOrder> {
    try {
      const response = this.get<PaymentOrder>(
        `${this.singleResourceUrl}/by-payment-bill?payment_bill_id=${paymentBillId}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchPendingDeliveries(): Promise<any> {
    try {
      const response = this.get<any>(`${this.singleResourceUrl}/pending-delivery`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchForReceipt(id: string): Promise<any> {
    try {
      const response = this.get<any>(`api/receipt/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchItem(target: string, targetId: string): Promise<any> {
    try {
      const response = this.get<any>(`${this.singleResourceUrl}/item?target=${target}&target_id=${targetId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchByTarget(target: string, targetId: string): Promise<any> {
    try {
      const response = this.get<any>(`${this.singleResourceUrl}/by-target?target=${target}&target_id=${targetId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async shipItem(target: string, targetId: string, trackingNumber: string, trackingUrl: string): Promise<any> {
    try {
      let data = {
        target: target,
        target_id: targetId,
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
      }
      const response = this.post<any>(`${this.singleResourceUrl}/ship-item`, data)
      return response
    } catch (error) {
      throw error
    }
  }
}
