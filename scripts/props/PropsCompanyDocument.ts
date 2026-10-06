import type { Filter } from "../library/Filter"

export interface IPropsCompanyDocument {
  companyId: string
  filter: Filter
}

export class PropsCompanyDocument implements IPropsCompanyDocument {
  companyId: string
  filter: Filter

  constructor(companyId: string, filter: Filter) {
    this.companyId = companyId
    this.filter = filter
  }
}
