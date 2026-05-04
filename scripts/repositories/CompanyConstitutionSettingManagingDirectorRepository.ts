import { CompanyConstitutionSettingManagingDirector } from "../models/CompanyConstitutionSettingManagingDirector"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingManagingDirectorRepository extends Repository<CompanyConstitutionSettingManagingDirector> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingManagingDirector)
  }
}
