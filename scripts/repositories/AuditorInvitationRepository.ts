import { AuditorInvitation } from "../models/AuditorInvitation"
import { Repository } from "./Repository"

export class AuditorInvitationRepository extends Repository<AuditorInvitation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, AuditorInvitation)
  }
}
