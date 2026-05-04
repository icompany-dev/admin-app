import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingVenueFormatMeeting extends CompanyConstitutionSettingItem {
  isFullyPhysical: boolean = false
  isHybrid: boolean = false
  isFullyVirtual: boolean = false
  isDeemedPresent: boolean = false
  isEntitledToSpeak: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingVenueFormatMeeting) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isFullyPhysical = data.is_fully_physical
    this.isHybrid = data.is_hybrid
    this.isFullyVirtual = data.is_fully_virtual
    this.isDeemedPresent = data.is_deemed_present
    this.isEntitledToSpeak = data.is_entitled_to_speak
  }

  cloneDetails(data: CompanyConstitutionSettingVenueFormatMeeting): void {
    super.clone(data)
    this.isFullyPhysical = data.isFullyPhysical
    this.isHybrid = data.isHybrid
    this.isFullyVirtual = data.isFullyVirtual
    this.isDeemedPresent = data.isDeemedPresent
    this.isEntitledToSpeak = data.isEntitledToSpeak
  }

  isMeetingVenuePhysical(): boolean {
    return !this.isHybrid && !this.isFullyVirtual
  }

  getRequestBody(): object {
    return {
      is_fully_physical: this.isFullyPhysical,
      is_hybrid: this.isHybrid,
      is_fully_virtual: this.isFullyVirtual,
      is_deemed_present: this.isDeemedPresent,
      is_entitled_to_speak: this.isEntitledToSpeak,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
