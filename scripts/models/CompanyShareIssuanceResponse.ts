import { StringUtil } from "../utils/String"
import { File } from "./File"
import { Error } from "~/scripts/library/Error"
import type { IModel } from "./IModel"
import { Shareholder } from "./Shareholder"

export class CompanyShareIssuanceResponse implements IModel<CompanyShareIssuanceResponse> {
  id: string = ""
  issuanceId: string = ""
  shareholder: Shareholder = new Shareholder()
  isWaived: boolean = false
  responseDate: string | null = null
  responseFile: File | null = null
  declarationFile: File | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyShareIssuanceResponse) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.issuanceId = data.issuance_id
    this.shareholder = new Shareholder(data.shareholder)
    this.isWaived = data.is_waived === 1
    this.responseDate = data.response_date
    this.responseFile = data.file ? new File(data.file) : null
    this.declarationFile = data.declaration_file ? new File(data.declaration_file) : null
  }

  clone(data: CompanyShareIssuanceResponse): void {
    this.id = data.id
    this.issuanceId = data.issuanceId
    this.shareholder = new Shareholder(data.shareholder)
    this.isWaived = data.isWaived
    this.responseDate = data.responseDate
    this.responseFile = data.responseFile ? new File(data.responseFile) : null
    this.declarationFile = data.declarationFile ? new File(data.declarationFile) : null
  }

  getRequestBody(): object {
    return {
      is_waived: this.isWaived,
      file_id: this.responseFile?.id ?? null,
    }
  }

  canRespond(): boolean {
    return (
      this.responseFile !== null &&
      !StringUtil.isNullOrEmpty(this.responseFile.id) &&
      !StringUtil.isNullOrEmpty(this.issuanceId)
    )
  }

  async respond(repository: ReturnType<typeof useCompanyShareIssuanceStore>): Promise<void> {
    if (!this.canRespond()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    await repository.respond(this.issuanceId, data)
    if (repository.error !== null) {
      throw repository.error
    }
  }
}
