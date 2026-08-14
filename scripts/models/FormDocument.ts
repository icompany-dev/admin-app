export class FormDocument {
  id: string = ""
  name: string = ""
  isInSystem: boolean = false
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof FormDocument) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.isInSystem = data.is_in_system ?? false
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: FormDocument): void {
    this.id = data.id
    this.name = data.name
    this.isInSystem = data.isInSystem
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }
}
