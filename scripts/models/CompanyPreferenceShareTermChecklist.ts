import { PreferenceShareChecklistCategory } from "~/scripts/constants/PreferenceShareTerms"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"

export class CompanyPreferenceShareTermChecklist {
  id: string = ""
  termSheetId: string = ""
  category: PreferenceShareChecklistCategory = PreferenceShareChecklistCategory.ConditionPrecedent
  itemKey: string = ""
  isRequired: boolean = false
  remarks: string | null = null
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyPreferenceShareTermChecklist) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.termSheetId = data.term_sheet_id ?? ""
    this.category =
      (data.category as PreferenceShareChecklistCategory) ?? PreferenceShareChecklistCategory.ConditionPrecedent
    this.itemKey = data.item_key ?? ""
    this.isRequired = Boolean(data.is_required)
    this.remarks = data.remarks ?? null
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
    this.deletedAt = data.deleted_at ?? null
  }

  clone(data: CompanyPreferenceShareTermChecklist): void {
    if (!data) return

    this.id = data.id
    this.termSheetId = data.termSheetId

    this.category = data.category
    this.itemKey = data.itemKey
    this.isRequired = data.isRequired
    this.remarks = data.remarks

    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      term_sheet_id: this.termSheetId,
      category: this.category,
      item_key: this.itemKey,
      is_required: this.isRequired,
      remarks: this.remarks,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.termSheetId)
  }

  async create(repository: ReturnType<typeof useCompanyPreferenceShareTermChecklistStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyPreferenceShareTermChecklistStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useCompanyPreferenceShareTermChecklistStore>): Promise<void> {
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
