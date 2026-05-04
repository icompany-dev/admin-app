import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingSealSign extends CompanyConstitutionSettingItem {
  requireTwoDirectors: boolean = false
  requireDirectorCosec: boolean = false
  requireOneDirector: boolean = false
  requireDirectorAuthorisedPerson: boolean = false
  requireOtherAppointedPerson: boolean = false
  isAppointedAsManagingDirector: boolean = false
  isForSpecificDocument: boolean = false
  isForTimePeriod: boolean = false
  isAsBoardWish: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingSealSign) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.requireTwoDirectors = data.require_two_directors
    this.requireOneDirector = data.require_director_cosec
    this.requireDirectorCosec = data.require_one_director
    this.requireDirectorAuthorisedPerson = data.require_director_authorised_person
    this.requireOtherAppointedPerson = data.require_other_appointed_person
    this.isAppointedAsManagingDirector = data.is_appointed_as_managing_director
    this.isForSpecificDocument = data.is_for_specific_document
    this.isForTimePeriod = data.is_for_time_period
    this.isAsBoardWish = data.is_as_board_wish
  }

  cloneDetails(data: CompanyConstitutionSettingSealSign): void {
    super.clone(data)
    this.requireTwoDirectors = data.requireTwoDirectors
    this.requireOneDirector = data.requireOneDirector
    this.requireDirectorCosec = data.requireDirectorCosec
    this.requireDirectorAuthorisedPerson = data.requireDirectorAuthorisedPerson
    this.requireOtherAppointedPerson = data.requireOtherAppointedPerson
    this.isAppointedAsManagingDirector = data.isAppointedAsManagingDirector
    this.isForSpecificDocument = data.isForSpecificDocument
    this.isForTimePeriod = data.isForTimePeriod
    this.isAsBoardWish = data.isAsBoardWish
  }

  getRequestBody(): object {
    return {
      require_two_directors: this.requireTwoDirectors,
      require_director_cosec: this.requireOneDirector,
      require_one_director: this.requireDirectorCosec,
      require_director_authorised_person: this.requireDirectorAuthorisedPerson,
      require_other_appointed_person: this.requireOtherAppointedPerson,
      is_appointed_as_managing_director: this.isAppointedAsManagingDirector,
      is_for_specific_document: this.isForSpecificDocument,
      is_for_time_period: this.isForTimePeriod,
      is_as_board_wish: this.isAsBoardWish,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
