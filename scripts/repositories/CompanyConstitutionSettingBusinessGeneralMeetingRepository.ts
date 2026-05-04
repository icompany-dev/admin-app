import { CompanyConstitutionSettingBusinessGeneralMeeting } from "../models/CompanyConstitutionSettingBusinessGeneralMeeting"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingBusinessGeneralMeetingRepository extends Repository<CompanyConstitutionSettingBusinessGeneralMeeting> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingBusinessGeneralMeeting)
  }
}
