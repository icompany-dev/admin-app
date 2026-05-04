import { CompanyContractEnter } from "../models/CompanyContractEnter"
import { Repository } from "./Repository"

export class CompanyContractEnterRepository extends Repository<CompanyContractEnter> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyContractEnter)
  }
}
