import type { IModel } from "./IModel"

export class ServicePricingDeliveryConfig implements IModel<ServicePricingDeliveryConfig> {
  id: string = ""
  servicePricingId: string = ""
  canThirdPartyDeliveryPartner: boolean = false
  canOurFleet: boolean = false
  ourFleetPrice: number = 0.0
  ourFleetPriceWithBag: number = 0.0
  canSelfPickup: boolean = false
  selfPickupPrice: number = 0.0
  selfPickupPriceWithBag: number = 0.0
  canCourier: boolean = false
  courierPrice: number = 0.0
  canInternationalDelivery: boolean = false
  internationalDeliveryPrice: number = 0.0
  canEmail: boolean = false
  emailFee: number = 0.0
  canWhatsapp: boolean = false
  whatsappFee: number = 0.0
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServicePricingDeliveryConfig) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.servicePricingId = data.service_pricing_id
    this.canThirdPartyDeliveryPartner = data.can_third_party_delivery_partner
    this.canOurFleet = data.can_our_fleet
    this.ourFleetPrice = data.our_fleet_price
    this.ourFleetPriceWithBag = data.our_fleet_price_with_bag
    this.canSelfPickup = data.can_self_pickup
    this.selfPickupPrice = data.self_pickup_price
    this.selfPickupPriceWithBag = data.self_pickup_price_with_bag
    this.canCourier = data.can_courier
    this.courierPrice = data.courier_price
    this.canInternationalDelivery = data.can_international_delivery
    this.internationalDeliveryPrice = data.international_delivery_price
    this.canEmail = data.can_email
    this.emailFee = data.email_fee
    this.canWhatsapp = data.can_whatsapp
    this.whatsappFee = data.whatsapp_fee
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: ServicePricingDeliveryConfig): void {
    this.id = data.id
    this.servicePricingId = data.servicePricingId
    this.canThirdPartyDeliveryPartner = data.canThirdPartyDeliveryPartner
    this.canOurFleet = data.canOurFleet
    this.ourFleetPrice = data.ourFleetPrice
    this.ourFleetPriceWithBag = data.ourFleetPriceWithBag
    this.canSelfPickup = data.canSelfPickup
    this.selfPickupPrice = data.selfPickupPrice
    this.selfPickupPriceWithBag = data.selfPickupPriceWithBag
    this.canCourier = data.canCourier
    this.courierPrice = data.courierPrice
    this.canInternationalDelivery = data.canInternationalDelivery
    this.internationalDeliveryPrice = data.internationalDeliveryPrice
    this.canEmail = data.canEmail
    this.emailFee = data.emailFee
    this.canWhatsapp = data.canWhatsapp
    this.whatsappFee = data.whatsappFee
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody() {
    return {
      can_third_party_delivery_partner: this.canThirdPartyDeliveryPartner,
      can_our_fleet: this.canOurFleet,
      our_fleet_price: this.ourFleetPrice,
      our_fleet_price_with_bag: this.ourFleetPriceWithBag,
      can_self_pickup: this.canSelfPickup,
      self_pickup_price: this.selfPickupPrice,
      self_pickup_price_with_bag: this.selfPickupPriceWithBag,
      can_courier: this.canCourier,
      courier_price: this.courierPrice,
      can_international_delivery: this.canInternationalDelivery,
      international_delivery_price: this.internationalDeliveryPrice,
      can_email: this.canEmail,
      email_fee: this.emailFee,
      can_whatsapp: this.canWhatsapp,
      whatsapp_fee: this.whatsappFee,
    }
  }
}
