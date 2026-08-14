/**
 * NOTE: This library initializes the data needed for the company service
 *  - New Application: empty application
 *  - Existing Application: existing application, null if none
 *  - Past Applications: list of past applications, empty if none
 */

import { StatusConstants } from "../constants/Status"
import type { IRepositoryStore } from "../models/IRepositoryStore"
import { StringUtil } from "../utils/String"
import { Filter } from "./Filter"

export class CompanyServiceInitializer<T> {
  companyId: string = ""
  newApplication: T
  existingApplication: T | null = null
  pastApplications: T[] = []

  protected repository: IRepositoryStore
  protected itemClassType: new (data: any) => T

  constructor(companyId: string, itemClassType: new (data: any) => T, repository: IRepositoryStore) {
    this.companyId = companyId
    this.itemClassType = itemClassType
    this.repository = repository
    this.newApplication = new this.itemClassType(null)
  }

  async setExistingApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    let filter = new Filter()
    filter.companyId = this.companyId
    filter.statuses = [
      StatusConstants.PAID,
      StatusConstants.SUBMITTED,
      StatusConstants.APPROVED,
      StatusConstants.NAME_REJECTED,
      StatusConstants.RESPONDED,
      StatusConstants.ONGOING,
    ]
    filter.orderBy = "paid_at"
    filter.sortOrder = "desc"
    filter.take = 1

    // TODO: Change to this when all endpoints are ready with ongoing
    // let response = await this.repository.ongoing(this.companyId)

    let response = await this.repository.fetchAll(filter)
    if (this.repository.error !== null) {
      throw this.repository.error
    }

    if (response.data.length <= 0) {
      this.existingApplication = null
      return
    }

    this.existingApplication = new this.itemClassType(response.data[0])
  }

  async setPastApplications(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    let filter = new Filter()
    filter.companyId = this.companyId
    filter.statuses = [StatusConstants.CONVERTED, StatusConstants.COMPLETED]
    filter.orderBy = "deleted_at"
    filter.sortOrder = "desc"
    filter.includeDeleted = true
    filter.takeAll = true

    // TODO: Change to this when the endpoints for all past applications is ready
    // let response = await this.repository.pastApplications(this.companyId)

    let response = await this.repository.fetchAll(filter)
    if (this.repository.error !== null) {
      throw this.repository.error
    }

    this.pastApplications = response.data.map((d: any) => {
      return new this.itemClassType(d)
    })
  }
}
