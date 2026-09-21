import { CompanyChangeBankSignatory } from "../models/CompanyChangeBankSignatory"
import { Repository } from "./Repository"

export class CompanyChangeBankSignatoryRepository extends Repository<CompanyChangeBankSignatory> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyChangeBankSignatory)
  }
}
