import { ActivityRegister } from "../models/ActivityRegister"
import { Repository } from "./Repository"

export class ActivityRegisterRepository extends Repository<ActivityRegister> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, ActivityRegister)
  }
}
