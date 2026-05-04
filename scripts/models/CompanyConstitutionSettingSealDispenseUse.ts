import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingSealDispenseUse extends CompanyConstitutionSettingItem {
  canExecuteWithoutSeal: boolean = false
  isInAccordanceToLaw: boolean = false
  isHeldInPhysicalCustody: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingSealDispenseUse) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.canExecuteWithoutSeal = data.can_execute_without_seal
    this.isInAccordanceToLaw = data.is_in_accordance_to_law
    this.isHeldInPhysicalCustody = data.is_held_in_physical_custody
  }

  cloneDetails(data: CompanyConstitutionSettingSealDispenseUse): void {
    super.clone(data)
    this.canExecuteWithoutSeal = data.canExecuteWithoutSeal
    this.isInAccordanceToLaw = data.isInAccordanceToLaw
    this.isHeldInPhysicalCustody = data.isHeldInPhysicalCustody
  }

  getRequestBody(): object {
    return {
      can_execute_without_seal: this.canExecuteWithoutSeal,
      is_in_accordance_to_law: this.isInAccordanceToLaw,
      is_held_in_physical_custody: this.isHeldInPhysicalCustody,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
