import { CompanyDirectorPayment } from "../models/CompanyDirectorPayment"
import { Repository } from "./Repository"

export class CompanyDirectorPaymentRepository extends Repository<CompanyDirectorPayment> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyDirectorPayment)
  }
}
