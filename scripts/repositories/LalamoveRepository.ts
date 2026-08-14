import { DeliveryData, DeliveryDataDetailsStops } from "../models/DeliveryData"
import { Repository } from "./Repository"

export class LalamoveRepository extends Repository<DeliveryData> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, DeliveryData)
  }

  async rates(scheduleAt: string, from: DeliveryDataDetailsStops, to: DeliveryDataDetailsStops): Promise<DeliveryData> {
    try {
      const data = {
        provider: "lalamove",
        form: {
          schedule_at: scheduleAt,
          stops: [from.getRequestBody(), to.getRequestBody()],
          item_categories: ["OFFICE_ITEM"],
          handling_instructions: ["KEEP_UPRIGHT", "FRAGILE"],
        },
      }
      const response: any = await this.post<any>(`${this.singleResourceUrl}/rates`, data)
      return new DeliveryData(response.data[0] ?? null)
    } catch (error) {
      throw error
    }
  }
}
