import { ExternalApi } from "./ExternalApi"

export class SleekflowApi extends ExternalApi {
  constructor(baseUrl: string, apiKeyName: string | null, apiKeyValue: string | null) {
    super(baseUrl, apiKeyName, apiKeyValue, "application/json")
  }

  fetchConversationsFor(phoneNumber: string): Promise<any> {
    try {
      const response = this.get(`conversation/all?phoneNumber=${phoneNumber}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
