import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingRevocation extends CompanyConstitutionSettingItem {
  isByBoardSimpleMajority: boolean = false
  isInAccordanceToContract: boolean = false
  isByMcr: boolean = false
  isBySpecialMcr: boolean = false
  isAutomaticOnDirectorResigned: boolean = false
  isAutomaticOnDisqualification: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingRevocation) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isByBoardSimpleMajority = data.is_by_board_simple_majority
    this.isInAccordanceToContract = data.is_in_accordance_to_contract
    this.isByMcr = data.is_by_mcr
    this.isBySpecialMcr = data.is_by_special_mcr
    this.isAutomaticOnDirectorResigned = data.is_automatic_on_director_resigned
    this.isAutomaticOnDisqualification = data.is_automatic_on_disqualification
  }

  cloneDetails(data: CompanyConstitutionSettingRevocation): void {
    super.clone(data)
    this.isByBoardSimpleMajority = data.isByBoardSimpleMajority
    this.isInAccordanceToContract = data.isInAccordanceToContract
    this.isByMcr = data.isByMcr
    this.isBySpecialMcr = data.isBySpecialMcr
    this.isAutomaticOnDirectorResigned = data.isAutomaticOnDirectorResigned
    this.isAutomaticOnDisqualification = data.isAutomaticOnDisqualification
  }

  getRequestBody(): object {
    return {
      is_by_board_simple_majority: this.isByBoardSimpleMajority,
      is_in_accordance_to_contract: this.isInAccordanceToContract,
      is_by_mcr: this.isByMcr,
      is_by_special_mcr: this.isBySpecialMcr,
      is_automatic_on_director_resigned: this.isAutomaticOnDirectorResigned,
      is_automatic_on_disqualification: this.isAutomaticOnDisqualification,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
