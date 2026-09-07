export interface IPropsAddCompanyAuditor {
  companyId: string
}

export class PropsAddCompanyAuditor {
  companyId: string

  constructor(companyId: string) {
    this.companyId = companyId
  }
}
