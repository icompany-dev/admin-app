import { CompanyPreferenceShareTerm } from "../models/CompanyPreferenceShareTerm"
import { Repository } from "./Repository"

export class CompanyPreferenceShareTermRepository extends Repository<CompanyPreferenceShareTerm> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyPreferenceShareTerm)
  }
}
