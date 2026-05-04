import { DeliveryConstants } from "../constants/Payment"
import { StringUtil } from "../utils/String"
import type { IModel } from "./IModel"
import type { PaymentCartItem } from "./PaymentCartItem"
import type { PaymentCartItemOptional } from "./PaymentCartItemOptional"
import { PaymentOrderItemBreakdown } from "./PaymentOrderItemBreakdown"
import { PaymentOrderItemDelivery } from "./PaymentOrderItemDelivery"
import { PaymentOrderItemMandatory } from "./PaymentOrderItemMandatory"
import { PaymentOrderItemOptional } from "./PaymentOrderItemOptional"
import { ServicePricing } from "./ServicePricing"
import { ServicePricingBreakdown } from "./ServicePricingBreakdown"
import type { ServicePricingMandatory } from "./ServicePricingMandatory"
import type { ServicePricingOptional } from "./ServicePricingOptional"

export class PaymentOrderItem implements IModel<PaymentOrderItem> {
  id: string = ""
  paymentOrderId: string = ""
  servicePricingId: string = ""
  additionalServicePricingIds: string[] = []
  additionalServicePricings: ServicePricing[] = []
  serviceName: string = ""
  quantity: number = 1
  targetType: string = ""
  targetId: string = ""
  discountPercent: number = 0
  discountAmount: number = 0
  isExpressFilingRequired: boolean = false
  expressFilingAmount: number = 0.0
  isLateLodgement: boolean = false
  lateLodgementFees: number | null = null
  cosecServiceFee: number = 0
  isCsfSstApplicable: boolean = false
  digitalServiceFee: number = 0
  isDsfDstApplicable: boolean = false
  handlingFees: number = 0
  isHfSstApplicable: boolean = false
  subtotal: number = 0
  isCtcRequired: boolean = false
  ctcBy: string | null = null
  ctcType: string | null = null
  ctcCopies: string | null = null
  ctcAmount: number | null = null
  isDeliveryRequired: boolean = false
  deliveryType: string | null = null
  status: string = "unpaid"
  paidAt: string | null = null
  paidBy: string | null = null
  breakdowns: PaymentOrderItemBreakdown[] = []
  mandatories: PaymentOrderItemMandatory[] = []
  optionals: PaymentOrderItemOptional[] = []
  delivery: PaymentOrderItemDelivery | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  //for data clone purposes
  paymentCartItemId: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentOrderItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.paymentOrderId = data.payment_order_id
    this.servicePricingId = data.service_pricing_id
    this.additionalServicePricingIds = data.additional_service_pricing_ids
      ? Array.isArray(data.additional_service_pricing_ids)
        ? data.additional_service_pricing_ids
        : JSON.parse(data.additional_service_pricing_ids)
      : []
    this.additionalServicePricings =
      data.additional_service_pricings && Array.isArray(data.additional_service_pricings)
        ? data.additional_service_pricings.map((asp: any) => {
            return new ServicePricing(asp)
          })
        : []
    this.serviceName = data.service_name
    this.quantity = data.quantity
    this.targetType = data.target_type
    this.targetId = data.target_id
    this.discountPercent = data.discount_percent
    this.discountAmount = data.discount_amount
    this.isExpressFilingRequired = data.is_express_filing_required
    this.expressFilingAmount = data.express_filing_amount ?? 0.0
    this.isLateLodgement = data.is_late_lodgement
    this.lateLodgementFees = data.late_lodgement_fees
    this.cosecServiceFee = data.cosec_service_fee
    this.isCsfSstApplicable = data.is_csf_sst_applicable
    this.digitalServiceFee = data.digital_service_fee
    this.isDsfDstApplicable = data.is_dsf_dst_applicable
    this.handlingFees = data.handling_fees
    this.isHfSstApplicable = data.is_hf_sst_applicable
    this.subtotal = data.subtotal
    this.isCtcRequired = data.is_ctc_required
    this.ctcBy = data.ctc_by
    this.ctcType = data.ctc_type
    this.ctcCopies = data.ctc_copies
    this.ctcAmount = data.ctc_amount
    this.isDeliveryRequired = data.is_delivery_required
    this.deliveryType = data.delivery_type
    this.status = data.status
    this.paidAt = data.paid_at
    this.paidBy = data.paid_by
    this.breakdowns =
      data.breakdowns && Array.isArray(data.breakdowns)
        ? data.breakdowns.map((bd: any) => {
            return new PaymentOrderItemBreakdown(bd)
          })
        : []
    this.mandatories =
      data.mandatories && Array.isArray(data.mandatories)
        ? data.mandatories.map((mt: any) => {
            return new PaymentOrderItemMandatory(mt)
          })
        : []
    this.optionals =
      data.optionals && Array.isArray(data.optionals)
        ? data.optionals.map((opt: any) => {
            return new PaymentOrderItemOptional(opt)
          })
        : []
    this.delivery = data.delivery ? new PaymentOrderItemDelivery(data.delivery) : null
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at

