import { CompanyConstitutionSettingScopeDutiesAuthority } from "../models/CompanyConstitutionSettingScopeDutiesAuthority"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingScopeDutiesAuthorityRepository extends Repository<CompanyConstitutionSettingScopeDutiesAuthority> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingScopeDutiesAuthority)
  }
}
