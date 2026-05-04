import { $fetch, type FetchOptions } from "ofetch"

interface ExternalApiOptions {
  baseUrl: string
  apiKeyName: string | null
  apiKeyValue: string | null
}

export class ExternalApi implements ExternalApiOptions {
  baseUrl: string
  apiKeyName: string | null
  apiKeyValue: string | null
  protected api: typeof $fetch

  constructor(baseUrl: string, apiKeyName: string | null, apiKeyValue: string | null, contentType: string | null) {
    this.baseUrl = baseUrl
    this.apiKeyName = apiKeyName
    this.apiKeyValue = apiKeyValue
    this.api = $fetch.create({
      baseURL: baseUrl,
      onRequest({ request, options }) {
        if (apiKeyName && apiKeyValue) {
          options.headers.set(apiKeyName, apiKeyValue)
        }

        // NOTE: Only set content type if needed
        if (contentType) {
          options.headers.set("Content-Type", contentType)
        }
      },
    })
  }

  async get(endpoint: string, options?: FetchOptions<any>): Promise<any> {
    return await this.api(endpoint, { method: "GET", ...options })
  }

  async post(endpoint: string, body: any, options?: FetchOptions<any>): Promise<any> {
    return await this.api(endpoint, { method: "POST", body, ...options })
  }

  async put(endpoint: string, body: any, options?: FetchOptions<any>): Promise<any> {
    return await this.api(endpoint, { method: "PUT", body, ...options })
  }

  async delete(endpoint: string, options?: FetchOptions<any>): Promise<any> {
    return await this.api(endpoint, { method: "DELETE", ...options })
  }
}
