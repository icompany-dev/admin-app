import { CompanyStrikingOffResolution } from "../models/CompanyStrikingOffResolution"
import { Repository } from "./Repository"

export class CompanyStrikingOffResolutionRepository extends Repository<CompanyStrikingOffResolution> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyStrikingOffResolution)
  }
}
