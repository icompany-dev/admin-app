import { CompanyConstitutionSettingCeoDuty } from "../models/CompanyConstitutionSettingCeoDuty"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingCeoDutyRepository extends Repository<CompanyConstitutionSettingCeoDuty> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingCeoDuty)
  }
}
