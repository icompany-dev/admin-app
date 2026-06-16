import { HolidayNotification } from "../models/HolidayNotification"
import { Repository } from "./Repository"

export class HolidayNotificationRepository extends Repository<HolidayNotification> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, HolidayNotification)
  }
}
