import { RegisterOfTransferType } from "../constants/Shareholder"
import { Application } from "./Application"
import { Error } from "../library/Error"
import { CompanyShareholderTransfer } from "./CompanyShareholderTransfer"
import type { IModelApplication } from "./IModelApplication"
import { StringUtil } from "../utils/String"
import { Company } from "./Company"
import { CompanyConstants } from "../constants/Company"

export class CompanyPostShareTransfer
  extends Application
  implements IModelApplication<CompanyPostShareTransfer, ReturnType<typeof useCompanyPostShareTransferStore>>
{
  transferId: string = ""
  section105Date: string | null = null
  isOverThirtyDays: boolean = false
  extensionTo: CompanyPostShareTransfer | null = null
  delayTill: string | null = null
  delayType: string = RegisterOfTransferType.Approval
  reason: string = ""
  shareTransfer: CompanyShareholderTransfer = new CompanyShareholderTransfer()

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyPostShareTransfer) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.transferId = data.transfer_id
    this.section105Date = data.section105_date
    this.isOverThirtyDays = data.is_over_thirty_days
    this.extensionTo = data.extension_to ? new CompanyPostShareTransfer(data.extension_to) : null
    this.delayTill = data.delay_till
    this.delayType = data.delay_type
    this.reason = data.reason
    this.shareTransfer = new CompanyShareholderTransfer(data.share_transfer_application)

    this.relatedApplicationId = this.transferId
    this.relatedApplicationTarget = CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES
  }

  cloneDetails(data: CompanyPostShareTransfer): void {
    super.clone(data)
    this.transferId = data.transferId
    this.section105Date = data.section105Date
    this.isOverThirtyDays = data.isOverThirtyDays
    this.extensionTo = data.extensionTo ? new CompanyPostShareTransfer(data.extensionTo) : null
    this.delayTill = data.delayTill
    this.delayType = data.delayType
    this.reason = data.reason
    this.shareTransfer = new CompanyShareholderTransfer(data.shareTransfer)

    this.relatedApplicationId = this.transferId
    this.relatedApplicationTarget = CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      transfer_id: this.transferId,
      is_over_thirty_days: this.isOverThirtyDays,
      delay_type: this.delayType,
      delay_till: this.delayTill,
      reason: this.reason,

      status: this.status,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.transferId) &&
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.delayType)
    )
  }

  async create(repository: ReturnType<typeof useCompanyPostShareTransferStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyPostShareTransferStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyPostShareTransferStore>): Promise<void> {
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

  setDataFromShareTransfer(shareTransfer: CompanyShareholderTransfer): void {
    this.companyId = shareTransfer.companyId
    this.company = new Company(shareTransfer.company)
    this.transferId = shareTransfer.id
    this.shareTransfer = new CompanyShareholderTransfer(shareTransfer)
  }
}
