import { CompanyOutstanding } from "../models/CompanyOutstanding"
import { Repository } from "./Repository"

export class CompanyOutstandingRepository extends Repository<CompanyOutstanding> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyOutstanding)
  }
}
