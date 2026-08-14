import type { Filter } from "../library/Filter"
import { Bank } from "../models/Bank"
import { Repository } from "./Repository"
import { ApiRecord } from "../library/ApiRecord"

export class BankRepository extends Repository<Bank> {
  private readonly CACHE_KEY_PREFIX = "banks_"
  private readonly ONE_DAY_MS = 24 * 60 * 60 * 1000

  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Bank)
  }

  async forCompany(filter: Filter): Promise<any> {
    try {
      const slug = `?${filter.getSlug()}`
      const response = await this.get<any>(`${this.singleResourceUrl}/for-company${slug}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async hasOngoing(companyId: string, bankId: string): Promise<any> {
    try {
      const slug = `?company_id=${companyId}&bank_id=${bankId}`
      const response = await this.get<any>(`${this.singleResourceUrl}/has-ongoing${slug}`)
      return response
    } catch (error) {
      throw error
    }
  }

  override async fetchAll<Bank>(filter: Filter): Promise<ApiRecord<Bank>> {
    try {
      const slug = filter.getSlug()
      const storageKey = `${this.CACHE_KEY_PREFIX}${slug}`

      const cachedData = this.getWithExpiry(storageKey)

      if (cachedData) {
        return new ApiRecord<Bank>(cachedData, this.itemClassType as any)
      }

      const rawResponse: any = await this.get(`${this.resourceUrl}${slug ? "?" + slug : ""}`)

      this.setWithExpiry(storageKey, rawResponse)

      const apiRecord = new ApiRecord<Bank>(rawResponse, this.itemClassType as any)
      return apiRecord
    } catch (error) {
      throw error
    }
  }

  private setWithExpiry(key: string, value: any) {
    const item = {
      data: value,
      expiry: Date.now() + this.ONE_DAY_MS,
    }
    localStorage.setItem(key, JSON.stringify(item))
  }

  private getWithExpiry(key: string): any | null {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) return null

    const item = JSON.parse(itemStr)
    const now = Date.now()

    if (now > item.expiry) {
      localStorage.removeItem(key)
      return null
    }
    return item.data
  }
}
