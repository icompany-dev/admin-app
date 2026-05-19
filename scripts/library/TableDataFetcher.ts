import type { IRepositoryStore } from "../models/IRepositoryStore"
import { Filter } from "~/scripts/library/Filter"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"

export class TableDataFetcher<T> {
  data: T[] = []
  itemClassType: new (data: any) => T
  repository: IRepositoryStore

  filter: Filter = new Filter()
  isLoading: boolean = false

  constructor(itemClassType: new (data: any) => T, repository: IRepositoryStore) {
    this.itemClassType = itemClassType
    this.repository = repository
  }

  async fetchData(): Promise<void> {
    if (this.isLoading) {
      return
    }

    try {
      this.isLoading = true

      let response = await this.repository.fetchAll(this.filter)

      if (this.repository.error !== null) {
        throw this.repository.error
      }

      this.data = response.data.map((c: any) => {
        return new this.itemClassType(c)
      })

      this.filter.setDataFromApiRecord(response)
    } catch (e) {
      let error = new Error()
      error.setForFetchAll()
      error.handle()
    } finally {
      this.isLoading = false
    }
  }

  async goToPage(page: number): Promise<void> {
    this.filter.page = page
    await this.fetchData()
  }

  get dataOnPage(): T[] {
    let startIndex = (this.filter.page - 1) * this.filter.take
    let endIndex = startIndex + this.filter.take

    return this.data.slice(startIndex, endIndex)
  }

  get tablePaginationProps(): PropsTablePagination {
    return new PropsTablePagination(this.filter)
  }
}
