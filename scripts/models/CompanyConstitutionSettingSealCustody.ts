import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingSealCustody extends CompanyConstitutionSettingItem {
  isKeptAtRegisteredOffice: boolean = false
  isKeptWithCosec: boolean = false
  isKeptAtOtherPlace: boolean = false
  canHaveDuplicate: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingSealCustody) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isKeptAtRegisteredOffice = data.is_kept_at_registered_office
    this.isKeptWithCosec = data.is_kept_with_cosec
    this.isKeptAtOtherPlace = data.is_kept_at_other_place
    this.canHaveDuplicate = data.can_have_duplicate
  }

  cloneDetails(data: CompanyConstitutionSettingSealCustody): void {
    super.clone(data)
    this.isKeptAtRegisteredOffice = data.isKeptAtRegisteredOffice
    this.isKeptWithCosec = data.isKeptWithCosec
    this.isKeptAtOtherPlace = data.isKeptAtOtherPlace
    this.canHaveDuplicate = data.canHaveDuplicate
  }

  getRequestBody(): object {
    return {
      is_kept_at_registered_office: this.isKeptAtRegisteredOffice,
      is_kept_with_cosec: this.isKeptWithCosec,
      is_kept_at_other_place: this.isKeptAtOtherPlace,
      can_have_duplicate: this.canHaveDuplicate,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
