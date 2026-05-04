import { CompanyFinancialStatementSetup } from "../models/CompanyFinancialStatementSetup"
import { Repository } from "./Repository"

export class CompanyFinancialStatementSetupRepository extends Repository<CompanyFinancialStatementSetup> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyFinancialStatementSetup)
  }
}
