import { CompanyConstitutionSettingQuorumRequirement } from "../models/CompanyConstitutionSettingQuorumRequirement"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingQuorumRequirementRepository extends Repository<CompanyConstitutionSettingQuorumRequirement> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingQuorumRequirement)
  }
}
