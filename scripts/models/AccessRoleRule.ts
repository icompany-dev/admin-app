import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"
import { AccessRole } from "./AccessRole"
import { AccessRule } from "./AccessRule"

export class AccessRoleRule {
  id: string = ""
  accessRoleId: string = ""
  accessRole: AccessRole = new AccessRole()
  accessRuleId: string = ""
  accessRule: AccessRule = new AccessRule()

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AccessRoleRule) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.accessRoleId = data.access_role_id
    this.accessRole = new AccessRole(data.access_role)
    this.accessRuleId = data.access_rule_id
    this.accessRule = new AccessRule(data.access_rule)
  }

  clone(data: AccessRoleRule): any {
    this.id = data.id
    this.accessRoleId = data.accessRoleId
    this.accessRole = new AccessRole()
    if (data.accessRole !== null) {
      this.accessRole.clone(data.accessRole)
    }
    this.accessRuleId = data.accessRuleId
    this.accessRule = new AccessRule()
    if (data.accessRule !== null) {
      this.accessRule.clone(data.accessRule)
    }
  }

  getRequestBody() {
    return {
      access_role_id: this.accessRoleId,
      access_rule_id: this.accessRuleId,
    }
  }

  canSubmit() {
    return !StringUtil.isNullOrEmpty(this.accessRoleId) && !StringUtil.isNullOrEmpty(this.accessRuleId)
  }

  async create(repository: ReturnType<typeof useAccessRoleStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useAccessRoleStore>): Promise<void> {
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
