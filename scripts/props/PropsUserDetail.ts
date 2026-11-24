import { User } from "../models/User"
import { UserDetail } from "../models/UserDetail"

export interface IPropsUserDetail {
  user: User
  userDetail: UserDetail
  isEditable: boolean
}

export class PropsUserDetail implements IPropsUserDetail {
  user: User
  userDetail: UserDetail
  isEditable: boolean = false

  constructor(user: User, userDetail: UserDetail) {
    this.user = user
    this.userDetail = userDetail
  }
}
