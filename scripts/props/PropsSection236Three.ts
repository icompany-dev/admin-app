export interface IPropsSection236Three {
  companyName: string
  companyRegistrationNumberNew: string
  companyRegistrationNumberOld: string
}

export class PropsSection236Three implements IPropsSection236Three {
  companyName: string
  companyRegistrationNumberNew: string
  companyRegistrationNumberOld: string

  constructor(companyName: string, companyRegistrationNumberNew: string, companyRegistrationNumberOld: string) {
    this.companyName = companyName
    this.companyRegistrationNumberNew = companyRegistrationNumberNew
    this.companyRegistrationNumberOld = companyRegistrationNumberOld
  }
}
