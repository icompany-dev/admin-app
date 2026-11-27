import { StringUtil } from "../utils/String"
import { ServicePricingConfig } from "./ServicePricingConfig"
import { ServicePricingDiscount } from "./ServicePricingDiscount"
import { ServicePricingCtcConfig } from "./ServicePricingCtcConfig"
import { ServicePricingDeliveryConfig } from "./ServicePricingDeliveryConfig"
import { ServicePricingOptionConfig } from "./ServicePricingOptionConfig"
import { ServicePricingBreakdown } from "./ServicePricingBreakdown"
import { ServicePricingMandatory } from "./ServicePricingMandatory"
import { ServicePricingOptional } from "./ServicePricingOptional"
import type { IModel } from "./IModel"
import { Error } from "../library/Error"
import { ServicePricingPpp } from "./ServicePricingPpp"
import { ServicePricingCtcDiscount } from "./ServicePricingCtcDiscount"

export class ServicePricing implements IModel<ServicePricing> {
  id: string = ""
  serviceName: string = ""
  serviceTarget: string = ""
  isDefault: boolean = true
  breakdowns: ServicePricingBreakdown[] = []
  mandatoryServices: ServicePricingMandatory[] = []
  isLateLodgementApplicable: boolean = false
  lateLodgementBaseFee: number | null = null
  lateLodgementCosecServiceFee: number | null = null
  lateLodgementHandlingFee: number | null = null
  canExpressFiling: boolean = false
  expressFilingFee: number = 0.0
  config: ServicePricingConfig = new ServicePricingConfig()
  ctcConfig: ServicePricingCtcConfig = new ServicePricingCtcConfig()
  ctcDiscounts: ServicePricingCtcDiscount[] = []
  deliveryConfig: ServicePricingDeliveryConfig = new ServicePricingDeliveryConfig()
  optionConfig: ServicePricingOptionConfig = new ServicePricingOptionConfig()
  optionals: ServicePricingOptional[] = []
  volume: number = 0.0
  weight: number = 0.0
  discount: ServicePricingDiscount = new ServicePricingDiscount()
  paperPrintingPackagings: ServicePricingPpp[] = []
  baseGrandTotal: number = 0.0
  status = "draft"
  createdAt: string = ""
  updatedAt: string = ""

