export interface IPropsDataOrders {
  orderColumn: string
  sortOrder: string
}

export interface IPropsDataDateFilter {
  dateColumn: string
  startDate: string
  endDate: string
}

export interface IPropsTableFilter {
  isSearchable: boolean
  searchText: string
  hasOrderBy: boolean
  orderBys: IPropsDataOrders[]
  canFilterDateColumn: boolean
  dateFilter: IPropsDataDateFilter
  isMinimizedDisplay: boolean
}

export class PropsDataOrders {
  orderColumn: string
  sortOrder: string

  constructor(orderColumn: string, sortOrder: string) {
    this.orderColumn = orderColumn
    this.sortOrder = sortOrder
  }
}

export class PropsDataDateFilter {
  dateColumn: string
  startDate: string
  endDate: string

  constructor(dateColumn: string, startDate: string, endDate: string) {
    this.dateColumn = dateColumn
    this.startDate = startDate
    this.endDate = endDate
  }
}

export class PropsTableFilter implements IPropsTableFilter {
  isSearchable: boolean
  searchText: string
  hasOrderBy: boolean
  orderBys: PropsDataOrders[]
  canFilterDateColumn: boolean
  dateFilter: PropsDataDateFilter
  isMinimizedDisplay: boolean

  constructor(
    isSearchable: boolean,
    searchText: string,
    hasOrderBy: boolean,
    orderBys: PropsDataOrders[],
    canFilterDateColumn: boolean,
    dateFilter: PropsDataDateFilter,
    isMinimizedDisplay: boolean
  ) {
    this.isSearchable = isSearchable
    this.searchText = searchText
    this.hasOrderBy = hasOrderBy
    this.orderBys = orderBys
    this.canFilterDateColumn = canFilterDateColumn
    this.dateFilter = dateFilter
    this.isMinimizedDisplay = isMinimizedDisplay
  }
}
