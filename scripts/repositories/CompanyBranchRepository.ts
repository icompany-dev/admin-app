import { CompanyBranch } from "../models/CompanyBranch"
import { Repository } from "./Repository"

export class CompanyBranchRepository extends Repository<CompanyBranch> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyBranch)
  }
}
