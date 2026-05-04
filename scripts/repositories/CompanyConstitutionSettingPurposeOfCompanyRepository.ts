import { CompanyConstitutionSettingPurposeOfCompany } from "../models/CompanyConstitutionSettingPurposeOfCompany"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingPurposeOfCompanyRepository extends Repository<CompanyConstitutionSettingPurposeOfCompany> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingPurposeOfCompany)
  }
}
