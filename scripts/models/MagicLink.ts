export class MagicLink {
  id: string = ""
  userId: string = ""
  email: string = ""
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof MagicLink) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.userId = data.user_id
    this.email = data.email
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: MagicLink): void {
    this.id = data.id
    this.userId = data.userId
    this.email = data.email
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}
