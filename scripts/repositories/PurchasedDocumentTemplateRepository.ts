import { PurchasedDocumentTemplate } from "../models/PurchasedDocumentTemplate"
import { Repository } from "./Repository"

export class PurchasedDocumentTemplateRepository extends Repository<PurchasedDocumentTemplate> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, PurchasedDocumentTemplate)
  }
}
