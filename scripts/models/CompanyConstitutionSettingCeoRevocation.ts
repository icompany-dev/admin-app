import { CompanyConstitutionSettingItem } from "./CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingCeoRevocation extends CompanyConstitutionSettingItem {
  isByBoardSimpleMajority: boolean = false
  isInAccordanceToContract: boolean = false
  isByMembersResolution: boolean = false
  isAutomaticOnDirectorResigned: boolean = false
  isAutomaticOnDisqualification: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingCeoRevocation) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isByBoardSimpleMajority = data.is_by_board_simple_majority
    this.isInAccordanceToContract = data.is_in_accordance_to_contract
    this.isByMembersResolution = data.is_by_members_resolution
    this.isAutomaticOnDirectorResigned = data.is_automatic_on_director_resigned
    this.isAutomaticOnDisqualification = data.is_automatic_on_disqualification
  }

  cloneDetails(data: CompanyConstitutionSettingCeoRevocation): void {
    super.clone(data)
    this.isByBoardSimpleMajority = data.isByBoardSimpleMajority
    this.isInAccordanceToContract = data.isInAccordanceToContract
    this.isByMembersResolution = data.isByMembersResolution
    this.isAutomaticOnDirectorResigned = data.isAutomaticOnDirectorResigned
    this.isAutomaticOnDisqualification = data.isAutomaticOnDisqualification
  }

  getRequestBody(): object {
    return {
      is_by_board_simple_majority: this.isByBoardSimpleMajority,
      is_in_accordance_to_contract: this.isInAccordanceToContract,
      is_by_members_resolution: this.isByMembersResolution,
      is_automatic_on_director_resigned: this.isAutomaticOnDirectorResigned,
      is_automatic_on_disqualification: this.isAutomaticOnDisqualification,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
