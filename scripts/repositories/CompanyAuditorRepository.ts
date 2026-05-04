import { CompanyAuditor } from "../models/CompanyAuditor"
import { Repository } from "./Repository"

export class CompanyAuditorRepository extends Repository<CompanyAuditor> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAuditor)
  }
}
