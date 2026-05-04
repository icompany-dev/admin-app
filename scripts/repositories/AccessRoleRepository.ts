import { AccessRole } from "../models/AccessRole"
import { Repository } from "./Repository"

export class AccessRoleRepository extends Repository<AccessRole> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, AccessRole)
  }
}
