import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import type { IModel } from "./IModel"

export class UserArchiveAccess implements IModel<UserArchiveAccess> {
  id: string = ""
  userId: string = ""
  type: string = ""
  status: string | null = ""
  paidAt: string | null = ""
  startDate: string | null = ""
  expiryDate: string | null = ""
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof UserArchiveAccess) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.userId = data.user_id
    this.type = data.type
    this.status = data.status
    this.paidAt = data.paid_at
    this.startDate = data.start_date
    this.expiryDate = data.expiry_date
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: UserArchiveAccess): void {
    this.id = data.id
    this.userId = data.userId
    this.type = data.type
    this.status = data.status
    this.paidAt = data.paidAt
    this.startDate = data.startDate
    this.expiryDate = data.expiryDate
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      type: this.type,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.type)
  }

  async create(repository: ReturnType<typeof useUserArchiveAccessStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof useUserArchiveAccessStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useUserArchiveAccessStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
