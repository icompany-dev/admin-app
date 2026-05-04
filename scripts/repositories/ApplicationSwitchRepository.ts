import { ApplicationSwitch } from "../models/ApplicationSwitch"
import { Repository } from "./Repository"

export class ApplicationSwitchRepository extends Repository<ApplicationSwitch> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, ApplicationSwitch)
  }

  // This method uses the old indexed endpoints - must update when the new endpoint is added
  async fetchAllOld(slug: string | null): Promise<any> {
    try {
      const response = this.get(`${this.resourceUrl}${slug ? "?" + slug : ""}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchProgress(id: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/progress/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async sendEmailToPreviousCosec(id: string, fileId: string): Promise<any> {
    try {
      let data = {
        file_id: fileId,
      }
      const response = this.post(`${this.singleResourceUrl}/email-previous-cosec/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async ongoingApplication(): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/ongoing`)
      return response
    } catch (error) {
      throw error
    }
  }
}
