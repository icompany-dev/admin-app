import { CompanySetting } from "../models/CompanySetting"
import { Repository } from "./Repository"

export class CompanySettingRepository extends Repository<CompanySetting> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanySetting)
  }
}
