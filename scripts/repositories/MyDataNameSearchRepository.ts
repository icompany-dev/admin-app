import { MyDataNameSearch } from "../models/MyDataNameSearch"
import { Repository } from "./Repository"

export class MyDataNameSearchRepository extends Repository<MyDataNameSearch> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, MyDataNameSearch)
  }

  async nameSearch(name: string): Promise<any> {
    try {
      const data = {
        name,
      }
      const response = this.post(this.singleResourceUrl, data)
      return response
    } catch (error) {
      throw error
    }
  }
}
