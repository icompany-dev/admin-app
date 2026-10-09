import { PublicServiceAnnouncementType } from "../constants/PublicServiceAnnouncements"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

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

  getRequestBody(): object {
    return {
      type: this.type,
      name: this.name,
      description: this.description,
      image_url: this.imageUrl,
      target_company_ids: this.targetCompanyIds,
      exclude_company_ids: this.excludeCompanyIds,
    }
  }

  canSubmit(): boolean {
    return true
  }

  async create(repository: ReturnType<typeof usePublicServiceAnnouncementStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof usePublicServiceAnnouncementStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof usePublicServiceAnnouncementStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }
}
