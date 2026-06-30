import { StringUtil } from "~/scripts/utils/String"
import type { IModel } from "./IModel"
import { Error } from "~/scripts/library/Error"

export class FormType {
  id: string = ""
  name: string = ""
  nameBm: string | null = null
  description: string = ""
  descriptionBm: string | null = null
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof FormType) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.nameBm = data.name_bm
    this.description = data.description
    this.descriptionBm = data.description_bm
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: FormType): void {
    this.id = data.id
    this.name = data.name
    this.nameBm = data.nameBm
    this.description = data.description
    this.descriptionBm = data.descriptionBm
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      name: this.name,
      name_bm: this.nameBm,
      description: this.description,
      description_bm: this.descriptionBm,
    }
  }

  canSubmit() {
    return !StringUtil.isNullOrEmpty(this.name)
  }

  async create(repository: ReturnType<typeof useFormTypeStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useFormTypeStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
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

  async remove(repository: ReturnType<typeof useFormTypeStore>): Promise<void> {
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
