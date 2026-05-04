import { CompanyConstitutionSettingTypesAndClassOfShare } from "../models/CompanyConstitutionSettingTypesAndClassOfShare"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingTypesAndClassOfShareRepository extends Repository<CompanyConstitutionSettingTypesAndClassOfShare> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingTypesAndClassOfShare)
  }
}
