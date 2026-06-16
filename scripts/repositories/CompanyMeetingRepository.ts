import { CompanyMeeting } from "../models/CompanyMeeting"
import { Repository } from "./Repository"

export class CompanyMeetingRepository extends Repository<CompanyMeeting> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyMeeting)
  }
}
