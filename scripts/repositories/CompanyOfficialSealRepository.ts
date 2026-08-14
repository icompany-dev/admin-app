import { CompanyOfficialSeal } from "../models/CompanyOfficialSeal"
import { Repository } from "./Repository"

export class CompanyOfficialSealRepository extends Repository<CompanyOfficialSeal> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyOfficialSeal)
  }
}
