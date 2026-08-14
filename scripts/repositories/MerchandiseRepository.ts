import { Merchandise } from "../models/Merchandise"
import { ApiRecord } from "~/scripts/library/ApiRecord"
import { Filter } from "~/scripts/library/Filter"
import { Repository } from "./Repository"

export class MerchandiseRepository extends Repository<Merchandise> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined,
    apiKey: string
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Merchandise, apiKey)
  }

  async byTags(tags: String[], filter: Filter): Promise<ApiRecord<Merchandise>> {
    try {
      const slug = filter.getSlug()
      const response = this.get<ApiRecord<Merchandise>>(
        `${this.singleResourceUrl}/by-tags?tags=${tags.join(",")}${slug ? "?" + slug : ""}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async byCategory(categoryId: String, filter: Filter): Promise<ApiRecord<Merchandise>> {
    try {
      const slug = filter.getSlug()
      const response = this.get<ApiRecord<Merchandise>>(
        `${this.singleResourceUrl}/by-category?category_id=${categoryId}${slug ? "?" + slug : ""}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async byCategoryTags(categoryId: String, tags: String[], filter: Filter): Promise<ApiRecord<Merchandise>> {
    try {
      const slug = filter.getSlug()
      const response = this.get<ApiRecord<Merchandise>>(
        `${this.singleResourceUrl}/by-category-tags?category_id=${categoryId}&tags=${tags.join(",")}${slug ? "?" + slug : ""}`
      )
      return response
    } catch (error) {
      throw error
    }
  }
}
