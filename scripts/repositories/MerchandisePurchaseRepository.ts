import { MerchandisePurchase } from "../models/MerchandisePurchase"
import { Repository } from "./Repository"

export class MerchandisePurchaseRepository extends Repository<MerchandisePurchase> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined,
    apiKey: string
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, MerchandisePurchase, apiKey)
  }
}
