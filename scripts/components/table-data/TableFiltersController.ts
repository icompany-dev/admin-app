import { PropsTableFilter, PropsDataOrders } from "~/scripts/props/PropsTableFilter"

export class TableFiltersController {
  isSearchable: boolean = true
  searchText: string = ""
  hasOrderBy: boolean = false
  orderBys: PropsDataOrders[] = []
  canFilterDateColumn: boolean = false
  dateColumn: string = ""
  startDate: string = ""
  endDate: string = ""

  emitEvents: any | null = null

  constructor(props: PropsTableFilter, emitEvents: any) {
    this.setValuesFromProps(props)
    this.emitEvents = emitEvents
  }

  setValuesFromProps(props: PropsTableFilter): void {
    this.isSearchable = props.isSearchable
    this.searchText = props.searchText
    this.hasOrderBy = props.hasOrderBy
    this.orderBys = props.orderBys
    this.canFilterDateColumn = props.canFilterDateColumn
    if (props.dateFilter) {
      this.dateColumn = props.dateFilter.dateColumn
      this.startDate = props.dateFilter.startDate
      this.endDate = props.dateFilter.endDate
    }
  }
}
