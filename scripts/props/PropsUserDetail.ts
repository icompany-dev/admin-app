import type { User } from "../models/User"

export interface IPropsUserDetail {
  id: string
  user: User
}

export class PropsUserDetail {
  id: string
  user: User

  constructor(id: string, user: User) {
    this.id = id
    this.user = user
  }
}
