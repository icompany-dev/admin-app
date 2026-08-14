import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingWrittenDcr extends CompanyConstitutionSettingItem {
  isPassedWithSimpleMajority: boolean = false
  isPassedWith75Percent: boolean = false
  isPassedWithOthers: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingWrittenDcr) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isPassedWithSimpleMajority = data.is_passed_with_simple_majority
    this.isPassedWith75Percent = data.is_passed_with_percent
    this.isPassedWithOthers = data.is_passed_with_others
  }

  cloneDetails(data: CompanyConstitutionSettingWrittenDcr): void {
    super.clone(data)
    this.isPassedWithSimpleMajority = data.isPassedWithSimpleMajority
    this.isPassedWith75Percent = data.isPassedWith75Percent
    this.isPassedWithOthers = data.isPassedWithOthers
  }

  getRequestBody(): object {
    return {
      is_passed_with_simple_majority: this.isPassedWithSimpleMajority,
      is_passed_with_percent: this.isPassedWith75Percent,
      is_passed_with_others: this.isPassedWithOthers,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
