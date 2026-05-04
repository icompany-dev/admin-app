import { CompanyConstitutionSettingCapitalisationOfProfit } from "../models/CompanyConstitutionSettingCapitalisationOfProfit"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingCapitalisationOfProfitRepository extends Repository<CompanyConstitutionSettingCapitalisationOfProfit> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingCapitalisationOfProfit)
  }
}
