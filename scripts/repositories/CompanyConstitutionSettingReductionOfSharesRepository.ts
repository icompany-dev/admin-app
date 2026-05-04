import { CompanyConstitutionSettingReductionOfShares } from "../models/CompanyConstitutionSettingReductionOfShares"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingReductionOfSharesRepository extends Repository<CompanyConstitutionSettingReductionOfShares> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingReductionOfShares)
  }
}
