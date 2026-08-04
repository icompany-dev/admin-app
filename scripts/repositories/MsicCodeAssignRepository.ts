import { MsicCodeAssign } from "../models/MsicCodeAssign"
import { Repository } from "./Repository"

export class MsicCodeAssignRepository extends Repository<MsicCodeAssign> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, MsicCodeAssign)
  }
}
