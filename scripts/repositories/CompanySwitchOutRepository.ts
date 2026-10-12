import { CompanySwitchOut } from "../models/CompanySwitchOut"
import { Repository } from "./Repository"

export class CompanySwitchOutRepository extends Repository<CompanySwitchOut> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanySwitchOut)
  }
}
