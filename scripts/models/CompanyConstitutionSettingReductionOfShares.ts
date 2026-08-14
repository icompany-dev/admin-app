import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingReductionOfShares extends CompanyConstitutionSettingItem {
  canReduceShareByViaSolvency: boolean = false
  canReduceShareByViaCourtMandate: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingReductionOfShares) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.canReduceShareByViaSolvency = data.is_by_via_solvency
    this.canReduceShareByViaCourtMandate = data.is_by_via_court_mandate
  }

  cloneDetails(data: CompanyConstitutionSettingReductionOfShares): void {
    super.clone(data)
    this.canReduceShareByViaSolvency = data.canReduceShareByViaSolvency
    this.canReduceShareByViaCourtMandate = data.canReduceShareByViaCourtMandate
  }

  getRequestBody(): object {
    return {
      is_by_via_solvency: this.canReduceShareByViaSolvency,
      is_by_via_court_mandate: this.canReduceShareByViaCourtMandate,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
