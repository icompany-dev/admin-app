import { Model } from "../models/Model"
import { Repository } from "./Repository"

export class AskSairaRepository extends Repository<Model> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined,
    apiKey: string
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Model, apiKey)
  }

  async runNameReservationWorkflow(inputAsText: string): Promise<any> {
    try {
      let data = {
        input_as_text: inputAsText,
      }
      const response: any = this.post(`${this.resourceUrl}/name-reservation`, data)
      return response
    } catch (e) {
      throw e
    }
  }
}
