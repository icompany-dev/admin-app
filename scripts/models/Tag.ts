import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import type { IModel } from "./IModel"

export class Tag implements IModel<Tag> {
  id: string = ""
  targetType: string = ""
  targetId: string = ""
  name: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Tag) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.targetType = data.target_type ?? ""
    this.targetId = data.target_id ?? ""
    this.name = data.name ?? ""
  }

  clone(data: Tag): void {
    this.id = data.id
    this.targetType = data.targetType
    this.targetId = data.targetId
    this.name = data.name
  }

  getRequestBody(): object {
    return {
      target_type: this.targetType,
      target_id: this.targetId,
      name: this.name,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.targetType) &&
      !StringUtil.isNullOrEmpty(this.targetId) &&
      !StringUtil.isNullOrEmpty(this.name)
    )
  }

  async create(repository: ReturnType<typeof useTagStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useTagStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useTagStore>): Promise<void> {
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
