import { CompanyFundSourceDeclaration } from "../models/CompanyFundSourceDeclaration"
import { Repository } from "./Repository"

export class CompanyFundSourceDeclarationRepository extends Repository<CompanyFundSourceDeclaration> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyFundSourceDeclaration)
  }
}
