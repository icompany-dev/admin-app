import { StringUtil } from "../utils/String"
import { Label } from "./Label"

export class LabelItem {
  id: string = ""
  labelId: string = ""
  label: Label = new Label()
  targetType: string = ""
  targetId: string = ""
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof LabelItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.labelId = data.label_id
    this.label = new Label(data.label)
    this.targetType = data.target_type
    this.targetId = data.target_id
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: LabelItem): void {
    this.id = data.id
    this.labelId = data.labelId
    this.label = new Label(data.label)
    this.targetType = data.targetType
    this.targetId = data.targetId
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    if (StringUtil.isNullOrEmpty(this.label.description)) {
      this.label.description = this.label.name
    }

    return {
      label_id: this.labelId,
      name: this.label.name,
      description: this.label.description,
      target_type: this.targetType,
      target_id: this.targetId,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.targetType) &&
      !StringUtil.isNullOrEmpty(this.targetId) &&
      !StringUtil.isNullOrEmpty(this.label.name)
    )
  }
}
