import { CompanyMeetingAcknowledgement } from "../models/CompanyMeetingAcknowledgement"
import { Repository } from "./Repository"

export class CompanyMeetingAcknowledgementRepository extends Repository<CompanyMeetingAcknowledgement> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyMeetingAcknowledgement)
  }

  async fetchByMeetingIdShareholderId(meetingId: string, shareholderId: string): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/${meetingId}/shareholder?shareholder_id=${shareholderId}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchAllByMeetingId(meetingId: string): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/${meetingId}/all`)
      return response
    } catch (e) {
      throw e
    }
  }
}
