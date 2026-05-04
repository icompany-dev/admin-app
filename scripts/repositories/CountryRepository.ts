import { Country } from "../models/Location"
import { Repository } from "./Repository"

export class CountryRepository extends Repository<Country> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Country)
  }
}
