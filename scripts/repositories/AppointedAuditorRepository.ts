import { AppointedAuditor } from "../models/AppointedAuditor"
import { Repository } from "./Repository"

export class AppointedAuditorRepository extends Repository<AppointedAuditor> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, AppointedAuditor)
  }
}
