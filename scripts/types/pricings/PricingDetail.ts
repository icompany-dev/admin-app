import { NumberUtil } from "~/scripts/utils/Number"

export class PricingDetail {
  name: string = ""
  price: number = 0

  constructor(name: string, price: number) {
    this.name = name
    this.price = price
  }

  get formattedPrice(): string {
    return NumberUtil.currency(this.price)
  }
}
