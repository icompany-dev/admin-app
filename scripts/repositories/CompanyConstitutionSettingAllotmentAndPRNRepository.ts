import { CompanyConstitutionSettingAllotmentAndPRN } from "../models/CompanyConstitutionSettingAllotmentAndPRN"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingAllotmentAndPRNRepository extends Repository<CompanyConstitutionSettingAllotmentAndPRN> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingAllotmentAndPRN)
  }
}
