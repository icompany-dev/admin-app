import { CompanyConstitutionSettingCeo } from "../models/CompanyConstitutionSettingCeo"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingCeoRepository extends Repository<CompanyConstitutionSettingCeo> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingCeo)
  }
}
