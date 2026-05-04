import { CompanyConstitutionSettingChairman } from "../models/CompanyConstitutionSettingChairman"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingChairmanRepository extends Repository<CompanyConstitutionSettingChairman> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingChairman)
  }
}
