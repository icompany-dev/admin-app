export interface IPropsCompaniesDropdown {
  isMultipleSelect: boolean
  selectedCompanyIds: string[]
  placeholder: string
}

export class PropsCompaniesDropdown implements IPropsCompaniesDropdown {
  isMultipleSelect: boolean
  selectedCompanyIds: string[]
  placeholder: string

  constructor(isMultipleSelect: boolean, selectedCompanyIds: string[], placeholder: string) {
    this.isMultipleSelect = isMultipleSelect
    this.selectedCompanyIds = selectedCompanyIds
    this.placeholder = placeholder
  }
}
