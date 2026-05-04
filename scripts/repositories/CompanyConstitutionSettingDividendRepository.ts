import { CompanyConstitutionSettingDividend } from "../models/CompanyConstitutionSettingDividend"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingDividendRepository extends Repository<CompanyConstitutionSettingDividend> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingDividend)
  }
}
