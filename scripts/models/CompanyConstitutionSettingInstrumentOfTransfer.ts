import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingInstrumentOfTransfer extends CompanyConstitutionSettingItem {
  isShareTransferBySimpleMajority: boolean = true // default by act
  isShareTransferByMajorityNotLessThan: boolean = false
  minimumMajorityToApproveShareTransfer: number | null = null //cannot be null if above is true
  isShareTransferUnanimously: boolean = false
  isTransferorNameRemain: boolean = false
  hasTransfereeRights: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingInstrumentOfTransfer) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isShareTransferBySimpleMajority = data.is_by_simple_majority
    this.isShareTransferByMajorityNotLessThan = data.is_by_majority_not_less_than
    this.minimumMajorityToApproveShareTransfer = data.minimum_majority
    this.isShareTransferUnanimously = data.is_by_unanimously
    this.isTransferorNameRemain = data.is_transferor_name_remain
    this.hasTransfereeRights = data.has_transferee_rights
  }

  cloneDetails(data: CompanyConstitutionSettingInstrumentOfTransfer): void {
    super.clone(data)
    this.isShareTransferBySimpleMajority = data.isShareTransferBySimpleMajority
    this.isShareTransferByMajorityNotLessThan = data.isShareTransferByMajorityNotLessThan
    this.minimumMajorityToApproveShareTransfer = data.minimumMajorityToApproveShareTransfer
    this.isShareTransferUnanimously = data.isShareTransferUnanimously
    this.isTransferorNameRemain = data.isTransferorNameRemain
    this.hasTransfereeRights = data.hasTransfereeRights
  }

  getRequestBody(): object {
    return {
      is_by_simple_majority: this.isShareTransferBySimpleMajority,
      is_by_majority_not_less_than: this.isShareTransferByMajorityNotLessThan,
      minimum_majority: this.minimumMajorityToApproveShareTransfer,
      is_by_unanimously: this.isShareTransferUnanimously,
      is_transferor_name_remain: this.isTransferorNameRemain,
      has_transferee_rights: this.hasTransfereeRights,
    }
  }

  canSubmit(): boolean {
    if (this.isShareTransferByMajorityNotLessThan && this.minimumMajorityToApproveShareTransfer === null) {
      return false
    }

    return true
  }
}
