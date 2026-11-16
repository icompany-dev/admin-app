import { StringUtil } from "../utils/String"

export class Label {
  id: string = ""
  name: string = ""
  description: string = ""
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Label) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: Label): void {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    if (StringUtil.isNullOrEmpty(this.description)) {
      this.description = this.name
    }

    return {
      name: this.name,
      description: this.description,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.name)
  }
}
