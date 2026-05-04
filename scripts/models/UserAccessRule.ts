import _ from "lodash"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"
import { Company } from "./Company"
import { AccessRule } from "./AccessRule"
import { User } from "./User"

export class UserAccessRule {
  id: string = ""
  userId: string = ""
  user: User = new User()
  companyId = ""
  company: Company = new Company()
  accessRuleId = ""
  accessRule: AccessRule = new AccessRule()

  constructor(data = null) {
    if (data !== null) {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.userId = data.user_id
    this.user = new User(data.user)
    this.companyId = data.company_id
    this.company = new Company(data.company)
    this.accessRuleId = data.access_rule_id
    this.accessRule = new AccessRule(data.access_rule)
  }

  clone(data: UserAccessRule): void {
    this.id = data.id
    this.userId = data.userId
    this.user = new User(data.user)
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.accessRuleId = data.accessRuleId
    this.accessRule = new AccessRule()
    this.accessRule.clone(data.accessRule)
  }

  getRequestBody() {
    return {
      user_id: this.userId,
      company_id: this.companyId,
      access_rule_id: this.accessRuleId,
    }
  }

  canSubmit() {
    return (
      !StringUtil.isNullOrEmpty(this.userId) &&
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.accessRuleId)
    )
  }

  async create(repository: ReturnType<typeof useUserAccessRuleStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useUserAccessRuleStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
