export interface IPropsAnnualReturnLodgement {
  companyId: string
  year: number
}

export class PropsAnnualReturnLodgement {
  companyId: string
  year: number

  constructor(companyId: string, year: number) {
    this.companyId = companyId
    this.year = year
  }
}
