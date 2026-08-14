import type { IModel } from "./IModel"
import _ from 'lodash'

export class CompanyNameFilter implements IModel<CompanyNameFilter> {
  id: string = ''
  keyword: string = ''
  type: string = ''
  description: string = ''
  canJoin: boolean = false
  restricted: boolean = false
  severity: number = 0
  metaData: any | null = null // Set to any because there is no specific format/type for now
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyNameFilter) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.keyword = data.keyword
    this.type = data.type
    this.description = data.description
    this.canJoin = data.can_joint === 1
    this.restricted = data.restricted === 1
    this.severity = data.severity
    this.metaData = data.meta_data ? _.cloneDeep(data.meta_data) : null
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: CompanyNameFilter): void {
    this.id = data.id
    this.keyword = data.keyword
    this.type = data.type
    this.description = data.description
    this.canJoin = data.canJoin
    this.restricted = data.restricted
    this.severity = data.severity
    this.metaData = data.metaData ? _.cloneDeep(data.metaData) : null
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {}
  }
}