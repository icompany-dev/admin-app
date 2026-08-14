import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingWindingUp extends CompanyConstitutionSettingItem {
  isBySpecialMcr: boolean = false
  isByPercentConsent: boolean = false
  isByUnanimousConsent: boolean = false
  canDivideAmongMembers: boolean = false
  canSellAnyPart: boolean = false
  isDistributionVary: boolean = false
  canVestAnyAssets: boolean = false
  hasPowerToCompromiseDebts: boolean = false
  hasPowerToContinueBusiness: boolean = false
  hasPowerToDistributeAssets: boolean = false
  isPriorityForSpecial: boolean = false
  isSubjectToSettlement: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingWindingUp) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isBySpecialMcr = data.is_by_special_mcr
    this.isByPercentConsent = data.is_by_percent_consent
    this.isByUnanimousConsent = data.is_by_unanimous_consent
    this.canDivideAmongMembers = data.can_divide_among_members
    this.canSellAnyPart = data.can_sell_any_part
    this.isDistributionVary = data.is_distribution_vary
    this.canVestAnyAssets = data.can_vest_any_assets
    this.hasPowerToCompromiseDebts = data.has_power_to_compromise_debts
    this.hasPowerToContinueBusiness = data.has_power_to_continue_business
    this.hasPowerToDistributeAssets = data.has_power_to_distribute_assets
    this.isPriorityForSpecial = data.is_priority_for_special
    this.isSubjectToSettlement = data.is_subject_to_settlement
  }

  cloneDetails(data: CompanyConstitutionSettingWindingUp): void {
    super.clone(data)
    this.isBySpecialMcr = data.isBySpecialMcr
    this.isByPercentConsent = data.isByPercentConsent
    this.isByUnanimousConsent = data.isByUnanimousConsent
    this.canDivideAmongMembers = data.canDivideAmongMembers
    this.canSellAnyPart = data.canSellAnyPart
    this.isDistributionVary = data.isDistributionVary
    this.canVestAnyAssets = data.canVestAnyAssets
    this.hasPowerToCompromiseDebts = data.hasPowerToCompromiseDebts
    this.hasPowerToContinueBusiness = data.hasPowerToContinueBusiness
    this.hasPowerToDistributeAssets = data.hasPowerToDistributeAssets
    this.isPriorityForSpecial = data.isPriorityForSpecial
    this.isSubjectToSettlement = data.isSubjectToSettlement
  }

  getRequestBody(): object {
    return {
      is_by_special_mcr: this.isBySpecialMcr,
      is_by_percent_consent: this.isByPercentConsent,
      is_by_unanimous_consent: this.isByUnanimousConsent,
      can_divide_among_members: this.canDivideAmongMembers,
      can_sell_any_part: this.canSellAnyPart,
      is_distribution_vary: this.isDistributionVary,
      can_vest_any_assets: this.canVestAnyAssets,
      has_power_to_compromise_debts: this.hasPowerToCompromiseDebts,
      has_power_to_continue_business: this.hasPowerToContinueBusiness,
      has_power_to_distribute_assets: this.hasPowerToDistributeAssets,
      is_priority_for_special: this.isPriorityForSpecial,
      is_subject_to_settlement: this.isSubjectToSettlement,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
