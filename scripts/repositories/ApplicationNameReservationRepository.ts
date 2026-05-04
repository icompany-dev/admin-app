import { ApplicationNameReservation } from "../models/ApplicationNameReservation"
import { Repository } from "./Repository"

export class ApplicationNameReservationRepository extends Repository<ApplicationNameReservation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, ApplicationNameReservation)
  }
}
