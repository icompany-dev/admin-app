import { Filter } from "../library/Filter"
import { CompanyAmendmentName } from "../models/CompanyAmendmentName"
import { Repository } from "./Repository"

export class CompanyAmendmentNameRepository extends Repository<CompanyAmendmentName> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAmendmentName)
  }
}
