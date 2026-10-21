import { CompanyFinancialStatement } from "../models/CompanyFinancialStatement"
import { Repository } from "./Repository"

export class CompanyFinancialStatementRepository extends Repository<CompanyFinancialStatement> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyFinancialStatement)
  }
}
