import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { Company } from "../models/Company"
import { Repository } from "./Repository"

export class CompanyRepository extends Repository<Company> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined,
    apiKey: string
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Company, apiKey)
  }

  override async fetchAll<Company>(filter: Filter): Promise<ApiRecord<Company>> {
    try {
      const slug = filter.getSlug()
      const rawResponse: any = await this.get(`/api/all-companies${slug ? "?" + slug : ""}`)
      const apiRecord = new ApiRecord<Company>(rawResponse, this.itemClassType as any)
      return apiRecord
    } catch (error) {
      throw error
    }
  }

  async fetchAllAdmin<Company>(filter: Filter): Promise<ApiRecord<Company>> {
    try {
      const slug = filter.getSlug()
      const rawResponse: any = await this.get(`/api/sdnbhds/all${slug ? "?" + slug : ""}`)
      const apiRecord = new ApiRecord<Company>(rawResponse, this.itemClassType as any)
      return apiRecord
    } catch (error) {
      throw error
    }
  }

  async isSwitched(id: string): Promise<object> {
    try {
      const response = this.get<object>(`${this.singleResourceUrl}/is-switched/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async canOpenBankAccount(id: string): Promise<object> {
    try {
      const response = this.get<object>(`/api/sanctioned-country/can-open-bank-account/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchCompact(slug: string | null = null): Promise<Company[]> {
    try {
      const response = this.get<Company[]>(`/api/compact-companies${slug !== null ? "?" + slug : ""}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async updateDetails(id: string, data: any): Promise<any> {
    try {
      const response = this.post<Company>(`${this.singleResourceUrl}/update/details/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchPublic(id: string): Promise<any> {
    try {
      const response = this.get<any>(`/api/public/company/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchStatisticsForAssignment(): Promise<any> {
    try {
      const response = this.get<any>(`/api/company/statistics-for-assignement`)
      return response
    } catch (error) {
      throw error
    }
  }
}
