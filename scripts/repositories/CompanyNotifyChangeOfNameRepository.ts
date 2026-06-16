import { CompanyNotifyChangeOfName } from "../models/CompanyNotifyChangeOfName"
import { Repository } from "./Repository"

export class CompanyNotifyChangeOfNameRepository extends Repository<CompanyNotifyChangeOfName> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyNotifyChangeOfName)
  }
}
