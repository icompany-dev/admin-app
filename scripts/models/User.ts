import _ from "lodash"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { UserDetail } from "./UserDetail"
import type { IModel } from "./IModel"
import { BillingInfo } from "./BillingInfo"

export class User implements IModel<User> {
  id: string = ""
  name: string = ""
  displayName: string = ""
  email: string = ""
  phone: string = ""
  roles: any[] = []
  userRoleId: string = ""
  detail: UserDetail | null = null
  createdAt: string | null = null
  settings: any = null
  lastLogin: string = ""
  emailVerifiedAt: string = ""
  phoneVerifiedAt: string = ""

  token: string | null = null

  constructor(data: any = null) {
    if (data !== null) {
      if (data instanceof User) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  convertFromResponse(data: any) {
    this.id = data.id
    this.name = data.name
    this.displayName = data.display_name
    this.email = data.email
    this.phone = data.phone
    this.roles = data.roles
      ? data.roles.map((d: any) => {
          return new UserRole(d)
        })
      : []
    this.detail = new UserDetail(data.detail ?? null)
    this.createdAt = data.created_at
    this.settings = data.settings ? _.cloneDeep(data.settings) : null
    this.lastLogin = data.last_login
    this.token = data.token ?? null
  }

  clone(data: User) {
    this.id = data.id
    this.name = data.name
    this.displayName = data.displayName
    this.email = data.email
    this.phone = data.phone
    this.roles = data.roles.map((d: any) => {
      return new UserRole(d)
    })
    this.detail = new UserDetail(data.detail)
    this.createdAt = data.createdAt
    this.settings = data.settings ? _.cloneDeep(data.settings) : null
    this.lastLogin = data.lastLogin
    this.token = data.token
  }

  rolesAsString(): string {
    if (this.roles.length <= 0) {
      return ""
    }

    return this.roles
      .map((r) => {
        return r.name
      })
      .join(", ")
  }

  profileImage(): string {
    if (!this.detail || !this.detail.image) {
      return ""
    }

    return this.detail.image.url
  }

  showName(): string {
    if (!StringUtil.isNullOrEmpty(this.displayName)) {
      return this.displayName
    }

    if (!StringUtil.isNullOrEmpty(this.name)) {
      return StringUtil.capitalize(this.name)
    }

    if (!StringUtil.isNullOrEmpty(this.email)) {
      const username = this.email.split("@")[0]

      return username.length > 15 ? `${username.slice(0, 15)}` : username
    }

    return ""
  }

  isAdmin(): boolean {
    return (
      this.roles.length > 0 &&
      this.roles.some((r) => {
        return (r.id >= 1000 && r.id < 2000) || r.id === 9999
      })
    )
  }

  getGmailComposeLink(): string {
    return `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${this.email}`
  }

  async getSleekflowConversationId() {
    const sleekflowApi = useSleekflowStore()
    let conversationId = ""

    try {
      const sleekflowResponse = await sleekflowApi.fetchConversationsFor(this.phone)
      if (sleekflowResponse.length > 0) {
        conversationId = sleekflowResponse[0].conversationId
      }
    } catch (e: any) {
      console.error(e)
    }

    return conversationId
  }

  async goToSleekflow() {
    const conversationId = await this.getSleekflowConversationId()
    if (StringUtil.isNullOrEmpty(conversationId)) {
      return
    }

    window.open(
      `https://app.sleekflow.io/en/inbox?conversationId=${conversationId}&getConversationsFilter=eyJzdGF0dXMiOiJvcGVuIiwiaXNTdGFmZkFzc2lnbmVkIjp0cnVlfQ%3D%3D`,
      "_blank"
    )
  }

  getRequestBody() {
    const body: any = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      display_name: this.displayName,
      user_role_id: this.userRoleId,
      settings: this.settings,
    }

    if (this.detail) {
      const detailBody = this.detail.getRequestBody()
      Object.assign(body, detailBody)
    }

    if (!StringUtil.isNullOrEmpty(this.emailVerifiedAt)) {
      body.email_verified_at = this.emailVerifiedAt
    }

    if (!StringUtil.isNullOrEmpty(this.phoneVerifiedAt)) {
      body.phone_verified_at = this.phoneVerifiedAt
    }

    return body
  }

  canCreate() {
    return (
      !StringUtil.isNullOrEmpty(this.name) &&
      !StringUtil.isNullOrEmpty(this.email) &&
      !StringUtil.isNullOrEmpty(this.phone) &&
      !StringUtil.isNullOrEmpty(this.userRoleId)
    )
  }

  canUpdate() {
    return (
      !StringUtil.isNullOrEmpty(this.name) &&
      !StringUtil.isNullOrEmpty(this.email) &&
      !StringUtil.isNullOrEmpty(this.phone) &&
      !StringUtil.isNullOrEmpty(this.id)
    )
  }

  async update(repository: ReturnType<typeof useUserStore>): Promise<void> {
    if (!this.canUpdate()) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForIncompleteData()
      throw errorMessage
    }

    const data = this.getRequestBody()
    try {
      let response = await repository.update(this.id, data)
      this.convertFromResponse(response)
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForIncompleteData()
      throw errorMessage
    }
  }

  billingInfo(): BillingInfo {
    let billingInfo = new BillingInfo()
    billingInfo.name = this.name
    let address = this.detail?.location ?? null
    billingInfo.addressLine1 = address?.addressLine1 ?? "-"
    billingInfo.addressLine2 = address?.addressLine2 ?? "-"
    billingInfo.addressPostcode = address?.postcode ?? "40400"
    billingInfo.addressCity = address?.city?.name ?? "-"
    billingInfo.addressState = address?.state?.name ?? "-"
    billingInfo.addressCountry = address?.country?.name ?? "Malaysia"

    return billingInfo
  }
}

export class UserRole {
  id = 0
  name = ""
  description = ""

  constructor(data: any | null = null) {
    if (data !== null) {
      this.clone(data)
    }
  }

  clone(data: UserRole) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
  }
}
