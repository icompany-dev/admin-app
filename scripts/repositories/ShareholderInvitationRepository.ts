import { ShareholderInvitation } from "../models/ShareholderInvitation"
import { Repository } from "./Repository"

export class ShareholderInvitationRepository extends Repository<ShareholderInvitation> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, ShareholderInvitation)
  }
}
