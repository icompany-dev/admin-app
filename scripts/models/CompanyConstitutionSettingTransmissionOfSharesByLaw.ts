import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingTransmissionOfSharesByLaw extends CompanyConstitutionSettingItem {
  isInCapacitationTransferShare: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingTransmissionOfSharesByLaw) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isInCapacitationTransferShare = data.is_in_capacitation_transfer_share
  }

  cloneDetails(data: CompanyConstitutionSettingTransmissionOfSharesByLaw): void {
    super.clone(data)
    this.isInCapacitationTransferShare = data.isInCapacitationTransferShare
  }

  getRequestBody(): object {
    return {
      is_in_capacitation_transfer_share: this.isInCapacitationTransferShare,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
