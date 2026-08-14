import { CompanyConstitutionSettingWrittenResolution } from "../models/CompanyConstitutionSettingWrittenResolution"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingWrittenResolutionRepository extends Repository<CompanyConstitutionSettingWrittenResolution> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingWrittenResolution)
  }
}
