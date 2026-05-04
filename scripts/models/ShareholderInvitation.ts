import { ShareholdingType } from "../constants/Shareholder"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { File } from "./File"
import type { IInvitation } from "./IInvitation"
import { Invitation } from "./Invitation"
import { User } from "./User"

export class ShareholderInvitation extends Invitation implements IInvitation<ShareholderInvitation> {
  type: string = ""
  company: ShareholderInvitationCompany = new ShareholderInvitationCompany()
  ordinaryShares: number = 0
  preferenceShares: number = 0
  totalShares: number = 0
  numberSequence: number = 0
  supportingDocumentId: string | null = null
  supportingDocument: File | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof ShareholderInvitation) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.type = data.type
    this.company = new ShareholderInvitationCompany(data)
    this.ordinaryShares = data.ordinary_shares
    this.preferenceShares = data.preference_shares
    this.totalShares = data.total_shares
    this.numberSequence = data.number_sequence
    this.supportingDocument = data.company_resolution ? new File(data.company_resolution) : null
    this.supportingDocumentId = this.supportingDocument ? this.supportingDocument.id : null
  }

  cloneDetails(data: ShareholderInvitation): void {
    super.clone(data)
    this.type = data.type
    this.company = new ShareholderInvitationCompany(data.company)
    this.ordinaryShares = data.ordinaryShares
    this.preferenceShares = data.preferenceShares
    this.totalShares = data.totalShares
    this.numberSequence = data.numberSequence
    this.supportingDocumentId = data.supportingDocumentId
    this.supportingDocument = data.supportingDocument ? new File(data.supportingDocument) : null
  }

  getRequestBody(): object {
    if (this.type === ShareholdingType.Representative) {
      return {
        email: this.email,
        target: this.target.target,
        target_id: this.target.id,
        type: this.type,
        ...this.company.getRequestBody(),
        ordinary_shares: this.ordinaryShares,
        preference_shares: this.preferenceShares,
        company_resolution: this.supportingDocumentId,
      }
    }

    return {
      email: this.email,
      target: this.target.target,
      target_id: this.target.id,
      type: this.type,
      ordinary_shares: this.ordinaryShares,
      preference_shares: this.preferenceShares,
    }
  }

  async getRegisteredUser(repository: ReturnType<typeof useUserStore>): Promise<User | null> {
    const response = await repository.fetchByEmail(this.email)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForFetch()
      throw error
    }

    return new User(response)
  }

  canSubmit(): boolean {
    if (
      this.type === ShareholdingType.Representative &&
      (StringUtil.isNullOrEmpty(this.company.name) || StringUtil.isNullOrEmpty(this.company.type))
    ) {
      return false
    }

    return (
      !StringUtil.isNullOrEmpty(this.email) &&
      !StringUtil.isNullOrEmpty(this.target.id) &&
      !StringUtil.isNullOrEmpty(this.target.target) &&
      !StringUtil.isNullOrEmpty(this.type)
    )
  }

  async create(repository: ReturnType<typeof useShareholderInvitationStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useShareholderInvitationStore>): Promise<void> {
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
      error.setForIncompleteData()
      throw error
    }

    this.convertFromResponseDetails(response)
  }
}

export class ShareholderInvitationCompany {
  name: string | null = null
  type: string | null = null
  registrationNumberNew: string | null = null
  registrationNumberOld: string | null = null
  resolution: File | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ShareholderInvitationCompany) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.name = data.company_name ?? null
    this.type = data.company_type ?? null
    this.registrationNumberNew = data.company_registration_number_new ?? null
    this.registrationNumberOld = data.company_registration_number_old ?? null
    this.resolution = data.company_resolution ? new File(data.company_resolution) : null
  }

  clone(data: ShareholderInvitationCompany): void {
    this.name = data.name
    this.type = data.type
    this.registrationNumberNew = data.registrationNumberNew
    this.registrationNumberOld = data.registrationNumberOld
    this.resolution = data.resolution ? new File(data.resolution) : null
  }

  getRequestBody(): object {
    return {
      company_name: this.name,
      company_type: this.type,
      company_registration_number_new: this.registrationNumberNew,
      company_registration_number_old: this.registrationNumberOld,
      company_resolution: this.resolution ? this.resolution.id : null,
    }
  }
}
