import type { IModel } from "./IModel"

export class MerchandiseDeliveryOption implements IModel<MerchandiseDeliveryOption> {
  id: string = ""
  name: string = ""
  description: string = ""
  baseRate: number = 0
  handlingFee: number = 0
  isWorldwideCoverage: boolean = false
  cutoffTime: string = ""
  isApplicableOnWeekend: boolean = false

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof MerchandiseDeliveryOption) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.baseRate = data.base_rate
    this.handlingFee = data.handling_fee
    this.isWorldwideCoverage = data.is_worldwide_coverage
    this.cutoffTime = data.cutoff_time
    this.isApplicableOnWeekend = data.is_applicable_on_weekend
  }

  clone(data: MerchandiseDeliveryOption): void {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.baseRate = data.baseRate
    this.handlingFee = data.handlingFee
    this.isWorldwideCoverage = data.isWorldwideCoverage
    this.cutoffTime = data.cutoffTime
    this.isApplicableOnWeekend = data.isApplicableOnWeekend
  }

  getRequestBody(): object {
    return {}
  }
}
