import { BillplzPaymentGateway } from "../models/BillplzPaymentGateway"
import { Repository } from "./Repository"

export class BillplzPaymentGatewayRepository extends Repository<BillplzPaymentGateway> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined,
    apiKey: string
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, BillplzPaymentGateway, apiKey)
  }

  async fetchGateways(): Promise<any> {
    try {
      const response = this.get<any>("/api/payment-gateways")
      return response
    } catch (error) {
      throw error
    }
  }
}
