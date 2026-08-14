import { Product } from "../models/Product"
import { Repository } from "./Repository"

export class ProductRepository extends Repository<Product> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Product)
  }

  async byIds(ids: string[]): Promise<any> {
    if (ids.length <= 0) {
      return []
    }

    try {
      let idsString = ids.join(",")
      const response = await this.get<any>(`${this.singleResourceUrl}/by-ids?ids=${idsString}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async documentTemplates(): Promise<any> {
    try {
      const response = await this.get<any>(`${this.singleResourceUrl}/document-templates`)
      return response
    } catch (error) {
      throw error
    }
  }
}
