import { CompanyDelegationOfAuthority } from "../models/CompanyDelegationOfAuthority"
import { Repository } from "./Repository"

export class CompanyDelegationOfAuthorityRepository extends Repository<CompanyDelegationOfAuthority> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyDelegationOfAuthority)
  }
}
