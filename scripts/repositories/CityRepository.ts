import type { Filter } from "../library/Filter"
import { City } from "../models/Location"
import { Repository } from "./Repository"

export class CityRepository extends Repository<City> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, City)
  }

  async search(filter: Filter): Promise<City[]> {
    try {
      const slug = filter.getSlug()
      const response = this.get<City[]>(`${this.singleResourceUrl}/search${slug ? "?" + slug : ""}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async byStateId(stateId: number): Promise<City[]> {
    try {
      const response = this.get<City[]>(`${this.singleResourceUrl}/by-state?state_id=${stateId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
