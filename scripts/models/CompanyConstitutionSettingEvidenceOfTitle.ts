import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingEvidenceOfTitle extends CompanyConstitutionSettingItem {
  isRequiredToApprovedRegistration: boolean = false
  isRequiredInCompliance: boolean = false
  isRequiredToDeclineOrDelayRegistrationOfTransfer: boolean = false
  canElectToBeRegisteredAsHolder: boolean = false
  canElectToTransferShares: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingEvidenceOfTitle) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isRequiredToApprovedRegistration = data.is_required_to_approved_registration
    this.isRequiredInCompliance = data.is_required_in_compliance
    this.isRequiredToDeclineOrDelayRegistrationOfTransfer = data.is_required_to_decline_register
    this.canElectToBeRegisteredAsHolder = data.can_elect_to_be_registered_as_holder
    this.canElectToTransferShares = data.can_elect_to_transfer_shares
  }

  cloneDetails(data: CompanyConstitutionSettingEvidenceOfTitle): void {
    super.clone(data)
    this.isRequiredToApprovedRegistration = data.isRequiredToApprovedRegistration
    this.isRequiredInCompliance = data.isRequiredInCompliance
    this.isRequiredToDeclineOrDelayRegistrationOfTransfer = data.isRequiredToDeclineOrDelayRegistrationOfTransfer
    this.canElectToBeRegisteredAsHolder = data.canElectToBeRegisteredAsHolder
    this.canElectToTransferShares = data.canElectToTransferShares
  }

  getRequestBody(): object {
    return {
      is_required_to_approved_registration: this.isRequiredToApprovedRegistration,
      is_required_in_compliance: this.isRequiredInCompliance,
      is_required_to_decline_register: this.isRequiredToDeclineOrDelayRegistrationOfTransfer,
      can_elect_to_be_registered_as_holder: this.canElectToBeRegisteredAsHolder,
      can_elect_to_transfer_shares: this.canElectToTransferShares,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
