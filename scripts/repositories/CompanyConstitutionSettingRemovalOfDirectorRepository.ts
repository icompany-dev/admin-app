import { CompanyConstitutionSettingRemovalOfDirector } from "../models/CompanyConstitutionSettingRemovalOfDirector"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingRemovalOfDirectorRepository extends Repository<CompanyConstitutionSettingRemovalOfDirector> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingRemovalOfDirector)
  }
}
