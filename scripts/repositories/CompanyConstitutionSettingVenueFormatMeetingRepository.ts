import { CompanyConstitutionSettingVenueFormatMeeting } from "../models/CompanyConstitutionSettingVenueFormatMeeting"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingVenueFormatMeetingRepository extends Repository<CompanyConstitutionSettingVenueFormatMeeting> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingVenueFormatMeeting)
  }
}
