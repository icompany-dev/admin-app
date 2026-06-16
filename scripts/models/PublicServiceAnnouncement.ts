import { PublicServiceAnnouncementType } from "../constants/PublicServiceAnnouncements"

export class PublicServiceAnnouncement {
  id: string = ""
  type: PublicServiceAnnouncementType = PublicServiceAnnouncementType.ImportantNotice
  name: string = ""
  description: string = ""
  imageUrl: string | null = null
  targetCompanyIds: string[] = []
  excludeCompanyIds: string[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PublicServiceAnnouncement) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.type = data.type
    this.name = data.name
    this.description = data.description
    this.imageUrl = data.image_url
    this.targetCompanyIds = data.target_company_ids
    this.excludeCompanyIds = data.exclude_company_ids
  }

  clone(data: PublicServiceAnnouncement): void {
    this.id = data.id
    this.type = data.type
    this.name = data.name
    this.description = data.description
    this.imageUrl = data.imageUrl
    this.targetCompanyIds = data.targetCompanyIds
    this.excludeCompanyIds = data.excludeCompanyIds
  }
}
