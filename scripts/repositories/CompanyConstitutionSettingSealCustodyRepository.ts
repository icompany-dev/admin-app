import { CompanyConstitutionSettingSealCustody } from "../models/CompanyConstitutionSettingSealCustody"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingSealCustodyRepository extends Repository<CompanyConstitutionSettingSealCustody> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingSealCustody)
  }
}
