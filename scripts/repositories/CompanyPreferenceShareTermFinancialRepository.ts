import { CompanyPreferenceShareTermFinancial } from "../models/CompanyPreferenceShareTermFinancial"
import { Repository } from "./Repository"

export class CompanyPreferenceShareTermFinancialRepository extends Repository<CompanyPreferenceShareTermFinancial> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyPreferenceShareTermFinancial)
  }
}
