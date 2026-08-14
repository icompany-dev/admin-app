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

  async submitted(incorporationId: string, data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/submitted/${incorporationId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async queried(incorporationId: string, data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/queried/${incorporationId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async resubmitted(incorporationId: string, data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/resubmitted/${incorporationId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async approved(incorporationId: string, data: object): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/approved/${incorporationId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async rejected(incorporationId: string, reason: string): Promise<any> {
    try {
      let data = {
        ssm_remarks_en: reason,
        ssm_remarks_bm: reason,
      }

      const response = this.post(`${this.singleResourceUrl}/rejected/${incorporationId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }
}
