import { $fetch, type FetchOptions } from "ofetch"
import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { ResourceChecker } from "../library/ResourceChecker"

interface IRepositoryOptions {
  resourceUrl: string
  singleResourceUrl: string
}

export class Repository<T> implements IRepositoryOptions {
  resourceUrl: string
  singleResourceUrl: string
  protected api: typeof $fetch
  protected getAuthToken: () => string | null | undefined
  protected itemClassType: new (data: any) => T

  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseURL: string,
    getAuthToken: () => string | null | undefined,
    itemClassType: new (data: any) => T,
    apiKey: string | null = null
  ) {
    this.resourceUrl = `/api/${resourceUrl}`
    this.singleResourceUrl = `/api/${singleResourceUrl}`
    this.getAuthToken = getAuthToken
    this.itemClassType = itemClassType

    this.api = $fetch.create({
      baseURL: baseURL,
      onRequest({ request, options }) {
        if (!ResourceChecker.getInstance().checkConnectivity()) {
          throw new Error("OFFLINE_ERROR")
        }
        /// add further details here
        const authToken = getAuthToken()
        if (authToken) {
          options.headers.set("Authorization", `Bearer ${authToken}`)
        }

        if (!options.headers.get("Content-Type")) {
          options.headers.set("Content-Type", "application/json")
        }

        if (apiKey !== null) {
          options.headers.set("X-API-KEY", apiKey)
        }
      },
      onResponse({ request, response }) {
        /// add the details here
      },
      onResponseError({ request, response }) {
        /// add handler here
      },
    })
  }

  async get<R>(endpoint: string, options?: FetchOptions<any>): Promise<R> {
    return await this.api<R>(endpoint, { method: "GET", ...options })
  }

  async post<R>(endpoint: string, body: any, options?: FetchOptions<any>): Promise<R> {
    return await this.api<R>(endpoint, { method: "POST", body, ...options })
  }

  async put<R>(endpoint: string, body: any, options?: FetchOptions<any>): Promise<R> {
    return await this.api<R>(endpoint, { method: "PUT", body, ...options })
  }

  async delete<R>(endpoint: string, options?: FetchOptions<any>): Promise<R> {
    return await this.api<R>(endpoint, { method: "DELETE", ...options })
  }

  async fetchAll<T>(filter: Filter): Promise<ApiRecord<T>> {
    try {
      const slug = filter.getSlug()
      const rawResponse: any = await this.get(`${this.resourceUrl}${slug ? "?" + slug : ""}`)
      const apiRecord = new ApiRecord<T>(rawResponse, this.itemClassType as any)
      return apiRecord
    } catch (error) {
      throw error
    }
  }

  async fetch<T>(id: any): Promise<T> {
    try {
      const response = await this.get<any>(`${this.resourceUrl}/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async store<T>(data: any): Promise<T> {
    try {
      const response = await this.post<any>(this.resourceUrl, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async update<T>(id: any, data: any): Promise<T> {
    try {
      const response = await this.put<any>(`${this.resourceUrl}/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async remove<T>(id: any): Promise<T> {
    try {
      const response = await this.delete<any>(`${this.resourceUrl}/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async withdraw<T>(id: any): Promise<T> {
    try {
      const response = await this.post<any>(`${this.singleResourceUrl}/withdraw/${id}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async submit<T>(id: any): Promise<T> {
    try {
      const response = await this.post<any>(`${this.singleResourceUrl}/submit/${id}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async ship<T>(id: any, trackingNumber: string, trackingUrl: string): Promise<T> {
    try {
      let data = {
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
      }
      const response = await this.post<any>(`${this.singleResourceUrl}/ship/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async complete<T>(id: any): Promise<T> {
    try {
      const response = await this.post<any>(`${this.singleResourceUrl}/complete/${id}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async ongoing<T>(companyId: any): Promise<T> {
    try {
      const response = await this.get<any>(`${this.singleResourceUrl}/ongoing/${companyId}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async latestCompleted<T>(companyId: any): Promise<T> {
    try {
      const response = await this.get<any>(`${this.singleResourceUrl}/latest-completed/${companyId}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async latestApplication<T>(companyId: any): Promise<T> {
    try {
      const response = await this.get<any>(`${this.singleResourceUrl}/latest-application/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
