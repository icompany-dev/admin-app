import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { File } from "./File"
import type { IInvitation } from "./IInvitation"
import { Invitation } from "./Invitation"

export class DirectorInvitation extends Invitation implements IInvitation<DirectorInvitation> {
  role: string = "director" // NOTE: Change this when we have other roles
  numberSequence: number = 0
  response: string | null = null
  responseDate: string | null = null
  rejectReason: string | null = null
  responseType: string | null = null
  appointerFollowUpAction: string | null = null
  appointerId: string | null = null
  signatureId: string | null = null
  signature: File | null = null

  invitationTarget: any | null = null

  invitationName: string | null = null
  phone: string | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof DirectorInvitation) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.invitationName = data.invitation_name ?? null
    this.phone = data.phone ?? null
    this.role = data.role
    this.numberSequence = data.number_sequence
    this.response = data.response
    this.responseDate = data.response_date ?? null
    this.rejectReason = data.reject_reason ?? null
    this.responseType = data.response_type
    this.appointerFollowUpAction = data.appointer_follow_up_action
    this.appointerId = data.appointer_id
    this.signatureId = data.signature_id
    this.signature = data.signature !== null ? new File(data.signature) : null
  }

  cloneDetails(data: DirectorInvitation): void {
    super.clone(data)
    this.invitationName = data.invitationName
    this.phone = data.phone
    this.role = data.role
    this.numberSequence = data.numberSequence
    this.response = data.response
    this.responseDate = data.responseDate
    this.rejectReason = data.rejectReason
    this.responseType = data.responseType
    this.appointerFollowUpAction = data.appointerFollowUpAction
    this.appointerId = data.appointerId
    this.signatureId = data.signatureId
    this.signature = data.signature !== null ? new File(data.signature) : null
  }

  getRequestBody(): object {
    return {
      email: this.email,
      target: this.target.target,
      target_id: this.target.id,
      role: this.role,
      name: this.invitationName,
      phone: this.phone,
      response_type: this.responseType,
      appointer_follow_up_action: this.appointerFollowUpAction,
      signature_id: this.signatureId,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.email) &&
      !StringUtil.isNullOrEmpty(this.target.id) &&
      !StringUtil.isNullOrEmpty(this.target.target)
    )
  }

  async create(repository: ReturnType<typeof useDirectorInvitationStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.create(data)
    if (repository.error !== null) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useDirectorInvitationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    if (!this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.update(this.id, data)
    if (repository.error !== null) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useDirectorInvitationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.remove(this.id)
    if (repository.error !== null) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }

  async accept(repository: ReturnType<typeof useDirectorInvitationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.accept(this.id)
    if (repository.error !== null) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async reject(repository: ReturnType<typeof useDirectorInvitationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.reject(this.id, this.rejectReason ?? "")
    if (repository.error !== null) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }
}
