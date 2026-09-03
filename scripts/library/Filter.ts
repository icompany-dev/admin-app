import { StringUtil } from "../utils/String"
import type { ApiRecord } from "./ApiRecord"

export class Filter {
  dayjs = useDayjs()

  searchText: string | null = null
  page: number = 1
  take: number = 10
  totalPages: number = 1
  totalRecords: number = 0
  takeAll: boolean = false

  orderBy: string | null = null
  sortOrder: string | null = null

  companyId: string | null = null

  dateColumn: string | null = null
  isIncludeMinutes: boolean = false
  startDate: string | null = null
  endDate: string | null = null

  includeDeleted: boolean = false
  includeTestAccount: boolean = false

  isUnassigned: boolean | null = null
  isWithoutSignatures: boolean | null = null
  isInactive: boolean | null = null

  statuses: string[] = []

  constructor() {
    this.takeAll = false
    this.orderBy = null
    this.sortOrder = null
  }

  canNextPage(): boolean {
    return this.page < this.totalPages
  }

  nextPage(): void {
    this.page = Math.min(this.page + 1, this.totalPages)
  }

  canPreviousPage(): boolean {
    return this.page > 1
  }

  previousPage(): void {
    this.page = Math.max(this.page - 1, 1)
  }

  setPage(page: number): void {
    this.page = page
  }

  getSlug(): string {
    const slugElements = []
    slugElements.push(`page=${this.page}&take=${this.take}&take_all=${this.takeAll ? "1" : "0"}`)

    if (this.searchText !== null && this.searchText.length > 0) {
      slugElements.push(`search_text=${encodeURIComponent(this.searchText)}`)
    }

    if (this.orderBy !== null) {
      slugElements.push(`order_by=${encodeURIComponent(this.orderBy)}`)
    }

    if (this.sortOrder !== null) {
      slugElements.push(`sort_order=${this.sortOrder}`)
    }

    if (this.companyId !== null && !StringUtil.isNullOrEmpty(this.companyId)) {
      slugElements.push(`company_id=${this.companyId}`)
    }

    if (this.dateColumn !== null) {
      slugElements.push(`by_date=${this.dateColumn}`)
    }

    if (this.startDate !== null) {
      let format = this.isIncludeMinutes ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"
      const date = this.dayjs(this.startDate).format(format)
      slugElements.push(`start_date=${date}`)
    }

    if (this.endDate !== null) {
      let format = this.isIncludeMinutes ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"
      const date = this.dayjs(this.endDate).format(format)
      slugElements.push(`end_date=${date}`)
    }

    if (this.isIncludeMinutes) {
      slugElements.push(`include_minutes=1`)
    }

    if (this.includeDeleted) {
      slugElements.push(`include_deleted=${this.includeDeleted ? "1" : "0"}`)
    }

    if (this.includeTestAccount) {
      slugElements.push(`include_test_account=${this.includeTestAccount ? "1" : "0"}`)
    }

    if (this.statuses.length > 0) {
      slugElements.push(`statuses=${this.statuses.join(",")}`)
    }

    if (this.isUnassigned !== null) {
      slugElements.push(`is_unassigned=${this.isUnassigned ? "1" : "0"}`)
    }

    if (this.isWithoutSignatures !== null) {
      slugElements.push(`is_without_signatures=${this.isWithoutSignatures ? "1" : "0"}`)
    }

    if (this.isInactive !== null) {
      slugElements.push(`is_inactive=${this.isInactive ? "1" : "0"}`)
    }

    return slugElements.join("&")
  }

  setDataFromApiRecord(apiRecord: ApiRecord<any>): void {
    this.totalRecords = apiRecord.totalRecords
    this.totalPages = apiRecord.totalPages
    this.page = apiRecord.page
  }
}
