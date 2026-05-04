import { Filter } from "~/scripts/library/Filter"

export interface IPropsTablePagination {
  filter: Filter
}

export class PropsTablePagination implements IPropsTablePagination {
  filter: Filter = new Filter()

  constructor(filter: Filter) {
    this.filter = new Filter()
    this.filter.page = filter.page
    this.filter.totalRecords = filter.totalRecords
    this.filter.totalPages = filter.totalPages
  }
}
