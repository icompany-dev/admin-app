import type { IModel } from "./IModel"

export class ServicePricingCtcConfig implements IModel<ServicePricingCtcConfig> {
  id: string = ""
  servicePricingId: string = ""
  isCosecAvailablePerPage: boolean = false
  isCosecPerPageSstApplicable: boolean = false
  cosecPerPagePrice: number = 0.0
  isCosecAvailablePerApplication: boolean = false
  isCosecPerApplicationSstApplicable: boolean = false
  cosecPerApplicationPrice: number = 0.0
  isCosecAvailablePerBatch: boolean = false
  isCosecPerBatchSstApplicable: boolean = false
  cosecPerBatchPrice: number = 0.0
  isSsmAvailablePerApplication: boolean = false
  ssmPerApplicationPrice: number = 0.0
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServicePricingCtcConfig) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.servicePricingId = data.service_pricing_id
    this.isCosecAvailablePerPage = data.is_cosec_available_per_page
    this.isCosecPerPageSstApplicable = data.is_cosec_per_page_sst_applicable
    this.cosecPerPagePrice = data.cosec_per_page_price
    this.isCosecAvailablePerApplication = data.is_cosec_available_per_application
    this.isCosecPerApplicationSstApplicable = data.is_cosec_per_application_sst_applicable
    this.cosecPerApplicationPrice = data.cosec_per_application_price
    this.isCosecAvailablePerBatch = data.is_cosec_available_per_batch
    this.isCosecPerBatchSstApplicable = data.is_cosec_per_batch_sst_applicable
    this.cosecPerBatchPrice = data.cosec_per_batch_price
    this.isSsmAvailablePerApplication = data.is_ssm_available_per_application
    this.ssmPerApplicationPrice = data.ssm_per_application_price
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: ServicePricingCtcConfig): void {
    this.id = data.id
    this.servicePricingId = data.servicePricingId
    this.isCosecAvailablePerPage = data.isCosecAvailablePerPage
    this.isCosecPerPageSstApplicable = data.isCosecPerPageSstApplicable
    this.cosecPerPagePrice = data.cosecPerPagePrice
    this.isCosecAvailablePerApplication = data.isCosecAvailablePerApplication
    this.isCosecPerApplicationSstApplicable = data.isCosecPerApplicationSstApplicable
    this.cosecPerApplicationPrice = data.cosecPerApplicationPrice
    this.isCosecAvailablePerBatch = data.isCosecAvailablePerBatch
    this.isCosecPerBatchSstApplicable = data.isCosecPerBatchSstApplicable
    this.cosecPerBatchPrice = data.cosecPerBatchPrice
    this.isSsmAvailablePerApplication = data.isSsmAvailablePerApplication
    this.ssmPerApplicationPrice = data.ssmPerApplicationPrice
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody() {
    return {
      is_cosec_available_per_page: this.isCosecAvailablePerPage,
      is_cosec_per_page_sst_applicable: this.isCosecPerPageSstApplicable,
      cosec_per_page_price: this.cosecPerPagePrice,
      is_cosec_available_per_application: this.isCosecAvailablePerApplication,
      is_cosec_per_application_sst_applicable: this.isCosecPerApplicationSstApplicable,
      cosec_per_application_price: this.cosecPerApplicationPrice,
      is_cosec_available_per_batch: this.isCosecAvailablePerBatch,
      is_cosec_per_batch_sst_applicable: this.isCosecPerBatchSstApplicable,
      cosec_per_batch_price: this.cosecPerBatchPrice,
      is_ssm_available_per_application: this.isSsmAvailablePerApplication,
      ssm_per_application_price: this.ssmPerApplicationPrice,
    }
  }
}
