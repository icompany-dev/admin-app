export interface IPropsApplication {
  companyId: string
}

export class PropsApplication implements IPropsApplication {
  companyId: string

  constructor(companyId: string) {
    this.companyId = companyId
  }
}
