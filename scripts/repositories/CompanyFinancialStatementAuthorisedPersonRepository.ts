import { CompanyFinancialStatementAuthorisedPerson } from "../models/CompanyFinancialStatementAuthorisedPerson"
import { Repository } from "./Repository"

export class CompanyFinancialStatementAuthorisedPersonRepository extends Repository<CompanyFinancialStatementAuthorisedPerson> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyFinancialStatementAuthorisedPerson)
  }
}
