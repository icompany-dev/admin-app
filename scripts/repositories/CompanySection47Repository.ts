import { CompanySection47 } from "../models/CompanySection47"
import { Repository } from "./Repository"

export class CompanySection47Repository extends Repository<CompanySection47> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanySection47)
  }
}
