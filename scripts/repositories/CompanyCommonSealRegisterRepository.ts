import { CompanyCommonSealRegister } from "../models/CompanyCommonSealRegister"
import { Repository } from "./Repository"

export class CompanyCommonSealRegisterRepository extends Repository<CompanyCommonSealRegister> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyCommonSealRegister)
  }
}
