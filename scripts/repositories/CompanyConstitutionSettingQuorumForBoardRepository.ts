import { CompanyConstitutionSettingQuorumForBoard } from "../models/CompanyConstitutionSettingQuorumForBoard"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingQuorumForBoardRepository extends Repository<CompanyConstitutionSettingQuorumForBoard> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingQuorumForBoard)
  }
}
