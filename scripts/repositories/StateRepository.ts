import { State } from "../models/Location"
import { Repository } from "./Repository"

export class StateRepository extends Repository<State> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, State)
  }

  async byCountryId(countryId: number): Promise<State[]> {
    try {
      const response = this.get<State[]>(`${this.resourceUrl}/${countryId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
