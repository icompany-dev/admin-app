import { CompanyCommonSealReplacement } from "../models/CompanyCommonSealReplacement"
import { Repository } from "./Repository"

export class CompanyCommonSealReplacementRepository extends Repository<CompanyCommonSealReplacement> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyCommonSealReplacement)
  }
}
