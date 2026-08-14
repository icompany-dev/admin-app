import type { useCompanyShareholderTransferNoticeStore } from "~/stores/CompanyShareholderTransferNotices"
import { Application } from "./Application"
import { File } from "./File"
import type { IModelApplication } from "./IModelApplication"
import { User } from "./User"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyShareholderTransferNotice
  extends Application
  implements
    IModelApplication<CompanyShareholderTransferNotice, ReturnType<typeof useCompanyShareholderTransferNoticeStore>>
{
  initiator: User = new User()
  noticeDate: string = ""
  signature: File | null = null
  transferId: string | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyShareholderTransferNotice) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.transferId = data.share_transfer_application ? data.share_transfer_application.id : null
    this.initiator = new User(data.initiator)
    this.noticeDate = data.notice_date
    this.signature = data.signature ? new File(data.signature) : null
  }

  cloneDetails(data: CompanyShareholderTransferNotice): void {
    super.clone(data)
    this.transferId = data.transferId
    this.initiator = new User(data.initiator)
    this.noticeDate = data.noticeDate
    this.signature = data.signature ? new File(data.signature) : null
  }

  getRequestBody(): object {
    return {
      notice_date: this.noticeDate,
      signature_id: this.signature?.id ?? null,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.noticeDate) && !StringUtil.isNullOrEmpty(this.signature?.id ?? "")
  }

  async create(repository: ReturnType<typeof useCompanyShareholderTransferNoticeStore>): Promise<void> {
    throw new Error(Error.ERROR_TYPE_CODE, "function not implemented")
  }

  async update(repository: ReturnType<typeof useCompanyShareholderTransferNoticeStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyShareholderTransferNoticeStore>): Promise<void> {
    throw new Error(Error.ERROR_TYPE_CODE, "function not implemented")
  }
}
