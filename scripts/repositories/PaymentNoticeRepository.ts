import { PaymentNotice } from "../models/PaymentNotice"
import { Repository } from "./Repository"

export class PaymentNoticeRepository extends Repository<PaymentNotice> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, PaymentNotice)
  }
}
