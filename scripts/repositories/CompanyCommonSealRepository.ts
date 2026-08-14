import { CompanyCommonSeal } from "../models/CompanyCommonSeal"
import { Repository } from "./Repository"

export class CompanyCommonSealRepository extends Repository<CompanyCommonSeal> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyCommonSeal)
  }
}
