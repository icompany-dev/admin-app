import { CompanyPreferenceShareTermGovernance } from "../models/CompanyPreferenceShareTermGovernance"
import { Repository } from "./Repository"

export class CompanyPreferenceShareTermGovernanceRepository extends Repository<CompanyPreferenceShareTermGovernance> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyPreferenceShareTermGovernance)
  }
}
