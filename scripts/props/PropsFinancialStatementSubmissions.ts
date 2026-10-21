export interface IPropsFinancialStatementSubmissions {
  searchText: string | null
  startDate: string | null
  endDate: string | null
  isShowWithStatementOnly: boolean
  isShowPendingOnly: boolean
}

export class PropsFinancialStatementSubmissions implements IPropsFinancialStatementSubmissions {
  searchText: string | null
  startDate: string | null
  endDate: string | null
  isShowWithStatementOnly: boolean
  isShowPendingOnly: boolean

  constructor(
    searchText: string | null,
    startDate: string | null,
    endDate: string | null,
    isShowWithStatementOnly: boolean,
    isShowPendingOnly: boolean
  ) {
    this.searchText = searchText
    this.startDate = startDate
    this.endDate = endDate
    this.isShowWithStatementOnly = isShowWithStatementOnly
    this.isShowPendingOnly = isShowPendingOnly
  }
}
