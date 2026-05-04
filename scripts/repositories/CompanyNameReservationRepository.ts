import { CompanyNameReservation } from "../models/CompanyNameReservation"
import { Repository } from "./Repository"

export class CompanyNameReservationRepository extends Repository<CompanyNameReservation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyNameReservation)
  }
}
