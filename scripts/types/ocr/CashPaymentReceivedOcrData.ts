import { OcrData } from "./OcrData"

export class CashPaymentReceivedOcrData extends OcrData {
  paymentFrom = ""
  totalPaid = 0.0
  itemsSold = []

  time = useLocalTime()

  constructor(jsonObject: any) {
    super(jsonObject)

    this.setOtherValues(jsonObject)

    this.itemsSold = jsonObject.items_sold ?? []
  }

  setOtherValues(jsonObject: any): void {
    if (!jsonObject) {
      return
    }

    for (const key in jsonObject) {
      // payment from
      if (Object.prototype.hasOwnProperty.call(jsonObject, key)) {
        if (key.toLowerCase() === "from") {
          this.paymentFrom = jsonObject[key]
        }

        if (key.toLowerCase() === "total") {
          this.totalPaid = jsonObject[key]
        }
      }
    }
  }

  override getObjectPropertyValues(): any {
    return [
      {
        id: "Document Date",
        value: this.time.formatDateOnlyFull(this.documentDate),
      },
      {
        id: "Payment From",
        value: this.paymentFrom,
      },
      {
        id: "Total Paid",
        value: this.totalPaid,
      },
    ]
  }

  override getItemValues(): any {
    let itemsSoldString = this.itemsSold
      .map((i: any) => {
        return i.item_name
      })
      .join(", ")

    if (this.itemsSold.length <= 0) {
      itemsSoldString = "Unknown Items"
    }

    return [
      {
        name: `Payment from ${this.paymentFrom}`,
        price: this.totalPaid,
        items_sold: itemsSoldString,
      },
    ]
  }
}
