import { CompanyConstitutionSettingNoticeOfMeeting } from "../models/CompanyConstitutionSettingNoticeOfMeeting"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingNoticeOfMeetingRepository extends Repository<CompanyConstitutionSettingNoticeOfMeeting> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingNoticeOfMeeting)
  }
}
