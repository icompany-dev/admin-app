import { CompanyBankAccountClosure } from "../models/CompanyBankAccountClosure"
import { Repository } from "./Repository"

export class CompanyBankAccountClosureRepository extends Repository<CompanyBankAccountClosure> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyBankAccountClosure)
  }
}
