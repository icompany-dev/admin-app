import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyCommonSealReplacement
  extends Application
  implements IModelApplication<CompanyCommonSealReplacement, ReturnType<typeof useCompanyCommonSealReplacementStore>>
{
  refNo: string = ""
  reason: string = ""
  nullifiedFrom: string = ""
  nullifiedAt: string = ""
  shippedAt: string = ""
  trackingUrl: string = ""
  trackingNumber: string = ""
  withdrawnAt: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyCommonSealReplacement) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no
    this.reason = data.reason
    this.nullifiedFrom = data.nullified_from
    this.nullifiedAt = data.nullified_at
    this.shippedAt = data.shipped_at
    this.trackingUrl = data.tracking_url
    this.trackingNumber = data.tracking_number
    this.withdrawnAt = data.withdrawn_at
  }

  cloneDetails(data: CompanyCommonSealReplacement): void {
    super.clone(data)
    this.refNo = data.refNo
    this.reason = data.reason
    this.nullifiedFrom = data.nullifiedFrom
    this.nullifiedAt = data.nullifiedAt
    this.shippedAt = data.shippedAt
    this.trackingUrl = data.trackingUrl
    this.trackingNumber = data.trackingNumber
    this.withdrawnAt = data.withdrawnAt
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      reason: this.reason,
      nullified_from: this.nullifiedFrom,
      nullified_at: this.nullifiedAt,
      status: this.status,
    }
  }

  async create(repository: ReturnType<typeof useCompanyCommonSealReplacementStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyCommonSealReplacementStore>): Promise<void> {
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

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyCommonSealReplacementStore>): Promise<void> {
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
