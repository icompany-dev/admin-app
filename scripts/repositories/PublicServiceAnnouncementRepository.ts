import { PublicServiceAnnouncement } from "../models/PublicServiceAnnouncement"
import { Repository } from "./Repository"

export class PublicServiceAnnouncementRepository extends Repository<PublicServiceAnnouncement> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, PublicServiceAnnouncement)
  }
}
