import { ExternalApi } from "./ExternalApi"

export class GoogleMapApi extends ExternalApi {
  constructor(baseUrl: string, apiKeyName: string | null, apiKeyValue: string | null) {
    super(baseUrl, apiKeyName, apiKeyValue, null)
  }

  async fetchCoordinates(addressString: string): Promise<any> {
    try {
      const response: any = await this.get(
        `https://maps.googleapis.com/maps/api/geocode/json?key=${this.apiKeyValue}&address=${encodeURIComponent(addressString)}`
      )
      return response
    } catch (error) {
      throw error
    }
  }
}
