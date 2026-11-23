import { ServicePricingPppItem } from "./ServicePricingPppItem"

export class ServicePricingPpp {
  id: string = ""
  servicePricingId: string = ""
  standardPackagingMinLimit: number = 0
  standardPackagingMaxLimit: number = 0
  standardPackagingPrice: number = 0
  premiumPackagingMinLimit: number = 0
  premiumPackagingMaxLimit: number = 0
  premiumPackagingPrice: number = 0
  bulkPackagingMinLimit: number = 0
  bulkPackagingPrice: number = 0
  items: ServicePricingPppItem[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServicePricingPpp) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.servicePricingId = data.service_pricing_id
    this.standardPackagingMinLimit = data.standard_packaging_min_limit
    this.standardPackagingMaxLimit = data.standard_packaging_max_limit
    this.standardPackagingPrice = data.standard_packaging_price
    this.premiumPackagingMinLimit = data.premium_packaging_min_limit
    this.premiumPackagingMaxLimit = data.premium_packaging_max_limit
    this.premiumPackagingPrice = data.premium_packaging_price
    this.bulkPackagingMinLimit = data.bulk_packaging_min_limit
    this.bulkPackagingPrice = data.bulk_packaging_price
    this.items =
      data.items && Array.isArray(data.items)
        ? data.items.map((d: any) => {
            return new ServicePricingPppItem(d)
          })
        : []
  }

  clone(data: ServicePricingPpp): void {
    this.id = data.id
    this.servicePricingId = data.servicePricingId
    this.standardPackagingMinLimit = data.standardPackagingMinLimit
    this.standardPackagingMaxLimit = data.standardPackagingMaxLimit
    this.standardPackagingPrice = data.standardPackagingPrice
    this.premiumPackagingMinLimit = data.premiumPackagingMinLimit
    this.premiumPackagingMaxLimit = data.premiumPackagingMaxLimit
    this.premiumPackagingPrice = data.premiumPackagingPrice
    this.bulkPackagingMinLimit = data.bulkPackagingMinLimit
    this.bulkPackagingPrice = data.bulkPackagingPrice
    this.items = data.items.map((d: any) => {
      return new ServicePricingPppItem(d)
    })
  }

  getRequestBody(): object {
    return {
      service_pricing_id: this.servicePricingId,
      standard_packaging_min_limit: this.standardPackagingMinLimit,
      standard_packaging_max_limit: this.standardPackagingMaxLimit,
      standard_packaging_price: this.standardPackagingPrice,
      premium_packaging_min_limit: this.premiumPackagingMinLimit,
      premium_packaging_max_limit: this.premiumPackagingMaxLimit,
      premium_packaging_price: this.premiumPackagingPrice,
      bulk_packaging_min_limit: this.bulkPackagingMinLimit,
      bulk_packaging_price: this.bulkPackagingPrice,
      items: this.items.map((d: ServicePricingPppItem) => {
        return d.getRequestBody()
      }),
    }
  }
}
