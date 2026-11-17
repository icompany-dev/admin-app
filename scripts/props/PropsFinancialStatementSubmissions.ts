import type { Company } from "../models/Company"

export interface IPropsFinancialStatementSubmissions {
  companyId: string | null
  company: Company
  searchText: string | null
  startDate: string | null
  endDate: string | null
  isShowWithStatementOnly: boolean
  isShowPendingOnly: boolean
}

export class PropsFinancialStatementSubmissions implements IPropsFinancialStatementSubmissions {
  companyId: string | null
  company: Company
  searchText: string | null
  startDate: string | null
  endDate: string | null
  isShowWithStatementOnly: boolean
  isShowPendingOnly: boolean

  constructor(
    companyId: string | null,
    company: Company,
    searchText: string | null,
    startDate: string | null,
    endDate: string | null,
    isShowWithStatementOnly: boolean,
    isShowPendingOnly: boolean
  ) {
    this.companyId = companyId
    this.company = company
    this.searchText = searchText
    this.startDate = startDate
    this.endDate = endDate
    this.isShowWithStatementOnly = isShowWithStatementOnly
    this.isShowPendingOnly = isShowPendingOnly
  }
}