  //display purposes?
  isThirdPartyService: boolean = false
  isCustom: boolean = false

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServicePricing) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.serviceName = data.service_name.toUpperCase()
    this.serviceTarget = data.service_target
    this.isDefault = data.is_default
    this.breakdowns =
      data.breakdowns && Array.isArray(data.breakdowns)
        ? data.breakdowns.map((bd: any) => {
            return new ServicePricingBreakdown(bd)
          })
        : []
    this.mandatoryServices =
      data.mandatory_services && Array.isArray(data.mandatory_services)
        ? data.mandatory_services.map((ms: any) => {
            return new ServicePricingMandatory(ms)
          })
        : []
    this.isLateLodgementApplicable = data.is_late_lodgement_applicable
    this.lateLodgementBaseFee = data.late_lodgement_base_fee
    this.lateLodgementCosecServiceFee = data.late_lodgement_cosec_service_fee
    this.lateLodgementHandlingFee = data.late_lodgement_handling_fee
    this.canExpressFiling = data.can_express_filing
    this.expressFilingFee = parseFloat(data.express_filing_fee)
    this.config = new ServicePricingConfig(data.config)
    this.ctcConfig = new ServicePricingCtcConfig(data.ctc_config)
    this.ctcDiscounts =
      data.ctc_discounts && Array.isArray(data.ctc_discounts)
        ? data.ctc_discounts.map((d: any) => {
            return new ServicePricingCtcDiscount(d)
          })
        : []
    this.deliveryConfig = new ServicePricingDeliveryConfig(data.delivery_config)
    this.optionConfig = new ServicePricingOptionConfig(data.option_config)
    this.optionals =
      data.optionals && Array.isArray(data.optionals)
        ? data.optionals.map((opt: any) => {
            return new ServicePricingOptional(opt)
          })
        : []
    this.volume = data.volume ?? 0.0
    this.weight = data.weight ?? 0.0
    this.discount = new ServicePricingDiscount(data.discount)
    this.paperPrintingPackagings =
      data.paper_printing_packagings && Array.isArray(data.paper_printing_packagings)
        ? data.paper_printing_packagings.map((d: any) => {
            return new ServicePricingPpp(d)
          })
        : []
    this.baseGrandTotal = parseFloat(data.base_grand_total)
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at

    this.isThirdPartyService = data.is_third_party_service ?? false
  }

  clone(data: ServicePricing): void {
    this.id = data.id
    this.serviceName = data.serviceName
    this.serviceTarget = data.serviceTarget
    this.isDefault = data.isDefault
    this.breakdowns = data.breakdowns.map((bd: ServicePricingBreakdown) => {
      return new ServicePricingBreakdown(bd)
    })
    this.mandatoryServices = data.mandatoryServices.map((ms: ServicePricingMandatory) => {
      return new ServicePricingMandatory(ms)
    })
    this.isLateLodgementApplicable = data.isLateLodgementApplicable
    this.lateLodgementBaseFee = data.lateLodgementBaseFee
    this.lateLodgementCosecServiceFee = data.lateLodgementCosecServiceFee
    this.lateLodgementHandlingFee = data.lateLodgementHandlingFee
    this.canExpressFiling = data.canExpressFiling
    this.expressFilingFee = data.expressFilingFee
    this.config = new ServicePricingConfig(data.config)
    this.ctcConfig = new ServicePricingCtcConfig(data.ctcConfig)
    this.ctcDiscounts = data.ctcDiscounts.map((d: any) => {
      return new ServicePricingCtcDiscount(d)
    })
    this.deliveryConfig = new ServicePricingDeliveryConfig(data.deliveryConfig)
    this.optionConfig = new ServicePricingOptionConfig(data.optionConfig)
    this.optionals = data.optionals.map((opt: ServicePricingOptional) => {
      return new ServicePricingOptional(opt)
    })
    this.volume = data.volume ?? 0.0
    this.weight = data.weight ?? 0.0
    this.discount = new ServicePricingDiscount(data.discount)
    this.paperPrintingPackagings = data.paperPrintingPackagings.map((d: ServicePricingPpp) => {
      return new ServicePricingPpp(d)
    })
    this.baseGrandTotal = data.baseGrandTotal
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt

    this.isThirdPartyService = data.isThirdPartyService
  }

  getRequestBody() {
    this.setBaseGrandTotal()

    return {
      service_name: this.serviceName,
      service_target: this.serviceTarget,
      is_default: this.isDefault,
      breakdowns: this.breakdowns.map((bd) => {
        return bd.getRequestBody()
      }),
      mandatories:
        this.mandatoryServices.length > 0
          ? this.mandatoryServices.map((ms) => {
              return ms.getRequestBody()
            })
          : null,
      is_late_lodgement_applicable: this.isLateLodgementApplicable,
      late_lodgement_base_fee: this.lateLodgementBaseFee,
      late_lodgement_cosec_service_fee: this.lateLodgementCosecServiceFee,
      late_lodgement_handling_fee: this.lateLodgementHandlingFee,
      can_express_filing: this.canExpressFiling,
      express_filing_fee: this.expressFilingFee,
      config: this.config.getRequestBody(),
      ctc_config: this.ctcConfig.getRequestBody(),
      ctc_discounts: this.ctcDiscounts.map((d: ServicePricingCtcDiscount) => {
        return d.getRequestBody()
      }),
      delivery_config: this.deliveryConfig.getRequestBody(),
      option_config: this.optionConfig.getRequestBody(),
      optionals:
        this.optionals.length > 0
          ? this.optionals.map((opt) => {
              return opt.getRequestBody()
            })
          : null,
      discount: this.discount.getRequestBody(),
      ppps: this.paperPrintingPackagings.map((d: ServicePricingPpp) => {
        return d.getRequestBody()
      }),
      base_grand_total: this.baseGrandTotal,
      status: this.status,
      is_custom: this.isCustom,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.serviceName) && this.breakdowns.length > 0
  }

  description() {
    let breakdownNames = this.breakdowns.map((bd: ServicePricingBreakdown) => {
      return bd.itemName
    })

    let mandatoryNames = this.mandatoryServices.map((ms: ServicePricingMandatory) => {
      return ms.mandatoryServicePrice.serviceName
    })

    let names = breakdownNames.concat(mandatoryNames)

    return `<ul class='padding-zero'>
      ${names
        .map((d: string) => {
          return `<li>${StringUtil.capitalize(d)}</li>`
        })
        .join("")}
      </ul>
    `
  }

  async create(repository: ReturnType<typeof useServicePricingStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof useServicePricingStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useServicePricingStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }

  setBaseGrandTotal(): void {
    let totalBreakdowns = this.breakdowns.reduce((a: number, b: ServicePricingBreakdown) => {
      return a + Number(b.price)
    }, 0)

    let totalMandatories = this.mandatoryServices.reduce((a: number, b: ServicePricingMandatory) => {
      return a + Number(b.basePrice)
    }, 0)

    this.baseGrandTotal =
      totalBreakdowns + totalMandatories + Number(this.config.cosecServiceFee) + Number(this.config.digitalServiceFee)
  }
}
