import { CompanyConstitutionSettingInstrumentOfTransfer } from "../models/CompanyConstitutionSettingInstrumentOfTransfer"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingInstrumentOfTransferRepository extends Repository<CompanyConstitutionSettingInstrumentOfTransfer> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingInstrumentOfTransfer)
  }
}
