import { CompanyConstitutionSettingRegisterTransfer } from "../models/CompanyConstitutionSettingRegisterTransfer"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingRegisterTransferRepository extends Repository<CompanyConstitutionSettingRegisterTransfer> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingRegisterTransfer)
  }
}
