import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"

export class CompanyConstitutionContent {
  id: string = ""
  constitutionId: string = ""
  section: string = ""
  sectionCA2016: string | null = null
  content: string = ""
  pageNumber = 1
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionContent) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.constitutionId = data.company_constitution_id ?? ""
    this.section = data.section
    this.sectionCA2016 = data.section_ca_2016
    this.content = data.content
    this.pageNumber = data.page_number ?? 1
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: CompanyConstitutionContent): void {
    this.id = data.id
    this.constitutionId = data.constitutionId
    this.section = data.section
    this.sectionCA2016 = data.sectionCA2016
    this.content = data.content
    this.pageNumber = data.pageNumber ?? 1
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody() {
    return {
      company_constitution_id: this.constitutionId,
      section: this.section,
      section_ca_2016: this.sectionCA2016,
      content: this.content,
      page_number: this.pageNumber,
    }
  }

  isDataComplete() {
    return !StringUtil.isNullOrEmpty(this.section) && !StringUtil.isNullOrEmpty(this.content)
  }

  canSubmit() {
    return !StringUtil.isNullOrEmpty(this.constitutionId) && this.isDataComplete()
  }

  async create(repository: ReturnType<typeof useCompanyConstitutionStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.addContent(data)
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

    let response = await repository.deleteContent(this.id)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
