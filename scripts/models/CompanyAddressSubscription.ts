import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyAddressSubscription
  extends Application
  implements IModelApplication<CompanyAddressSubscription, ReturnType<typeof useCompanyAddressSubscriptionStore>>
{
  subscriptionPeriod: string = "annually"
  startDate: string = ""
  endDate: string = ""
  isNotified: boolean = false
  lastNotifiedAt: string | null = null
  isAcknowledged: boolean = false
  acknowledgedAt: string | null = null
  acknowledgedById: string | null = null
  renewedAt: string = ""
  previousSubscriptionId: string | null = null

  constructor(data: any | null = null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyAddressSubscription) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.subscriptionPeriod = data.subscription_period
    this.startDate = data.start_date
    this.endDate = data.end_date
    this.isNotified = data.is_notified
    this.lastNotifiedAt = data.last_notified_at
    this.isAcknowledged = data.is_acknowledged
    this.acknowledgedAt = data.acknowledged_at
    this.acknowledgedById = data.acknowledged_by_id
    this.renewedAt = data.renewed_at
    this.previousSubscriptionId = data.previous_subscription_id
  }

  cloneDetails(data: CompanyAddressSubscription): void {
    super.clone(data)
    this.subscriptionPeriod = data.subscriptionPeriod
    this.startDate = data.startDate
    this.endDate = data.endDate
    this.isNotified = data.isNotified
    this.lastNotifiedAt = data.lastNotifiedAt
    this.isAcknowledged = data.isAcknowledged
    this.acknowledgedAt = data.acknowledgedAt
    this.acknowledgedById = data.acknowledgedById
    this.renewedAt = data.renewedAt
    this.previousSubscriptionId = data.previousSubscriptionId
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      subscription_period: this.subscriptionPeriod,
      start_date: this.startDate,
      end_date: this.endDate,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyAddressSubscriptionStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyAddressSubscriptionStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyAddressSubscriptionStore>): Promise<void> {
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
