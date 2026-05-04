import type { IModel } from "./IModel";

export class CompanySubscription implements IModel<CompanySubscription> {
  id: string = ''
  subscriptionStartDate: Date | null = null
  subscriptionEndDate: Date | null = null
  pastSubscriptions: Array<CompanySubscription> = []
  status: string = ''
  createdAt: string | null = null
  updatedAt: string | null = null
  
  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanySubscription) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.subscriptionStartDate = data.subscription_start_date
    this.subscriptionEndDate = data.subscription_end_date
    this.pastSubscriptions = data.past_subscriptions && Array.isArray(data.past_subscriptions)
      ? data.past_subscriptions.map((ps: any) => {
          return new CompanySubscription(ps)
        })
      : []
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }
  
  clone(data: CompanySubscription): void {
    this.id = data.id
    this.subscriptionStartDate = data.subscriptionStartDate
    this.subscriptionEndDate = data.subscriptionEndDate
    this.pastSubscriptions = data.pastSubscriptions.map((ps: any) => {
      return new CompanySubscription(ps)
    })
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
  
  getRequestBody(): object {
    // At the moment we don't allow any changes from this point
    return {}
  }
}