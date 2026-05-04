import { OcrData } from "./OcrData"

export class PurchaseInvoiceOcrData extends OcrData {
  purchasedFrom = ""
  totalPurchase = 0.0
  invoiceNo = ""
  itemsPurchased = []

  time = useLocalTime()

  constructor(jsonObject: any) {
    super(jsonObject)

    this.setOtherValues(jsonObject)
    this.invoiceNo = jsonObject.invoice_no ?? ""
    this.itemsPurchased = jsonObject.items_purchased ?? []
  }

  setOtherValues(jsonObject: any): void {
    if (!jsonObject) {
      return
    }

    for (const key in jsonObject) {
      if (Object.prototype.hasOwnProperty.call(jsonObject, key)) {
        if (key.toLowerCase() === "from") {
          this.purchasedFrom = jsonObject[key]
        }

        if (key.toLowerCase() === "total") {
          this.totalPurchase = jsonObject[key]
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
        id: "Purchased From",
        value: this.purchasedFrom,
      },
      {
        id: "Total Purchase",
        value: this.totalPurchase,
      },
    ]
  }

  override getItemValues(): any {
    let itemsPurchasedString = this.itemsPurchased
      .map((i: any) => {
        return i.item_name
      })
      .join(", ")

    if (this.itemsPurchased.length <= 0) {
      itemsPurchasedString = "Unknown Items"
    }

    return [
      {
        name: `Purchased from ${this.purchasedFrom}`,
        price: this.totalPurchase,
        items_purchased: itemsPurchasedString,
      },
    ]
  }
}
