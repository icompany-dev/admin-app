import { SearchCompliance } from "../models/SearchCompliance"
import { Repository } from "./Repository"

export class SearchComplianceRepository extends Repository<SearchCompliance> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, SearchCompliance)
  }

  async search(searchText: string): Promise<any> {
    try {
      const response = this.get(`${this.resourceUrl}?search_text=${searchText}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
