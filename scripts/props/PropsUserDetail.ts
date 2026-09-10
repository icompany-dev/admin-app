import type { Director } from "../models/Director"
import type { Shareholder } from "../models/Shareholder"
import type { User } from "../models/User"

export interface IPropsUserDetail {
  id: string
  user: User
  role: Director | Shareholder
}

export class PropsUserDetail {
  id: string
  user: User
  role: Director | Shareholder

  constructor(id: string, user: User, role: Director | Shareholder) {
    this.id = id
    this.user = user
    this.role = role
  }
}
