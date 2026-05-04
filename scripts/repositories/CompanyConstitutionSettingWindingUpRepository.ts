import { CompanyConstitutionSettingWindingUp } from "../models/CompanyConstitutionSettingWindingUp"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingWindingUpRepository extends Repository<CompanyConstitutionSettingWindingUp> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingWindingUp)
  }
}
