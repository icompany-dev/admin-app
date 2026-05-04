import { DirectorInvitation } from "../models/DirectorInvitation"
import { Repository } from "./Repository"

export class DirectorInvitationRepository extends Repository<DirectorInvitation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, DirectorInvitation)
  }

  async all(): Promise<any> {
    try {      
      const response = await this.get<any>(`${this.singleResourceUrl}/all`)
      return response
    } catch (error) {
      throw error
    }
  }

  async accept(id: string): Promise<any> {
    try {
      const response = await this.post<any>(`${this.singleResourceUrl}/accept/${id}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async reject(id: string, data: { reason?: string }): Promise<any> {
    try {
      const response = await this.post<any>(`${this.singleResourceUrl}/reject/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  }
}
