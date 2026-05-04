import type { Filter } from "../library/Filter"
import { Bank } from "../models/Bank"
import { Repository } from "./Repository"

export class BankRepository extends Repository<Bank> {
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
}
