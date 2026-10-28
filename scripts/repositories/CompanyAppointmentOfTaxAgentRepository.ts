import { CompanyAppointmentOfTaxAgent } from "../models/CompanyAppointmentOfTaxAgent"
import { Repository } from "./Repository"

export class CompanyAppointmentOfTaxAgentRepository extends Repository<CompanyAppointmentOfTaxAgent> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyAppointmentOfTaxAgent)
  }
}
