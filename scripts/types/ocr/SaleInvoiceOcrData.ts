import { OcrData } from "./OcrData"

export class SaleInvoiceOcrData extends OcrData {
  purchasedBy = ""
  totalSales = 0.0
  invoiceNo = ""
  itemsSold = []

  time = useLocalTime()

  constructor(jsonObject: any) {
    super(jsonObject)

    this.setOtherValues(jsonObject)
    this.invoiceNo = jsonObject.invoice_no ?? ""
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
          this.purchasedBy = jsonObject[key]
        }

        if (key.toLowerCase() === "total") {
          this.totalSales = jsonObject[key]
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
        id: "Purchased By",
        value: this.purchasedBy,
      },
      {
        id: "Total Sales",
        value: this.totalSales,
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
        name: `Purchased by ${this.purchasedBy}`,
        price: this.totalSales,
        items_sold: itemsSoldString,
      },
    ]
  }
}
