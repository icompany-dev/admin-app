import { CompanyDividendDeclaration } from "../models/CompanyDividendDeclaration"
import { Repository } from "./Repository"

export class CompanyDividendDeclarationRepository extends Repository<CompanyDividendDeclaration> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyDividendDeclaration)
  }
}
