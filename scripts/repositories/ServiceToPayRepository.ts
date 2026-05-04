import { ServiceToPay } from "~/scripts/models/ServiceToPay"
import { Repository } from "./Repository"
import type { Filter } from "../library/Filter"
import { ApiRecord } from "../library/ApiRecord"

export class ServiceToPayRepository extends Repository<ServiceToPay> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, ServiceToPay)
  }

  override async fetchAll<ServiceToPay>(filter: Filter): Promise<ApiRecord<ServiceToPay>> {
    try {
      const slug = filter.getSlug()
      const rawResponse: any = await this.get(`${this.resourceUrl}${slug ? "?" + slug : ""}`)
      const apiRecord = new ApiRecord<ServiceToPay>(rawResponse, this.itemClassType as any)
      return apiRecord
    } catch (error) {
      throw error
    }
  }
}
