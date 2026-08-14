import { NumberUtil } from "~/scripts/utils/Number"
export class CartBreakdownItem {
  name: string = ""
  amount: string = "0.00"

  constructor(name: string, amount: number) {
    this.name = name
    this.amount = NumberUtil.currency(amount)
  }
}
