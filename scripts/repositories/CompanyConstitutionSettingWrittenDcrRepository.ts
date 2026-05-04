import { CompanyConstitutionSettingWrittenDcr } from "../models/CompanyConstitutionSettingWrittenDcr"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingWrittenDcrRepository extends Repository<CompanyConstitutionSettingWrittenDcr> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingWrittenDcr)
  }
}