    this.setSubtotal()
  }

  clone(data: PaymentOrderItem): void {
    this.id = data.id
    this.paymentOrderId = data.paymentOrderId
    this.servicePricingId = data.servicePricingId
    this.additionalServicePricingIds = [...data.additionalServicePricingIds]
    this.additionalServicePricings = data.additionalServicePricings.map((asp: ServicePricing) => {
      return new ServicePricing(asp)
    })
    this.serviceName = data.serviceName
    this.quantity = data.quantity
    this.targetType = data.targetType
    this.targetId = data.targetId
    this.discountPercent = data.discountPercent
    this.discountAmount = data.discountAmount
    this.isExpressFilingRequired = data.isExpressFilingRequired
    this.expressFilingAmount = data.expressFilingAmount
    this.isLateLodgement = data.isLateLodgement
    this.lateLodgementFees = data.lateLodgementFees
    this.cosecServiceFee = data.cosecServiceFee
    this.isCsfSstApplicable = data.isCsfSstApplicable
    this.digitalServiceFee = data.digitalServiceFee
    this.isDsfDstApplicable = data.isDsfDstApplicable
    this.handlingFees = data.handlingFees
    this.isHfSstApplicable = data.isHfSstApplicable
    this.subtotal = data.subtotal
    this.isCtcRequired = data.isCtcRequired
    this.ctcBy = data.ctcBy
    this.ctcType = data.ctcType
    this.ctcCopies = data.ctcCopies
    this.ctcAmount = data.ctcAmount
    this.isDeliveryRequired = data.isDeliveryRequired
    this.deliveryType = data.deliveryType
    this.status = data.status
    this.paidAt = data.paidAt
    this.paidBy = data.paidBy
    this.breakdowns = data.breakdowns.map((bd: PaymentOrderItemBreakdown) => {
      return new PaymentOrderItemBreakdown(bd)
    })
    this.mandatories = data.mandatories.map((mt: PaymentOrderItemMandatory) => {
      return new PaymentOrderItemMandatory(mt)
    })
    this.optionals = data.optionals.map((opt: any) => {
      return new PaymentOrderItemOptional(opt)
    })
    this.delivery = data.delivery ? new PaymentOrderItemDelivery(data.delivery) : null
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  cloneOptionalsFromPaymentCartItem(data: PaymentCartItem): void {
    this.paymentCartItemId = data.id
    this.serviceName = data.servicePricing.serviceName
    this.optionals = data.optionals
      .filter((opt: PaymentCartItemOptional) => {
        return data.selectedOptionals.some((so: ServicePricingOptional) => {
          return (
            so.optionalServiceId === opt.servicePricingId &&
            so.optionalServicePrice.serviceName === opt.servicePricing.serviceName
          )
        })
      })
      .map((opt: PaymentCartItemOptional) => {
        let newOptional = new PaymentOrderItemOptional()
        newOptional.servicePricingId = opt.servicePricingId
        newOptional.serviceName = opt.servicePricing.serviceName
        newOptional.basePrice = opt.servicePricing.baseGrandTotal + (opt.lateLodgementFees ?? 0.0)

        return newOptional
      })
  }

  cloneFromPaymentCartItem(data: PaymentCartItem): void {
    data.setSubtotal()
    this.paymentCartItemId = data.id
    this.servicePricingId = data.servicePricingId
    this.additionalServicePricingIds = data.additionalServicePricingIds
    this.serviceName = data.servicePricing.serviceName
    this.quantity = 1
    this.targetType = data.targetType
    this.targetId = data.targetId
    this.discountPercent = data.discountPercent
    this.discountAmount = data.discountAmount
    this.isExpressFilingRequired = data.isExpressFilingRequired
    this.expressFilingAmount = data.expressFilingAmount
    this.isLateLodgement = data.isLateLodgement
    this.lateLodgementFees = data.lateLodgementFees
    this.subtotal = data.subtotal
    this.isCtcRequired = data.isCtcRequired
    this.ctcBy = data.ctcBy
    this.ctcType = data.ctcType
    this.ctcCopies = data.ctcCopies
    this.ctcAmount = data.ctcAmount
    this.isDeliveryRequired = data.isDeliveryRequired
    this.deliveryType = data.deliveryType

    this.breakdowns = data.servicePricing.breakdowns.map((spb: ServicePricingBreakdown) => {
      let newPaymentOrderItemBreakdown = new PaymentOrderItemBreakdown()
      newPaymentOrderItemBreakdown.itemName = spb.itemName
      newPaymentOrderItemBreakdown.price = spb.price
      newPaymentOrderItemBreakdown.isServiceTaxable = spb.isSstApplicable
      newPaymentOrderItemBreakdown.isDigitalTaxable = spb.isDstApplicable

      return newPaymentOrderItemBreakdown
    })

    this.mandatories = data.servicePricing.mandatoryServices
      .filter((spm: ServicePricingMandatory) => {
        return spm.mandatoryServiceId !== null
      })
      .map((spm: ServicePricingMandatory) => {
        let newPaymentOrderItemMandatory = new PaymentOrderItemMandatory()
        newPaymentOrderItemMandatory.servicePricingId = spm.mandatoryServiceId ?? ""
        newPaymentOrderItemMandatory.serviceName = spm.mandatoryServicePrice?.serviceName ?? ""
        newPaymentOrderItemMandatory.basePrice = spm.mandatoryServicePrice.baseGrandTotal

        return newPaymentOrderItemMandatory
      })

    this.optionals = data.optionals
      .filter((opt: PaymentCartItemOptional) => {
        return data.selectedOptionals.some((so: ServicePricingOptional) => {
          return (
            so.optionalServiceId === opt.servicePricingId &&
            so.optionalServicePrice.serviceName === opt.servicePricing.serviceName
          )
        })
      })
      .map((opt: PaymentCartItemOptional) => {
        let newOptional = new PaymentOrderItemOptional()
        newOptional.servicePricingId = opt.servicePricingId
        newOptional.serviceName = opt.servicePricing.serviceName
        newOptional.basePrice = opt.servicePricing.baseGrandTotal + (opt.lateLodgementFees ?? 0.0)

        return newOptional
      })
  }

  getRequestBody(): object {
    return {
      id: this.paymentCartItemId, // backend treats it this way
      service_pricing_id: this.servicePricingId,
      additional_service_pricing_ids: this.additionalServicePricingIds,
      service_name: this.serviceName,
      quantity: this.quantity,
      target_type: StringUtil.snakeToPascal(this.targetType),
      target_id: this.targetId,
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
      breakdowns: this.breakdowns.map((d: PaymentOrderItemBreakdown) => {
        return d.getRequestBody()
      }),
      mandatories: this.mandatories.map((d: PaymentOrderItemMandatory) => {
        return d.getRequestBody()
      }),
      optionals: this.optionals.map((d: PaymentOrderItemOptional) => {
        return d.getRequestBody()
      }),
    }
  }

  setSubtotal(): void {
    this.subtotal =
      Number(this.totalBreakdowns()) +
      Number(this.totalAdditionalService()) +
      Number(this.totalMandatories()) +
      Number(this.totalAdditionalServicePricings()) +
      Number(this.cosecServiceFee) +
      Number(this.digitalServiceFee) +
      Number(this.handlingFees) +
      Number(this.ctcAmount ?? 0.0) +
      Number(this.delivery?.deliveryRates ?? 0.0) +
      Number(this.paperPrintPackageCost()) +
      Number(this.totalOptionals()) +
      Number(this.expressFilingAmount) +
      Number(this.lateLodgementFees ?? 0.0) -
      Number(this.discountAmount ?? 0.0)

    this.subtotal = Number(this.subtotal)
  }

  totalBreakdowns(): number {
    return this.breakdowns
      .map((bd: PaymentOrderItemBreakdown) => {
        return Number(bd.price)
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)
  }

  totalAdditionalService(): number {
    return this.additionalServicePricings
      .map((servicePricing) => {
        return servicePricing.breakdowns
          .map((bd) => {
            return Number(bd.price)
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
    return this.mandatories
      .map((ms: PaymentOrderItemMandatory) => {
        return Number(ms.basePrice ?? 0)
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)
  }

  totalAdditionalServicePricings(): number {
    if (this.additionalServicePricings.length === 0 && this.additionalServicePricingIds.length !== 0) {
      return 0
    }

    return this.additionalServicePricings
      .map((asp: ServicePricing) => {
        return Number(asp.baseGrandTotal) ?? 0
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)
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
      .map((opt: PaymentOrderItemOptional) => {
        return Number(opt.basePrice)
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0.0)

    return Number(totalOptionals)
  }
}
