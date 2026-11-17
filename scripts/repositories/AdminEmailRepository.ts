import { AdminEmail } from "../models/AdminEmail"
import { Repository } from "./Repository"

export class AdminEmailRepository extends Repository<AdminEmail> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, AdminEmail)
  }

  async sendEmail(data: object): Promise<any> {
    try {
      let response = this.post(this.singleResourceUrl, data)

      return response
    } catch (e) {
      throw e
    }
  }
}
