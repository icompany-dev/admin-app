import { CompanyConstitutionSettingFailToMeetQuorum } from "../models/CompanyConstitutionSettingFailToMeetQuorum"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingFailToMeetQuorumRepository extends Repository<CompanyConstitutionSettingFailToMeetQuorum> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingFailToMeetQuorum)
  }
}
