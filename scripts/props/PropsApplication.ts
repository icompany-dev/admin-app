export interface IPropsApplication {
  companyId: string
  applicationId: string | null
}

export class PropsApplication implements IPropsApplication {
  companyId: string
  applicationId: string | null = null

  constructor(companyId: string, applicationId: string | null = null) {
    this.companyId = companyId
    this.applicationId = applicationId
  }
}
