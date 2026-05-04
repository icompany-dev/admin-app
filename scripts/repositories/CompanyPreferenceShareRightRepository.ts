import { CompanyPreferenceShareRight } from "../models/CompanyPreferenceShareRight"
import { Repository } from "./Repository"

export class CompanyPreferenceShareRightRepository extends Repository<CompanyPreferenceShareRight> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyPreferenceShareRight)
  }
}
