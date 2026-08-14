import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import type { IRepositoryStore } from "./IRepositoryStore"

export abstract class CompanyConstitutionSettingItem {
  id: string = ""
  settingId: string = ""

  constructor() {}

  convertFromResponse(data: any): void {
    this.id = data.id
    this.settingId = data.setting_id
  }

  clone(data: CompanyConstitutionSettingItem): void {
    this.id = data.id
    this.settingId = data.settingId
  }

  // NOTE: These functions are needed for the update function.
  abstract convertFromResponseDetails(data: any): void
  abstract getRequestBody(): object
  abstract canSubmit(): boolean

  async update(repository: IRepositoryStore): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.update(this.id, data)
    if (repository.error !== null) {
      throw repository.error
    }

    this.convertFromResponseDetails(response)
  }
}
