import { CompanySecretary } from "../models/CompanySecretary"
import { Repository } from "./Repository"

export class CompanySecretaryRepository extends Repository<CompanySecretary> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanySecretary)
  }
}
