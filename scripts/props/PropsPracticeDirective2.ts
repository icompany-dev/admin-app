export interface IPropsPracticeDirective2 {
  companyId: string
  isAddingBusinessAddress: boolean
  isUpdatingBusinessAddress: boolean
  isRemovingBusinessAddress: boolean
  isAddingBranchAddress: boolean
  isUpdatingBranchAddress: boolean
  isRemovingBranchAddress: boolean
  isUpdatingNature: boolean
  addAddress: string | null
  addAddressEffectiveDate: string | null
  updateAddress: string | null
  updateAddressEffectiveDate: string | null
  removeAddress: string | null
  removeAddressEffectiveDate: string | null
}

export class PropsPracticeDirective2 implements IPropsPracticeDirective2 {
  companyId: string
  isAddingBusinessAddress: boolean = false
  isUpdatingBusinessAddress: boolean = false
  isRemovingBusinessAddress: boolean = false
  isAddingBranchAddress: boolean = false
  isUpdatingBranchAddress: boolean = false
  isRemovingBranchAddress: boolean = false
  isUpdatingNature: boolean = false
  addAddress: string | null = null
  addAddressEffectiveDate: string | null = null
  updateAddress: string | null = null
  updateAddressEffectiveDate: string | null = null
  removeAddress: string | null = null
  removeAddressEffectiveDate: string | null = null

  constructor(companyId: string) {
    this.companyId = companyId
  }
}
