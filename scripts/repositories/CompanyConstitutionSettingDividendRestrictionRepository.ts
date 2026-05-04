import { CompanyConstitutionSettingDividendRestriction } from "../models/CompanyConstitutionSettingDividendRestriction"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingDividendRestrictionRepository extends Repository<CompanyConstitutionSettingDividendRestriction> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingDividendRestriction)
  }
}
