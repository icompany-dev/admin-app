import { AdminPaymentReceived } from "../models/AdminPaymentReceived"
import { Repository } from "./Repository"

export class AdminPaymentReceivedRepository extends Repository<AdminPaymentReceived> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, AdminPaymentReceived)
  }
}
