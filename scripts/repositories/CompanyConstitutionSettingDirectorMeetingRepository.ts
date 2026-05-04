import { CompanyConstitutionSettingDirectorMeeting } from "../models/CompanyConstitutionSettingDirectorMeeting"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingDirectorMeetingRepository extends Repository<CompanyConstitutionSettingDirectorMeeting> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingDirectorMeeting)
  }
}
