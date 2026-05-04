import { CompanyBankAccountOpening } from "../models/CompanyBankAccountOpening"
import { Repository } from "./Repository"

export class CompanyBankAccountOpeningRepository extends Repository<CompanyBankAccountOpening> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyBankAccountOpening)
  }
}
