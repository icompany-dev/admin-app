import { ControlledServicePricingId, CtcConstants, DeliveryConstants } from "../constants/Payment"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import type { IModel } from "./IModel"
import { PaymentCartItemOptional } from "./PaymentCartItemOptional"
import { ServicePricing } from "./ServicePricing"
import type { ServicePricingBreakdown } from "./ServicePricingBreakdown"
import type { ServicePricingMandatory } from "./ServicePricingMandatory"
import { ServicePricingOptional } from "./ServicePricingOptional"
import { User } from "./User"
import _ from "lodash"

export class PaymentCartItem implements IModel<PaymentCartItem> {
  id: string = ""
  paymentCartId: string = ""
  servicePricingId: string = ""
  servicePricing: ServicePricing = new ServicePricing()
  additionalServicePricingIds: string[] = []
  additionalServicePricings: ServicePricing[] = []
  quantity: number = 1
  targetType: string = ""
  targetId: string = ""
  target: any | null = null
  isExpressFilingRequired: boolean = false
  expressFilingAmount: number = 0.0
  isLateLodgement: boolean = false
  lateLodgementFees: number | null = null
  discountPercent: number = 0.0
  discountAmount: number = 0.0
  subtotal: number = 0.0
  isCtcRequired: boolean = false
  ctcBy: string | null = null
  ctcType: string | null = CtcConstants.CTC_TYPE_NONE
  ctcCopies: string | null = null
  ctcAmount: number | null = null
  numberOfPages: number = 1
  isDeliveryRequired: boolean = false
  deliveryType: string | null = DeliveryConstants.DELIVERY_NONE
  deletedBy: User | null = null
  createdAt: string = ""
  updatedAt: string = ""

