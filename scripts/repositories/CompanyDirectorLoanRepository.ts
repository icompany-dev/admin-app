import { CompanyDirectorLoan } from "../models/CompanyDirectorLoan"
import { Repository } from "./Repository"

export class CompanyDirectorLoanRepository extends Repository<CompanyDirectorLoan> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyDirectorLoan)
  }
}
