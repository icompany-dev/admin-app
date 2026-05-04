import { CompanyDirectorManagerAppointment } from "../models/CompanyDirectorManagerAppointment"
import { Repository } from "./Repository"

export class CompanyDirectorManagerAppointmentRepository extends Repository<CompanyDirectorManagerAppointment> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyDirectorManagerAppointment)
  }
}
