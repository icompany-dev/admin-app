import { CompanyShareAuthorization } from "../models/CompanyShareAuthorization"
import { Repository } from "./Repository"

export class CompanyShareAuthorizationRepository extends Repository<CompanyShareAuthorization> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyShareAuthorization)
  }
}
