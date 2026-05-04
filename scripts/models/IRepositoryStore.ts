import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"

export interface IRepositoryStore {
  fetchAll(filter: Filter): Promise<ApiRecord<any>>
  fetch(id: any): Promise<any>
  create(data: any): Promise<any>
  update(id: string, data: any): Promise<any>
  remove(id: string): Promise<any>
  ongoing(companyId: string): Promise<any>
  latestCompleted(companyId: string): Promise<any>
  error: any
}
