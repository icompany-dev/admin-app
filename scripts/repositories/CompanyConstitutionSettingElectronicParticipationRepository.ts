import { CompanyConstitutionSettingElectronicParticipation } from "../models/CompanyConstitutionSettingElectronicParticipation"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingElectronicParticipationRepository extends Repository<CompanyConstitutionSettingElectronicParticipation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingElectronicParticipation)
  }
}