  optionals: PaymentCartItemOptional[] = []
  //Display purposes
  selectedOptionals: ServicePricingOptional[] = []
  selectedDocumentNames: string[] = []
  isDisableCtcSelection: boolean = false
  showTotalPagesToCtc: boolean = false
  isDisableDeliverySelection: boolean = false

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentCartItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }

    if (StringUtil.isNullOrEmpty(this.ctcBy)) [(this.ctcBy = CtcConstants.CTC_TYPE_NONE)]
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.paymentCartId = data.payment_cart_id
    this.servicePricingId = data.service_pricing_id
    this.servicePricing = new ServicePricing(data.service_price)
    this.additionalServicePricingIds = JSON.parse(data.additional_service_pricing_ids) ?? []
    this.additionalServicePricings =
      data.additional_service_prices && Array.isArray(data.additional_service_prices)
        ? data.additional_service_prices.map((asp: any) => {
            return new ServicePricing(asp)
          })
        : []
    this.quantity = data.quantity ?? 1
    this.targetType = data.target_type
    this.targetId = data.target_id
    this.target = _.cloneDeep(data.target)
    this.isExpressFilingRequired = data.is_express_filing_required
    this.expressFilingAmount = data.express_filing_amount
    this.isLateLodgement = data.is_late_lodgement
    this.lateLodgementFees = Number(data.late_lodgement_fees ?? 0)
    this.discountPercent = Number(data.discount_percent ?? 0)
    this.discountAmount = Number(data.discount_amount ?? 0)
    this.subtotal = Number(data.subtotal)
    this.isCtcRequired = data.is_ctc_required
    this.ctcBy = data.ctc_by
    this.ctcType = data.ctc_type
    this.ctcCopies = data.ctc_copies
    this.ctcAmount = Number(data.ctc_amount) ?? 0
    this.isDeliveryRequired = data.is_delivery_required
    this.deliveryType = data.delivery_type
    this.numberOfPages = data.number_of_pages ?? 1
    this.deletedBy = data.deleted_by !== null ? new User(data.deleted_by) : null
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at

    this.optionals =
      data.optionals && Array.isArray(data.optionals)
        ? data.optionals.map((d: any) => {
            return new PaymentCartItemOptional(d)
          })
        : []
    this.selectedOptionals = []
  }

  clone(data: PaymentCartItem): void {
    this.id = data.id
    this.paymentCartId = data.paymentCartId
    this.servicePricingId = data.servicePricingId
    this.servicePricing = new ServicePricing(data.servicePricing)
    this.additionalServicePricingIds = [...data.additionalServicePricingIds]
    this.additionalServicePricings = data.additionalServicePricings.map((asp: ServicePricing) => {
      return new ServicePricing(asp)
    })
    this.quantity = data.quantity
    this.targetType = data.targetType
    this.targetId = data.targetId
    this.target = _.cloneDeep(data.target)
    this.isExpressFilingRequired = data.isExpressFilingRequired
    this.expressFilingAmount = data.expressFilingAmount
    this.isLateLodgement = data.isLateLodgement
    this.lateLodgementFees = Number(data.lateLodgementFees)
    this.discountPercent = Number(data.discountPercent)
    this.discountAmount = Number(data.discountAmount)
    this.subtotal = Number(data.subtotal)
    this.isCtcRequired = data.isCtcRequired
    this.ctcBy = data.ctcBy
    this.ctcType = data.ctcType
    this.ctcCopies = data.ctcCopies
    this.ctcAmount = data.ctcAmount
    this.isDeliveryRequired = data.isDeliveryRequired
    this.deliveryType = data.deliveryType
    this.numberOfPages = data.numberOfPages ?? 1
    this.deletedBy = data.deletedBy !== null ? new User(data.deletedBy) : null
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt

    this.optionals = data.optionals.map((d: PaymentCartItemOptional) => {
      return new PaymentCartItemOptional(d)
    })

    this.selectedOptionals = data.selectedOptionals.map((d: ServicePricingOptional) => {
      return new ServicePricingOptional(d)
    })

    this.selectedDocumentNames = data.selectedDocumentNames
    this.isDisableCtcSelection = data.isDisableCtcSelection
    this.showTotalPagesToCtc = data.showTotalPagesToCtc
    this.isDisableDeliverySelection = data.isDisableDeliverySelection
  }

  getRequestBody(): object {
    return {
      service_pricing_id: this.servicePricingId,
      target_type: this.targetType,
      target_id: this.targetId,
      quantity: this.quantity,
      discount_percent: this.discountPercent,
      discount_amount: this.discountAmount,
      is_express_filing_required: this.isExpressFilingRequired,
      express_filing_amount: this.expressFilingAmount,
      is_late_lodgement: this.isLateLodgement,
      late_lodgement_fees: this.lateLodgementFees,
      subtotal: this.subtotal,
      is_ctc_required: this.isCtcRequired,
      ctc_by: this.ctcBy,
      ctc_type: this.ctcType,
      ctc_copies: this.ctcCopies,
      ctc_amount: this.ctcAmount,
      is_delivery_required: this.isDeliveryRequired,
      delivery_type: this.deliveryType,
      additional_service_pricing_ids: this.additionalServicePricingIds,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.servicePricingId) &&
      !StringUtil.isNullOrEmpty(this.targetType) &&
      !StringUtil.isNullOrEmpty(this.targetId)
    )
  }

  setIsCtcRequired(): void {
    this.isCtcRequired = this.ctcBy !== CtcConstants.CTC_TYPE_NONE
  }

  setIsDeliveryRequired(): void {
    this.isDeliveryRequired = this.deliveryType !== DeliveryConstants.DELIVERY_NONE
  }

  totalBreakdowns(): number {
    let total = this.servicePricing.breakdowns
      .map((bd: ServicePricingBreakdown) => {
        return bd.price
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)

    return total * this.quantity
  }

  totalAdditionalService(): number {
    return this.additionalServicePricings
      .map((servicePricing) => {
        return servicePricing.breakdowns
          .map((bd) => {
            return bd.price
          })
          .reduce((a: number, b: number) => {
            return a + b
          }, 0)
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)
  }

  totalMandatories(): number {
    let total = this.servicePricing.mandatoryServices
      .map((ms: ServicePricingMandatory) => {
        return ms.basePrice ?? 0
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)

    return total * this.quantity
  }

  totalAdditionalServicePricings(): number {
    if (this.additionalServicePricings.length === 0 && this.additionalServicePricingIds.length !== 0) {
      throw new Error(
        Error.ERROR_TYPE_CODE,
        "Additional service pricing ids are provided but additional service pricings are not set"
      )
    }

    return this.additionalServicePricings
      .map((asp: ServicePricing) => {
        return Number(asp.baseGrandTotal) ?? 0
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)
  }

  cosecServiceFee(): number {
    let config = this.servicePricing.config
    if (!config.isCosecServiceFeeMandatory) {
      if (this.isLateLodgement && this.lateLodgementFees !== null && this.lateLodgementFees > 0) {
        return 20
      }

      return 0.0
    }

    let cosecServiceFee = Number(config.cosecServiceFee)

    if (this.isLateLodgement && this.lateLodgementFees !== null && this.lateLodgementFees > 0) {
      cosecServiceFee = cosecServiceFee + 20
    }

    if (config.isCsfSstApplicable) {
      cosecServiceFee = 1.08 * cosecServiceFee
    }

    cosecServiceFee = Math.round(cosecServiceFee * 100) / 100

    return cosecServiceFee
  }

  hasDigitalServiceFee(): boolean {
    let config = this.servicePricing.config

    return (
      config.isDsfMandatory ||
      (config.isDsfMandatoryWithCtc && this.isCtcRequired) ||
      (config.isDsfMandatoryWithDelivery && this.isDeliveryRequired)
    )
  }

  digitalServiceFee(): number {
    let config = this.servicePricing.config

    let digitalServiceFee: number = 0
    if (this.hasDigitalServiceFee()) {
      digitalServiceFee = config.digitalServiceFee
      if (config.isDsfDstApplicable) {
        digitalServiceFee = 1.08 * digitalServiceFee
      }
    }

    digitalServiceFee = Math.round(digitalServiceFee * 100) / 100

    return digitalServiceFee
  }

  hasHandlingFees(): boolean {
    let config = this.servicePricing.config
    return (
      (config.isHfMandatoryWithCtc && this.isCtcRequired) ||
      (config.isHfMandatoryWithDelivery && this.isDeliveryRequired) ||
      config.handlingFees > 0
    )
  }

  handlingFees(): number {
    let config = this.servicePricing.config
    let handlingFees: number = 0

    if (this.hasHandlingFees()) {
      handlingFees = Number(config.handlingFees)
      if (
        this.deliveryType === DeliveryConstants.DELIVERY_EMAIL ||
        this.deliveryType === DeliveryConstants.DELIVERY_WHATSAPP
      ) {
        handlingFees += Number(5)
      }

      if (this.isLateLodgement && this.lateLodgementFees !== null && this.lateLodgementFees > 0) {
        handlingFees = handlingFees + 5
      }

      if (config.isHfSstApplicable) {
        handlingFees = 1.08 * handlingFees
      }
    }

    handlingFees = Math.round(handlingFees * 100) / 100

    return handlingFees
  }

  setCtcAmount(): void {
    if (!this.isCtcRequired) {
      this.ctcAmount = 0.0
      return
    }

    let ctcConfig = this.servicePricing.ctcConfig
    let ctcAmount: number = 0
    if (this.ctcType === CtcConstants.CTC_OPTION_PAGE) {
      ctcAmount = this.numberOfPages * ctcConfig.cosecPerPagePrice
      if (ctcConfig.isCosecPerPageSstApplicable) {
        ctcAmount = 1.08 * ctcAmount
      }
    } else if (this.ctcType === CtcConstants.CTC_OPTION_APPLICATION) {
      if (this.ctcBy === CtcConstants.CTC_TYPE_SSM) {
        ctcAmount = ctcConfig.ssmPerApplicationPrice
      } else {
        ctcAmount = ctcConfig.cosecPerApplicationPrice
        if (ctcConfig.isCosecPerApplicationSstApplicable) {
          ctcAmount = 1.08 * ctcAmount
        }
      }
    } else {
      ctcAmount = ctcConfig.cosecPerBatchPrice
      if (ctcConfig.isCosecPerBatchSstApplicable) {
        ctcAmount = 1.08 * ctcAmount
      }
    }

    switch (this.ctcCopies) {
      case CtcConstants.CTC_COPIES_DUPLICATE:
        ctcAmount = ctcAmount * 2
        break
      case CtcConstants.CTC_COPIES_TRIPLICATE:
        ctcAmount = ctcAmount * 5
        break
    }

    this.ctcAmount = Math.round(ctcAmount * 100) / 100
  }

  deliveryCost(): number {
    if (!this.isDeliveryRequired) {
      return 0.0
    }

    let deliveryConfig = this.servicePricing.deliveryConfig
    let deliveryCost: number = 0

    // TODO: improve deliveryCost based on weight and Volume cubic meter here

    switch (this.deliveryType) {
      case DeliveryConstants.DELIVERY_OUR_FLEET:
        deliveryCost += Number(deliveryConfig.ourFleetPrice)
        break
      case DeliveryConstants.DELIVERY_SELF_PICKUP:
        deliveryCost += Number(deliveryConfig.selfPickupPrice)
        break
      case DeliveryConstants.DELIVERY_COURIER:
        deliveryCost += Number(deliveryConfig.courierPrice)
        break
      case DeliveryConstants.DELIVERY_INTERNATIONAL:
        deliveryCost += Number(deliveryConfig.internationalDeliveryPrice)
        break
    }

    deliveryCost = Math.round(deliveryCost * 100) / 100

    return deliveryCost
  }

  paperPrintPackageCost(): number {
    if (!this.isDeliveryRequired) {
      return 0
    }

    return this.deliveryType !== DeliveryConstants.DELIVERY_EMAIL &&
      this.deliveryType !== DeliveryConstants.DELIVERY_WHATSAPP
      ? 10
      : 0
  }

  totalOptionals(): number {
    let totalOptionals = this.optionals
      .filter((opt: PaymentCartItemOptional) => {
        return this.selectedOptionals.some((so: ServicePricingOptional) => {
          return (
            so.optionalServiceId === opt.servicePricingId &&
            so.optionalServicePrice.serviceName === opt.servicePricing.serviceName
          )
        })
      })
      .map((opt: PaymentCartItemOptional) => {
        return opt.servicePricing.baseGrandTotal + (opt.lateLodgementFees ?? 0.0)
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0.0)

    // let totalSelectedOptionals = this.selectedOptionals
    //   .map((opt: ServicePricingOptional) => {
    //     return Number(opt.optionalServicePrice.baseGrandTotal) + (opt.optionalServicePrice.lateLodgementBaseFee ?? 0.0)
    //   })
    //   .reduce((a: number, b: number) => {
    //     return a + b
    //   }, 0.0)

    return Number(totalOptionals)
  }

  totalExpressFiling(): number {
    return this.expressFilingAmount
  }

  totalBeforeDiscount(): number {
    return this.subtotal + Number(this.discountAmount ?? 0.0)
  }

  setDiscountAmount(): void {
    if (this.servicePricingId !== ControlledServicePricingId.YearlySubscription) {
      return
    }

    if (this.quantity < 3) {
      this.discountPercent = 0
      this.discountAmount = 0
      return
    }

    if (this.quantity < 5) {
      this.discountPercent = 10
      this.discountAmount = 0.1 * this.totalBreakdowns()
    }

    if (this.quantity === 5) {
      this.discountPercent = 15
      this.discountAmount = 0.15 * this.totalBreakdowns()
    }
  }

  setSubtotal(): void {
    this.subtotal =
      Number(this.totalBreakdowns()) +
      Number(this.totalMandatories()) +
      Number(this.totalAdditionalServicePricings()) +
      Number(this.cosecServiceFee()) +
      Number(this.digitalServiceFee()) +
      Number(this.handlingFees()) +
      Number(this.ctcAmount ?? 0.0) +
      Number(this.deliveryCost()) +
      Number(this.paperPrintPackageCost()) +
      Number(this.totalOptionals()) +
      Number(this.totalExpressFiling()) +
      Number(this.lateLodgementFees ?? 0.0) -
      Number(this.discountAmount ?? 0.0)

    this.subtotal = Number(this.subtotal)
  }

  async remove(repository: ReturnType<typeof usePaymentCartStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.removeFromCart(this.paymentCartId, this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return
  }
}
