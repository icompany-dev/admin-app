export interface IPropsApplication {
  companyId: string
  applicationId: string | null
  canCompleteService: boolean
}

export class PropsApplication implements IPropsApplication {
  companyId: string
  applicationId: string | null = null
  canCompleteService: boolean = false

  constructor(companyId: string, applicationId: string | null = null) {
    this.companyId = companyId
    this.applicationId = applicationId
  }
}
