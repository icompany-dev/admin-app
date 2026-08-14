import { CompanyConstitutionSettingSealAuthority } from "../models/CompanyConstitutionSettingSealAuthority"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingSealAuthorityRepository extends Repository<CompanyConstitutionSettingSealAuthority> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingSealAuthority)
  }
}
