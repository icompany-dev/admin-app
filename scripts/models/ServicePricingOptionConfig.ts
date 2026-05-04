import type { IModel } from "./IModel"

export class ServicePricingOptionConfig implements IModel<ServicePricingOptionConfig> {
  id: string = ""
  servicePricingId: string | null = null
  hasOptionUponCompletion: boolean = false
  hasOutcomeOptionUponCompletion: boolean = false
  hasRecommendedService: boolean = false
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServicePricingOptionConfig) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.servicePricingId = data.service_pricing_id
    this.hasOptionUponCompletion = data.has_option_upon_completion
    this.hasOutcomeOptionUponCompletion = data.has_outcome_option_upon_completion
    this.hasRecommendedService = data.has_recommended_service
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: ServicePricingOptionConfig): void {
    this.id = data.id
    this.servicePricingId = data.servicePricingId
    this.hasOptionUponCompletion = data.hasOptionUponCompletion
    this.hasOutcomeOptionUponCompletion = data.hasOutcomeOptionUponCompletion
    this.hasRecommendedService = data.hasRecommendedService
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody() {
    return {
      has_option_upon_completion: this.hasOptionUponCompletion,
      has_outcome_option_upon_completion: this.hasOutcomeOptionUponCompletion,
      has_recommended_service: this.hasRecommendedService,
    }
  }
}
