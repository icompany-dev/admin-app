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
}
