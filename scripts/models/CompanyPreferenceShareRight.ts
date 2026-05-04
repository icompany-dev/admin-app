import { Application } from "./Application"
import { CompanyConstitutionSetting } from "./CompanyConstitutionSetting"
import { CompanyPreferenceShareTerm } from "./CompanyPreferenceShareTerm"
import type { IModelApplication } from "./IModelApplication"
import { StringUtil } from "../utils/String"
import { Error } from "~/scripts/library/Error"

export class CompanyPreferenceShareRight
  extends Application
  implements IModelApplication<CompanyPreferenceShareRight, ReturnType<typeof useCompanyPreferenceShareRightStore>>
{
  termSheetId: string = ""
  termSheet: CompanyPreferenceShareTerm = new CompanyPreferenceShareTerm()
  constitutionSettingId: string = ""
  constitutionSetting: CompanyConstitutionSetting = new CompanyConstitutionSetting()

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyPreferenceShareRight) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.termSheetId = data.term_sheet_id
    this.termSheet = new CompanyPreferenceShareTerm(data.term_sheet)
    this.constitutionSettingId = data.constitution_setting_id
    this.constitutionSetting = new CompanyConstitutionSetting(data.constitution_setting)
  }

  cloneDetails(data: CompanyPreferenceShareRight): void {
    super.clone(data)
    this.termSheetId = data.termSheetId
    this.termSheet = new CompanyPreferenceShareTerm(data.termSheet)
    this.constitutionSettingId = data.constitutionSettingId
    this.constitutionSetting = new CompanyConstitutionSetting(data.constitutionSetting)
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      term_sheet_id: this.termSheetId,
      constitution_setting_id: this.constitutionSettingId,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.termSheetId) &&
      !StringUtil.isNullOrEmpty(this.constitutionSettingId)
    )
  }

  async create(repository: ReturnType<typeof useCompanyPreferenceShareRightStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.create(data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyPreferenceShareRightStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.update(this.id, data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyPreferenceShareRightStore>): Promise<any> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.remove(this.id)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
