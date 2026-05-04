import { CompanyConstitutionSettingItem } from "./CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingCeo extends CompanyConstitutionSettingItem {
  canBoardAppoint: boolean = false
  isAppointBySimpleMajority: boolean = false
  isAppointByMcr: boolean = false
  isAppointBySpecialMcr: boolean = false
  isAppointByUnanimousConsent: boolean = false
  isTermPeriodByBoard: boolean = false
  isTermPeriodByContract: boolean = false
  isTermPeriodByRegulation: boolean = false
  shouldBeUpdatedAsManager: boolean = false
  shouldBeAppointedAsDirector: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingCeo) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.canBoardAppoint = data.can_board_appoint
    this.isAppointBySimpleMajority = data.is_appoint_by_simple_majority
    this.isAppointByMcr = data.is_appoint_by_mcr
    this.isAppointBySpecialMcr = data.is_appoint_by_special_mcr
    this.isAppointByUnanimousConsent = data.is_appoint_by_unanimous_consent
    this.isTermPeriodByBoard = data.is_term_period_by_board
    this.isTermPeriodByContract = data.is_term_period_by_contract
    this.isTermPeriodByRegulation = data.is_term_period_by_regulation
    this.shouldBeUpdatedAsManager = data.should_be_updated_as_manager
    this.shouldBeAppointedAsDirector = data.should_be_appointed_as_director
  }

  cloneDetails(data: CompanyConstitutionSettingCeo): void {
    super.clone(data)
    this.canBoardAppoint = data.canBoardAppoint
    this.isAppointBySimpleMajority = data.isAppointBySimpleMajority
    this.isAppointByMcr = data.isAppointByMcr
    this.isAppointBySpecialMcr = data.isAppointBySpecialMcr
    this.isAppointByUnanimousConsent = data.isAppointByUnanimousConsent
    this.isTermPeriodByBoard = data.isTermPeriodByBoard
    this.isTermPeriodByContract = data.isTermPeriodByContract
    this.isTermPeriodByRegulation = data.isTermPeriodByRegulation
    this.shouldBeUpdatedAsManager = data.shouldBeUpdatedAsManager
    this.shouldBeAppointedAsDirector = data.shouldBeAppointedAsDirector
  }

  getRequestBody(): object {
    return {
      can_board_appoint: this.canBoardAppoint,
      is_appoint_by_simple_majority: this.isAppointBySimpleMajority,
      is_appoint_by_mcr: this.isAppointByMcr,
      is_appoint_by_special_mcr: this.isAppointBySpecialMcr,
      is_appoint_by_unanimous_consent: this.isAppointByUnanimousConsent,
      is_term_period_by_board: this.isTermPeriodByBoard,
      is_term_period_by_contract: this.isTermPeriodByContract,
      is_term_period_by_regulation: this.isTermPeriodByRegulation,
      should_be_updated_as_manager: this.shouldBeUpdatedAsManager,
      should_be_appointed_as_director: this.shouldBeAppointedAsDirector,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
