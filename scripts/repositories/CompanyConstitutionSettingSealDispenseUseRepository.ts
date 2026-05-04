import { CompanyConstitutionSettingSealDispenseUse } from "../models/CompanyConstitutionSettingSealDispenseUse"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingSealDispenseUseRepository extends Repository<CompanyConstitutionSettingSealDispenseUse> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingSealDispenseUse)
  }
}
