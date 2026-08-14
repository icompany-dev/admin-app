import { OcrData } from "./OcrData"

export class CashPaymentMadeOcrData extends OcrData {
  paymentMadeTo = ""
  totalPaid = 0.0
  itemsPaid = []

  time = useLocalTime()

  constructor(jsonObject: any) {
    super(jsonObject)

    this.setOtherValues(jsonObject)
    this.itemsPaid = jsonObject.items_paid ?? []
  }

  setOtherValues(jsonObject: any): void {
    if (!jsonObject) {
      return
    }

    for (const key in jsonObject) {
      // payment from
      if (Object.prototype.hasOwnProperty.call(jsonObject, key)) {
        if (key.toLowerCase() === "from") {
          this.paymentMadeTo = jsonObject[key]
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
        id: "Payment Made To",
        value: this.paymentMadeTo,
      },
      {
        id: "Total Paid",
        value: this.totalPaid,
      },
    ]
  }

  override getItemValues(): any {
    let itemsPaidString = this.itemsPaid
      .map((i: any) => {
        return i.item_name
      })
      .join(", ")

    if (this.itemsPaid.length <= 0) {
      itemsPaidString = "Unknown Items"
    }

    return [
      {
        name: `Paid to ${this.paymentMadeTo}`,
        price: this.totalPaid,
        items_purchased: itemsPaidString,
      },
    ]
  }
}
