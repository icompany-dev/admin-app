import { ApiRecord } from "../library/ApiRecord"
import { Error } from "../library/Error"
import { Filter } from "../library/Filter"
import { Model } from "../models/Model"
import { TransactionHistory } from "../models/TransactionHistory"
import { Repository } from "./Repository"

//Note: This repository uses plain Model because it does not have the default CRUD actions
export class TransactionRepository extends Repository<Model> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Model)
  }

  override fetchAll<Model>(filter: Filter): Promise<ApiRecord<Model>> {
    throw new Error(Error.ERROR_TYPE_API, "endpoint not supported")
  }

  override fetch<Model>(id: any): Promise<Model> {
    throw new Error(Error.ERROR_TYPE_API, "endpoint not supported")
  }

  override store<Model>(data: any): Promise<Model> {
    throw new Error(Error.ERROR_TYPE_API, "endpoint not supported")
  }

  override update<Model>(id: any, data: any): Promise<Model> {
    throw new Error(Error.ERROR_TYPE_API, "endpoint not supported")
  }

  override remove<Model>(id: any): Promise<Model> {
    throw new Error(Error.ERROR_TYPE_API, "endpoint not supported")
  }

  async hasArchivedData(): Promise<any> {
    try {
      const response = this.get(`${this.resourceUrl}/has-archived-data`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchTransactionHistory(filter: Filter, year: number): Promise<ApiRecord<TransactionHistory>> {
    try {
      const slug: string = filter.getSlug()
      const response = this.get<ApiRecord<TransactionHistory>>(
        `${this.resourceUrl}/history?year=${year}${slug ? "&" + slug : ""}`
      )
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchByTarget(target: string, targetId: string): Promise<any> {
    try {
      const response = this.get(`${this.resourceUrl}/by-target?target=${target}&target_id=${targetId}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchInitialStoryline(): Promise<any> {
    try {
      const response = this.get(`${this.resourceUrl}/storyline/initial`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchServicesStoryline(year: number): Promise<any> {
    try {
      const response = this.get(`${this.resourceUrl}/storyline/services?year=${year}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchSignaturesStoryline(): Promise<any> {
    try {
      const response = this.get(`${this.resourceUrl}/storyline/signatures`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchPaymentsStoryline(): Promise<any> {
    try {
      const response = this.get(`${this.resourceUrl}/storyline/payments`)
      return response
    } catch (e) {
      throw e
    }
  }
}
