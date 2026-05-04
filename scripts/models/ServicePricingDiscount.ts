import type { IModel } from "./IModel"

export class ServicePricingDiscount implements IModel<ServicePricingDiscount> {
  id: string = ""
  servicePricingId: string = ""
  hasSystemDiscount: boolean = false
  isDiscountOnMoreThanFive: boolean = false
  discountOnMoreThanFive: number = 0.0
  isDiscountOnMoreThanThousand: boolean = false
  discountOnMoreThanThousand: number = 0.0
  isForStrikingOff: boolean = false
  discountForStrikingOff: number = 0.0
  hasMarketingDiscount: boolean = false
  isDiscountOnCelebration: boolean = false
  discountOnCelebration: number = 0.0
  hasPromoCode: boolean = false
  promoCode: string | null = null
  discountPromoCode: number = 0.0
  isAGift: boolean = false
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServicePricingDiscount) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.servicePricingId = data.service_pricing_id
    this.hasSystemDiscount = data.has_system_discount
    this.isDiscountOnMoreThanFive = data.is_discount_on_more_than_five
    this.discountOnMoreThanFive = data.discount_on_more_than_five
    this.isDiscountOnMoreThanThousand = data.is_discount_on_more_than_thousand
    this.discountOnMoreThanThousand = data.discount_on_more_than_thousand
    this.isForStrikingOff = data.is_for_striking_off
    this.discountForStrikingOff = data.discount_for_striking_off
    this.hasMarketingDiscount = data.has_marketing_discount
    this.isDiscountOnCelebration = data.is_discount_on_celebration
    this.discountOnCelebration = data.discount_on_celebration
    this.hasPromoCode = data.has_promo_code
    this.promoCode = data.promo_code
    this.discountPromoCode = data.discount_promo_code
    this.isAGift = data.is_a_gift
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: ServicePricingDiscount): void {
    this.id = data.id
    this.servicePricingId = data.servicePricingId
    this.hasSystemDiscount = data.hasSystemDiscount
    this.isDiscountOnMoreThanFive = data.isDiscountOnMoreThanFive
    this.discountOnMoreThanFive = data.discountOnMoreThanFive
    this.isDiscountOnMoreThanThousand = data.isDiscountOnMoreThanThousand
    this.discountOnMoreThanThousand = data.discountOnMoreThanThousand
    this.isForStrikingOff = data.isForStrikingOff
    this.discountForStrikingOff = data.discountForStrikingOff
    this.hasMarketingDiscount = data.hasMarketingDiscount
    this.isDiscountOnCelebration = data.isDiscountOnCelebration
    this.discountOnCelebration = data.discountOnCelebration
    this.hasPromoCode = data.hasPromoCode
    this.promoCode = data.promoCode
    this.discountPromoCode = data.discountPromoCode
    this.isAGift = data.isAGift
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody() {
    return {
      has_system_discount: this.hasSystemDiscount,
      is_discount_on_more_than_five: this.isDiscountOnMoreThanFive,
      discount_on_more_than_five: this.discountOnMoreThanFive,
      is_discount_on_more_than_thousand: this.isDiscountOnMoreThanThousand,
      discount_on_more_than_thousand: this.discountOnMoreThanThousand,
      is_for_striking_off: this.isForStrikingOff,
      discount_for_striking_off: this.discountForStrikingOff,
      has_marketing_discount: this.hasMarketingDiscount,
      is_discount_on_celebration: this.isDiscountOnCelebration,
      discount_on_celebration: this.discountOnCelebration,
      has_promo_code: this.hasPromoCode,
      promo_code: this.promoCode,
      discount_promo_code: this.discountPromoCode,
      is_a_gift: this.isAGift,
    }
  }
}
