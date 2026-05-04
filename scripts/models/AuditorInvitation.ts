import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import type { IInvitation } from "./IInvitation"
import { Invitation } from "./Invitation"
import { Location } from "./Location"

export class AuditorInvitation extends Invitation implements IInvitation<AuditorInvitation> {
  phone: string = ""
  companyName: string = ""
  companyType: string = "others"
  companyEmail: string | null = null
  companyLocationId: string | null = null
  companyLocation: Location | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof AuditorInvitation) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.phone = data.phone ?? ""
    this.companyName = data.company_name ?? ""
    this.companyType = data.company_type ?? ""
    this.companyEmail = data.company_email ?? null
    this.companyLocationId = data.company_location?.id ?? null
    this.companyLocation = data.company_location ? new Location(data.company_location) : null
  }

  cloneDetails(data: AuditorInvitation): void {
    super.clone(data)
    this.phone = data.phone
    this.companyName = data.companyName
    this.companyType = data.companyType
    this.companyEmail = data.companyEmail
    this.companyLocationId = data.companyLocationId
    this.companyLocation = data.companyLocation ? new Location(data.companyLocation) : null
  }

  getRequestBody(): object {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      target: this.target.target,
      target_id: this.target.id,
      company_name: this.companyName,
      company_type: this.companyType,
      company_email: this.companyEmail,
      // company_location: this.companyLocation !== null ? this.companyLocation.getRequestBody() : null,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.name) &&
      !StringUtil.isNullOrEmpty(this.email) &&
      !StringUtil.isNullOrEmpty(this.phone) &&
      !StringUtil.isNullOrEmpty(this.companyName) &&
      !StringUtil.isNullOrEmpty(this.companyEmail) &&
      !StringUtil.isNullOrEmpty(this.target.id) &&
      !StringUtil.isNullOrEmpty(this.target.target)
    )
  }

  async create(repository: ReturnType<typeof useAuditorInvitationStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.create(data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useAuditorInvitationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.update(this.id, data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }
}
