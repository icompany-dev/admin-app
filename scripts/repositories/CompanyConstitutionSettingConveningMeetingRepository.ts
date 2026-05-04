import { CompanyConstitutionSettingConveningMeeting } from "../models/CompanyConstitutionSettingConveningMeeting"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingConveningMeetingRepository extends Repository<CompanyConstitutionSettingConveningMeeting> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingConveningMeeting)
  }
}
