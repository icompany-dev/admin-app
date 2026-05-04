import { CompanyConstitutionSettingVotingAtBoard } from "../models/CompanyConstitutionSettingVotingAtBoard"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingVotingAtBoardRepository extends Repository<CompanyConstitutionSettingVotingAtBoard> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingVotingAtBoard)
  }
}
