import { CompanyConstitutionSettingRevocation } from "../models/CompanyConstitutionSettingRevocation"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingRevocationRepository extends Repository<CompanyConstitutionSettingRevocation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingRevocation)
  }
}
