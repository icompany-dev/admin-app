import { CompanyConstitutionSettingEvidenceOfTitle } from "../models/CompanyConstitutionSettingEvidenceOfTitle"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingEvidenceOfTitleRepository extends Repository<CompanyConstitutionSettingEvidenceOfTitle> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingEvidenceOfTitle)
  }
}
