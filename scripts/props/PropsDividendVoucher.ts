export interface IPropsDividendVoucher {
  companyId: string
  applicationId: string
}

export class PropsDividendVoucher {
  companyId: string
  applicationId: string

  constructor(companyId: string, applicationId: string) {
    this.companyId = companyId
    this.applicationId = applicationId
  }
}
