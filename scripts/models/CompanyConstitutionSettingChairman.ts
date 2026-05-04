import { CompanyConstitutionSettingItem } from "./CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingChairman extends CompanyConstitutionSettingItem {
  canElectOneFromDirectors: boolean = false
  isAppointBySimpleMajority: boolean = false
  isAppointUnanimously: boolean = false
  isChairmanNonExecutive: boolean = false
  isChairmanNotManagingDirector: boolean = false
  isChairmanIndependent: boolean = false
  hasChairmanNoVote: boolean = true
  hasChairmanVote: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingChairman) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.canElectOneFromDirectors = data.can_elect_one_from_directors
    this.isAppointBySimpleMajority = data.is_appoint_by_simple_majority
    this.isAppointUnanimously = data.is_appoint_unanimously
    this.isChairmanNonExecutive = data.is_chairman_non_executive
    this.isChairmanNotManagingDirector = data.is_chairman_not_managing_director
    this.isChairmanIndependent = data.is_chairman_independent
    this.hasChairmanNoVote = data.has_chairman_no_vote
    this.hasChairmanVote = data.has_chairman_vote
  }

  cloneDetails(data: CompanyConstitutionSettingChairman): void {
    super.clone(data)
    this.canElectOneFromDirectors = data.canElectOneFromDirectors
    this.isAppointBySimpleMajority = data.isAppointBySimpleMajority
    this.isAppointUnanimously = data.isAppointUnanimously
    this.isChairmanNonExecutive = data.isChairmanNonExecutive
    this.isChairmanNotManagingDirector = data.isChairmanNotManagingDirector
    this.isChairmanIndependent = data.isChairmanIndependent
    this.hasChairmanNoVote = data.hasChairmanNoVote
    this.hasChairmanVote = data.hasChairmanVote
  }

  getRequestBody(): object {
    return {
      can_elect_one_from_directors: this.canElectOneFromDirectors,
      is_appoint_by_simple_majority: this.isAppointBySimpleMajority,
      is_appoint_unanimously: this.isAppointUnanimously,
      is_chairman_non_executive: this.isChairmanNonExecutive,
      is_chairman_not_managing_director: this.isChairmanNotManagingDirector,
      is_chairman_independent: this.isChairmanIndependent,
      has_chairman_no_vote: this.hasChairmanNoVote,
      has_chairman_vote: this.hasChairmanVote,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
