import { User } from "../models/User"
import { UserDetail } from "../models/UserDetail"

export interface IPropsUserDetail {
  user: User
  userDetail: UserDetail
}

export class PropsUserDetail implements IPropsUserDetail {
  user: User
  userDetail: UserDetail

  constructor(user: User, userDetail: UserDetail) {
    this.user = user
    this.userDetail = userDetail
  }
}
