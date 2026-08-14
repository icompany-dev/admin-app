import { ShareDistributionMethod, ShareType } from "../constants/Shareholder"
import { StatusConstants } from "../constants/Status"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { CompanyShareIssuanceResponse } from "./CompanyShareIssuanceResponse"
import { CompanyShareholderAllotment } from "./CompanyShareholderAllotment"
import type { IModelApplication } from "./IModelApplication"
import { User } from "./User"
import { Error } from "~/scripts/library/Error"

export class CompanyShareIssuance
  extends Application
  implements IModelApplication<CompanyShareIssuance, ReturnType<typeof useCompanyShareIssuanceStore>>
{
  sharesToIssue: number = 0
  shareType: ShareType = ShareType.Ordinary
  pricePerShare: number = 0.0
  distributionMethod: ShareDistributionMethod = ShareDistributionMethod.ByPercentage
  startDate: string = ""
  noticePeriod: number = 7
  initiator: User = new User()
  responses: CompanyShareIssuanceResponse[] = []
  allotmentId: string | null = null
  allotment: CompanyShareholderAllotment | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyShareIssuance) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.sharesToIssue = data.shares_to_issue
    this.shareType = data.share_type
    this.pricePerShare = data.price_per_share
    this.distributionMethod = data.distribution_method
    this.startDate = data.start_date
    this.noticePeriod = data.notice_period
    this.initiator = new User(data.initiator)
    this.responses =
      data.responses && Array.isArray(data.responses)
        ? data.responses.map((d: any) => {
            return new CompanyShareIssuanceResponse(d)
          })
        : []
    this.allotmentId = data.allotment_id ?? null
    this.allotment = data.allotment ? new CompanyShareholderAllotment(data.allotment) : null
    if (this.allotmentId === null && this.allotment !== null) {
      this.allotmentId = this.allotment.id
    }
  }

  cloneDetails(data: any): void {
    super.clone(data)
    this.sharesToIssue = data.sharesToIssue
    this.shareType = data.shareType
    this.pricePerShare = data.pricePerShare
    this.distributionMethod = data.distributionMethod
    this.startDate = data.startDate
    this.noticePeriod = data.noticePeriod
    this.initiator = new User(data.initiator)
    this.responses = data.responses.map((d: any) => {
      return new CompanyShareIssuanceResponse(d)
    })
    this.allotmentId = data.allotmentId ?? null
    this.allotment = data.allotment ? new CompanyShareholderAllotment(data.allotment) : null
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      shares_to_issue: this.sharesToIssue,
      share_type: this.shareType,
      price_per_share: this.pricePerShare,
      distribution_method: this.distributionMethod,
      status: this.status,
      notice_period: this.noticePeriod,
      allotment_id: this.allotmentId,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && this.sharesToIssue > 0
  }

  async create(repository: ReturnType<typeof useCompanyShareIssuanceStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.initiate(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyShareIssuanceStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyShareIssuanceStore>): Promise<void> {
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

  canIssue(): boolean {
    if (this.status === StatusConstants.RESPONDED || this.status === StatusConstants.ISSUED) {
      return true
    }

    if (this.noticePeriod === 0) {
      return true // we don't wait
    }

    let dayjs = useDayjs()
    let expiryDate = dayjs(this.startDate).add(this.noticePeriod, "days").endOf("day")

    return dayjs().isAfter(expiryDate)
  }
}
