import { CompanyConstitutionSettingCeoRevocation } from "../models/CompanyConstitutionSettingCeoRevocation"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingCeoRevocationRepository extends Repository<CompanyConstitutionSettingCeoRevocation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingCeoRevocation)
  }
}
