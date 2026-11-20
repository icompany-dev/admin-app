import type { CompanyBank } from "../models/CompanyBank"

export interface IPropsCompanyBank {
  companyId: string
  companyBank: CompanyBank
}

export class PropsCompanyBank implements IPropsCompanyBank {
  companyId: string
  companyBank: CompanyBank

  constructor(companyId: string, companyBank: CompanyBank) {
    this.companyId = companyId
    this.companyBank = companyBank
  }
}
