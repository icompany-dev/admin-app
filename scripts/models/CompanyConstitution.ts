import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { File } from "./File"
import { CompanyConstitutionContent } from "./CompanyConstitutionContent"

export class CompanyConstitution {
  id: string = ""
  companyId: string = ""
  file: File | null = null
  fileId: string | null = null
  acceptedOn: string | null = null
  isAmended: boolean = false
  amendedOn: string | null = null
  amendedConstitutionId: string | null = null
  contents: CompanyConstitutionContent[] = []
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyConstitution) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.company_id
    this.fileId = data.file_id
    this.file = data.file ? new File(data.file) : null
    this.acceptedOn = data.accepted_on
    this.isAmended = data.is_amended
    this.amendedOn = data.amended_on
    this.amendedConstitutionId = data.amended_constitution_id
    this.contents =
      data.contents && Array.isArray(data.contents)
        ? data.contents.map((c: any) => {
            return new CompanyConstitutionContent(c)
          })
        : []
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: CompanyConstitution): void {
    this.id = data.id
    this.companyId = data.companyId
    this.fileId = data.fileId
    this.file = new File(data.file)
    this.acceptedOn = data.acceptedOn
    this.isAmended = data.isAmended
    this.amendedOn = data.amendedOn
    this.amendedConstitutionId = data.amendedConstitutionId
    this.contents = data.contents.map((c) => {
      return new CompanyConstitutionContent(c)
    })
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody() {
    return {
      company_id: this.companyId,
      file_id: this.fileId,
      accepted_on: this.acceptedOn,
      contents: this.contents.map((c) => {
        return c.getRequestBody()
      }),
    }
  }

  canSubmit() {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.fileId) &&
      this.acceptedOn !== null &&
      this.contents.length > 0 &&
      this.contents.every((c) => {
        return c.isDataComplete()
      })
    )
  }

  async create(repository: ReturnType<typeof useCompanyConstitutionStore>): Promise<void> {
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

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useCompanyConstitutionStore>): Promise<any> {
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

  async addMultipleContents(repository: ReturnType<typeof useCompanyConstitutionStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const contentsToAdd = this.contents.filter((c: CompanyConstitutionContent) => {
      return StringUtil.isNullOrEmpty(c.id) && c.isDataComplete()
    })

    let data = {
      company_constitution_id: this.id,
      contents: contentsToAdd.map((c: CompanyConstitutionContent) => {
        return c.getRequestBody()
      }),
    }

    let response = await repository.addMultipleContents(data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async removeMultipleContents(
    repository: ReturnType<typeof useCompanyConstitutionStore>,
    contentIdsToDelete: string[]
  ): Promise<any> {
    if (contentIdsToDelete.length <= 0) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = {
      company_constitution_id: this.id,
      content_ids: contentIdsToDelete,
    }

    let response = await repository.deleteMultipleContents(data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
