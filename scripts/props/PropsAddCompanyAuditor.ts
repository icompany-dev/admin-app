import { CompanyAuditor } from "../models/CompanyAuditor"

export interface IPropsAddCompanyAuditor {
  companyId: string
  auditor: CompanyAuditor
}

export class PropsAddCompanyAuditor {
  companyId: string
  auditor: CompanyAuditor

  constructor(companyId: string, auditor: CompanyAuditor) {
    this.companyId = companyId
    this.auditor = new CompanyAuditor(auditor)
  }
}
