import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { AuditorPartner } from "../models/AuditorPartner"
import { Repository } from "./Repository"

export class AuditorPartnerRepository extends Repository<AuditorPartner> {
  private readonly CACHE_KEY_PREFIX = "auditor_partners_"
  private readonly ONE_DAY_MS = 24 * 60 * 60 * 1000

  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, AuditorPartner)
  }

  override async fetchAll<AuditorPartner>(filter: Filter): Promise<ApiRecord<AuditorPartner>> {
    try {
      const slug = `?${filter.getSlug()}`
      const storageKey = `${this.CACHE_KEY_PREFIX}${slug}`

      const cachedData = this.getWithExpiry(storageKey)

      if (cachedData) {
        return new ApiRecord<AuditorPartner>(cachedData, this.itemClassType as any)
      }

      const rawResponse: any = await this.get(`/api/auditor/all-partners${slug}`)

      try {
        this.setWithExpiry(storageKey, rawResponse)
      } catch (storageError: any) {
        if (storageError.name === "QuotaExceededError" || storageError.code === 22) {
          console.warn("Cache quota full. Purging old auditor_partners keys...")

          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(this.CACHE_KEY_PREFIX)) {
              localStorage.removeItem(key)
            }
          })

          try {
            this.setWithExpiry(storageKey, rawResponse)
          } catch (_) {
            console.error("Payload too large for localStorage even after purge. Skipping cache.")
          }
        } else {
          throw storageError
        }
      }

      const apiRecord = new ApiRecord<AuditorPartner>(rawResponse, this.itemClassType as any)
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
