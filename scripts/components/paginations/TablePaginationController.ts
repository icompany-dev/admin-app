import { Filter } from "~/scripts/library/Filter"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"

export class TablePaginationController {
  filter = ref<Filter>(new Filter())

  emitEvents: any | null = null

  maxPageCount: number = 5

  language = useLanguage()

  constructor(props: PropsTablePagination, emitEvents: any) {
    this.setFilter(props.filter)
    this.emitEvents = emitEvents
  }

  setFilter(filter: Filter): void {
    this.filter.value = filter
  }

  onPageClicked(page: number): void {
    this.filter.value.page = page
    this.emitEvents("goToPage", this.filter.value.page)
  }

  onNextClicked(): void {
    if (!this.filter.value.canNextPage()) {
      return
    }

    this.filter.value.nextPage()
    this.emitEvents("goToPage", this.filter.value.page)
  }

  onPreviousClicked(): void {
    if (!this.filter.value.canPreviousPage()) {
      return
    }

    this.filter.value.previousPage()
    this.emitEvents("goToPage", this.filter.value.page)
  }

  get pageRanges(): number[] {
    if (this.filter.value.totalPages <= this.maxPageCount) {
      return Array.from({ length: this.filter.value.totalPages }, (_, i) => i)
    } else {
      let half = Math.floor(this.maxPageCount / 2)
      let startRange = Math.max(1, this.filter.value.page - half)
      let endRange = Math.min(startRange + this.maxPageCount, this.filter.value.totalPages)

      return Array.from({ length: this.maxPageCount }, (_, i) => i + startRange)
    }
  }

  get canNextPage(): boolean {
    return this.filter.value.canNextPage()
  }

  get canPreviousPage(): boolean {
    return this.filter.value.canPreviousPage()
  }

  get hasMorePrevious(): boolean {
    return this.pageRanges[0] > 1
  }

  get hasMoreNext(): boolean {
    return this.pageRanges[this.pageRanges.length - 1] < this.filter.value.totalPages
  }

  get previousLabel(): string {
    return this.language.isMalay() ? "Sebelum" : "Previous"
  }

  get nextLabel(): string {
    return this.language.isMalay() ? "Selepas" : "Next"
  }
}
