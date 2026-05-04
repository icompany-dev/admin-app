import { Model } from "../models/Model"
import { Repository } from "./Repository"

export class WiseAiRepository extends Repository<Model> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Model)
  }

  async getToken(): Promise<any> {
    try {
      const response = this.post<any>(`${this.resourceUrl}/get-token`, {})
      return response
    } catch (error) {
      throw error
    }
  }
}
