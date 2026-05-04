import { CompanyConstitutionSettingItem } from "./CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingCasualVacanciesOfDirector extends CompanyConstitutionSettingItem {
  isAbleToAppointAnyoneDeemedFit: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingCasualVacanciesOfDirector) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isAbleToAppointAnyoneDeemedFit = data.is_able_to_appoint_anyone_deemed_fit
  }

  cloneDetails(data: CompanyConstitutionSettingCasualVacanciesOfDirector): void {
    super.clone(data)
    this.isAbleToAppointAnyoneDeemedFit = data.isAbleToAppointAnyoneDeemedFit
  }

  getRequestBody(): object {
    return {
      is_able_to_appoint_anyone_deemed_fit: this.isAbleToAppointAnyoneDeemedFit,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
