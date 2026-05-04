import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingPurposeOfCompany extends CompanyConstitutionSettingItem {
  haveFullCapacityUnderSection21: boolean = false
  hasSpecificBusinessActivities: boolean = false
  specificBusinessActivities: string[] = []

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingPurposeOfCompany) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.haveFullCapacityUnderSection21 = data.have_full_capacity
    this.hasSpecificBusinessActivities = data.has_specific_activities
    this.specificBusinessActivities = data.specific_activities ? data.specific_activities.split(",") : null
  }

  cloneDetails(data: CompanyConstitutionSettingPurposeOfCompany): void {
    super.clone(data)
    this.haveFullCapacityUnderSection21 = data.haveFullCapacityUnderSection21
    this.hasSpecificBusinessActivities = data.hasSpecificBusinessActivities
    this.specificBusinessActivities = data.specificBusinessActivities
  }

  getRequestBody(): object {
    return {
      have_full_capacity: this.haveFullCapacityUnderSection21,
      has_specific_activities: this.hasSpecificBusinessActivities,
      specific_activities: this.specificBusinessActivities,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
