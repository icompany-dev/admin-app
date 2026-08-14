import type { Filter } from "../library/Filter"
import { PostcodeMapping } from "../models/Location"
import { Repository } from "./Repository"

export class PostcodeRepository extends Repository<PostcodeMapping> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, PostcodeMapping)
  }

  async search(filter: Filter): Promise<any> {
    try {
      const slug = filter.getSlug()
      const response = this.get<any>(`${this.singleResourceUrl}/search${slug ? "?" + slug : ""}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async byCityId(cityId: number): Promise<PostcodeMapping[]> {
    try {
      const response = this.get<PostcodeMapping[]>(`${this.singleResourceUrl}/by-city?city_id=${cityId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
