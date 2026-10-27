import type { CompanyBranch } from "../models/CompanyBranch"

export interface IPropsCompanyBranch {
  companyId: string
  companyBranch: CompanyBranch
}

export class PropsCompanyBranch implements IPropsCompanyBranch {
  companyId: string
  companyBranch: CompanyBranch

  constructor(companyId: string, companyBranch: CompanyBranch) {
    this.companyId = companyId
    this.companyBranch = companyBranch
  }
}
