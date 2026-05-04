import { CompanyConstitutionSettingDirectorPowersAndDuty } from "../models/CompanyConstitutionSettingDirectorPowersAndDuty"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingDirectorPowersAndDutyRepository extends Repository<CompanyConstitutionSettingDirectorPowersAndDuty> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingDirectorPowersAndDuty)
  }
}
