import { ApplicationNameReservation } from "../models/ApplicationNameReservation"
import { Repository } from "./Repository"

export class ApplicationNameReservationRepository extends Repository<ApplicationNameReservation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, ApplicationNameReservation)
  }

  async approve(id: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/approved/${id}`, {})
      return response
    } catch (e) {
      throw e
    }
  }

  async reject(id: string, reason: string): Promise<any> {
    try {
      let data = {
        ssm_remarks_en: reason,
        ssm_remarks_bm: reason,
      }

      const response = this.post(`${this.singleResourceUrl}/rejected/${id}`, data)
      return response
    } catch (e) {
      throw e
    }
  }
}
