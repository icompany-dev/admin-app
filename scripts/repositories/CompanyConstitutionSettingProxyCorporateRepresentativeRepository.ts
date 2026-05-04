import { CompanyConstitutionSettingProxyCorporateRepresentative } from "../models/CompanyConstitutionSettingProxyCorporateRepresentative"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingProxyCorporateRepresentativeRepository extends Repository<CompanyConstitutionSettingProxyCorporateRepresentative> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingProxyCorporateRepresentative)
  }
}
