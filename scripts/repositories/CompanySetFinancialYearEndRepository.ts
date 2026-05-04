import { CompanySetFinancialYearEnd } from "../models/CompanySetFinancialYearEnd"
import { Repository } from "./Repository"

export class CompanySetFinancialYearEndRepository extends Repository<CompanySetFinancialYearEnd> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanySetFinancialYearEnd)
  }
}
