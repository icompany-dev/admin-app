import { UserInvitation } from "../models/UserInvitation"
import { Repository } from "./Repository"

export class UserInvitationRepository extends Repository<UserInvitation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, UserInvitation)
  }

  async fetchByUserId(userId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/${userId}`)
      return response
    } catch (e: any) {
      throw e
    }
  }

  async accept(id: string): Promise<any> {
    try {
      let data = {
        invitation_id: id,
      }
      const response = this.post(`${this.singleResourceUrl}/accept`, data)
      return response
    } catch (e: any) {
      throw e
    }
  }

  async reject(id: string): Promise<any> {
    try {
      let data = {
        invitation_id: id,
      }
      const response = this.post(`${this.singleResourceUrl}/reject`, data)
      return response
    } catch (e: any) {
      throw e
    }
  }
}
