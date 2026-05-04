import { MagicLink } from "../models/MagicLink"
import { Repository } from "./Repository"

export class MagicLinkRepository extends Repository<MagicLink> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, MagicLink)
  }

  override async fetch(id: string): Promise<any> {
    try {
      const response = await this.get<any>(`${this.resourceUrl}/${id}?claim=true`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
