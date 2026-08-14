import { ConstitutionAmendmentTypes } from "../constants/AmendmentTypes"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { File } from "./File"
import type { IModelApplication } from "./IModelApplication"

export class CompanyAmendmentConstitution
  extends Application
  implements IModelApplication<CompanyAmendmentConstitution, ReturnType<typeof useCompanyAmendmentConstitutionStore>>
{
  type: string = ConstitutionAmendmentTypes.Adopt
  constitutionFileId: string | null = null
  constitutionFile: File | null = null

  constructor(data: any | null = null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyAmendmentConstitution) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.type = data.type
    this.constitutionFileId = data.constitution_file?.id ?? null
    this.constitutionFile = data.constitution_file ? new File(data.constitution_file) : null
  }

  cloneDetails(data: CompanyAmendmentConstitution): void {
    super.clone(data)
    this.type = data.type
    this.constitutionFileId = data.constitutionFileId
    this.constitutionFile = data.constitutionFile ? new File(data.constitutionFile) : null
  }

  getRequestBody() {
    return {
      type: this.type,
      company_id: this.companyId,
      constitution_file_id: this.constitutionFileId,
    }
  }

  canSubmit() {
    return !StringUtil.isNullOrEmpty(this.type) && !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyAmendmentConstitutionStore>): Promise<void> {
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

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyAmendmentConstitutionStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
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

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyAmendmentConstitutionStore>): Promise<void> {
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
