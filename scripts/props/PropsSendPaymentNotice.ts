import type { BillingInfo } from "../models/BillingInfo"
import type { DeliveryInfo } from "../models/DeliveryInfo"
import type { ServicePricing } from "../models/ServicePricing"

export interface IPropsSendPaymentNotice {
  entityType: string
  entityId: string
  entityName: string
  target: string
  targetId: string
  billingInfo: BillingInfo
  deliveryInfo: DeliveryInfo

  emailRecipients: string[]
  selectedServicePricings: ServicePricing[]
  servicePricingFilter: string
}

export class PropsSendPaymentNotice implements IPropsSendPaymentNotice {
  entityType: string
  entityId: string
  entityName: string
  target: string
  targetId: string
  billingInfo: BillingInfo
  deliveryInfo: DeliveryInfo
  emailRecipients: string[] = []
  selectedServicePricings: ServicePricing[] = []
  servicePricingFilter: string = ""

  constructor(
    entityType: string,
    entityId: string,
    entityName: string,
    target: string,
    targetId: string,
    billingInfo: BillingInfo,
    deliveryInfo: DeliveryInfo
  ) {
    this.entityType = entityType
    this.entityId = entityId
    this.entityName = entityName
    this.target = target
    this.targetId = targetId
    this.billingInfo = billingInfo
    this.deliveryInfo = deliveryInfo
  }
}
