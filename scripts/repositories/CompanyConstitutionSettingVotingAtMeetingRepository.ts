import { CompanyConstitutionSettingVotingAtMeeting } from "../models/CompanyConstitutionSettingVotingAtMeeting"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingVotingAtMeetingRepository extends Repository<CompanyConstitutionSettingVotingAtMeeting> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingVotingAtMeeting)
  }
}
