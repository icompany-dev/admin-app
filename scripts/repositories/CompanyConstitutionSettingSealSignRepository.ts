import { CompanyConstitutionSettingSealSign } from "../models/CompanyConstitutionSettingSealSign"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingSealSignRepository extends Repository<CompanyConstitutionSettingSealSign> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingSealSign)
  }
}
