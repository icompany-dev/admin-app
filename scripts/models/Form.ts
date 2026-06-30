import { CompanyItem } from "./CompanyItem"
import { File } from "./File"
import { StringUtil } from "~/scripts/utils/String"
import type { IModel } from "./IModel"
import { Error } from "~/scripts/library/Error"

//NOTE: This refer to the company documents, not actual forms
export class Form extends CompanyItem implements IModel<Form> {
  type: string = ""
  downloads: number = 0
  fileId: string | null = null
  file: File | null = null
  noOfPages: number = 0
  expiryDate: string | null = null
  removeOnExpired: boolean = false
  status: string = ""
  documentDate: string | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof Form) {
      this.cloneWithDetails(data)
    } else {
      this.convertWithDetails(data)
    }
  }

  convertWithDetails(data: any): void {
    super.convertFromResponse(data)
    this.type = data.type ?? ""
    this.downloads = data.downloads ?? 0
    this.file = data.image ? new File(data.image) : null
    this.fileId = this.file ? this.file.id : null
    this.noOfPages = data.no_of_pages ?? 0
    this.expiryDate = data.expiry_date ?? null
    this.removeOnExpired = data.remove_on_expired ?? false
    this.status = data.status ?? ""
    this.documentDate = data.document_date ?? null
  }

  cloneWithDetails(data: Form): void {
    super.clone(data)
    this.type = data.type
    this.downloads = data.downloads
    this.fileId = data.fileId
    this.file = data.file ? new File(data.file) : null
    this.noOfPages = data.noOfPages
    this.expiryDate = data.expiryDate
    this.removeOnExpired = data.removeOnExpired
    this.status = data.status
    this.documentDate = data.documentDate
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      type: this.type,
      file_id: this.fileId,
      document_date: this.documentDate,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.type) &&
      !StringUtil.isNullOrEmpty(this.fileId) &&
      !StringUtil.isNullOrEmpty(this.status)
    )
  }

  async create(repository: ReturnType<typeof useFormStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }
}
