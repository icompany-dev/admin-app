import { StringUtil } from "../utils/String"
import { User } from "./User"

export abstract class Invitation {
  id: string = ""
  email: string = ""
  target: InvitationTarget = new InvitationTarget()
  userId: string | null = null
  name: string | null = null
  metaData: any | null = null
  createdAt: string = ""
  updatedAt: string = ""

  user: User = new User()

  convertFromResponse(data: any): void {
    this.id = data.id
    this.email = data.email
    this.target = data.target ? new InvitationTarget(data.target) : new InvitationTarget(data.invitation)
    this.userId = data.user_id
    this.name = data.name
    this.metaData = data.meta_data ?? null
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: Invitation): void {
    this.id = data.id
    this.email = data.email
    this.target.clone(data.target)
    this.userId = data.userId
    this.name = data.name
    this.metaData = data.metaData
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  async setUser(repository: ReturnType<typeof useUserStore>): Promise<void> {
    if (this.userId === null || StringUtil.isNullOrEmpty(this.userId)) {
      this.user = new User()
      return
    }

    let response = await repository.fetch(this.userId)
    this.user = new User(response)
  }
}

export class InvitationTarget {
  id: string = ""
  target: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof InvitationTarget) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.target = data.target
  }

  clone(data: InvitationTarget): void {
    this.id = data.id
    this.target = data.target
  }
}
