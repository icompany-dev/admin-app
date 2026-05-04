import { AuditTrailAction } from "../constants/AuditTrails"
import { ActivityRegister } from "../models/ActivityRegister"
import { UserAccessRole } from "../models/UserAccessRole"
import { CurrentUser } from "../utils/CurrentUser"
import { StringUtil } from "../utils/String"
import { Error } from "./Error"
import { Filter } from "./Filter"

export class ActivityLogger {
  email: string = ""
  userId: string = ""
  companyId: string = ""
  role: string = "account_owner"
  action: string = ""
  additionalInfo: string = ""
  targetType: string = ""
  targetId: string = ""
  ipAddress: string = ""
  status: string = ""

  activityRegister: ActivityRegister = new ActivityRegister()

  constructor() {}

  async init(): Promise<void> {
    let user = await CurrentUser.get()
    this.userId = user.id
    this.email = user.email

    let auth = useAuthStore()
    this.ipAddress = auth.userIp ?? ""
  }

  async addViewLog(
    companyId: string,
    additionalInfo: string,
    targetType: string,
    targetId: string,
    status: string
  ): Promise<void> {
    if (this.companyId !== companyId) {
      this.companyId = companyId
      await this.setRole()
    }

    this.action = AuditTrailAction.View
    this.additionalInfo = additionalInfo
    this.targetType = targetType
    this.targetId = targetId
    this.status = status

    await this.addLog()
  }

  async addDownloadLog(
    companyId: string,
    additionalInfo: string,
    targetType: string,
    targetId: string,
    status: string
  ): Promise<void> {
    if (this.companyId !== companyId) {
      this.companyId = companyId
      await this.setRole()
    }

    this.action = AuditTrailAction.Download
    this.additionalInfo = additionalInfo
    this.targetType = targetType
    this.targetId = targetId
    this.status = status

    await this.addLog()
  }

  async addCreateLog(companyId: string, targetType: string, targetId: string, status: string): Promise<void> {
    if (this.companyId !== companyId) {
      this.companyId = companyId
      await this.setRole()
    }
    this.action = AuditTrailAction.Initiate
    this.additionalInfo = ""
    this.targetType = targetType
    this.targetId = targetId
    this.status = status

    await this.addLog()
  }

  async addUpdateLog(companyId: string, targetType: string, targetId: string, status: string): Promise<void> {
    if (this.companyId !== companyId) {
      this.companyId = companyId
      await this.setRole()
    }
    this.action = AuditTrailAction.Update
    this.additionalInfo = ""
    this.targetType = targetType
    this.targetId = targetId
    this.status = status

    await this.addLog()
  }

  async addSignLog(
    companyId: string,
    role: string,
    targetType: string,
    targetId: string,
    status: string
  ): Promise<void> {
    if (this.companyId !== companyId) {
      this.companyId = companyId
    }
    this.role = role
    this.action = AuditTrailAction.Sign
    this.additionalInfo = ""
    this.targetType = targetType
    this.targetId = targetId
    this.status = status

    await this.addLog()
  }

  async addMakePaymentLog(
    companyId: string,
    paymentLink: string,
    targetType: string,
    targetId: string,
    status: string
  ): Promise<void> {
    if (this.companyId !== companyId) {
      this.companyId = companyId
      await this.setRole()
    }
    this.action = AuditTrailAction.MakePayment
    this.additionalInfo = `payment link: ${paymentLink}`
    this.targetType = targetType
    this.targetId = targetId
    this.status = status

    await this.addLog()
  }

  async addPostPaymentLog(companyId: string, targetType: string, targetId: string, status: string): Promise<void> {
    if (this.companyId !== companyId) {
      this.companyId = companyId
      await this.setRole()
    }
    this.action = AuditTrailAction.MadePayment
    this.additionalInfo = "post payment"
    this.targetType = targetType
    this.targetId = targetId
    this.status = status

    await this.addLog()
  }

  async addRevokeLog(companyId: string, targetType: string, targetId: string, status: string): Promise<void> {
    if (this.companyId !== companyId) {
      this.companyId = companyId
      await this.setRole()
    }
    this.action = AuditTrailAction.Revoke
    this.additionalInfo = ""
    this.targetType = targetType
    this.targetId = targetId
    this.status = status

    await this.addLog()
  }

  async addDeleteLog(companyId: string, targetType: string, targetId: string, status: string): Promise<void> {
    if (this.companyId !== companyId) {
      this.companyId = companyId
      await this.setRole()
    }
    this.action = AuditTrailAction.Delete
    this.additionalInfo = ""
    this.targetType = targetType
    this.targetId = targetId
    this.status = status

    await this.addLog()
  }

  async addSearchLog(searchKeyword: string, status: string): Promise<void> {
    this.additionalInfo = searchKeyword
    this.action = AuditTrailAction.Search
    this.status = status
    this.targetType = "user"
    this.targetId = this.userId
    await this.addLog()
  }

  private setActivityRegister(): void {
    this.activityRegister = new ActivityRegister()
    this.activityRegister.email = this.email
    this.activityRegister.userId = this.userId
    this.activityRegister.companyId = this.companyId
    this.activityRegister.role = this.role
    this.activityRegister.action = this.action
    this.activityRegister.additionalInfo = this.additionalInfo
    this.activityRegister.targetType = this.targetType
    this.activityRegister.targetId = this.targetId
    this.activityRegister.ipAddress = this.ipAddress
    this.activityRegister.status = this.status
  }

  private async addLog(): Promise<void> {
    this.setActivityRegister()

    let repository = useActivityRegisterStore()
    await this.activityRegister.create(repository)
  }

  private async setRole(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      this.role = "account_owner"
      return
    }

    try {
      let filter = new Filter()
      filter.companyId = this.companyId
      filter.takeAll = true
      let repository = useUserAccessRoleStore()
      let response = await repository.fetchAll(filter)

      if (response.totalRecords <= 0 || repository.error !== null) {
        throw repository.error
      }

      let matchedUser = response.data.find((uar: UserAccessRole) => {
        return uar.userId === this.userId
      })

      if (!matchedUser) {
        throw new Error("", "")
      }

      this.role = new UserAccessRole(matchedUser).accessRole.name
    } catch (e) {
      this.role = "account_owner"
    }
  }
}
