import { CompanyAssetPurchase } from "../models/CompanyAssetPurchase"
import { Repository } from "./Repository"

export class CompanyAssetPurchaseRepository extends Repository<CompanyAssetPurchase> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAssetPurchase)
  }
}
