export class BankComparisonItem {
  type: string = ""
  text: string = ""
  notes: string = ""
  link: string = ""

  constructor(type: string, text: string, notes: string = "", link: string = "") {
    this.type = type
    this.text = text
    this.notes = notes
    this.link = link
  }

  static fromString(text: string): BankComparisonItem {
    return new BankComparisonItem("document", text)
  }

  static fromData(data: any): BankComparisonItem {
    return new BankComparisonItem(
      data.type || "document",
      data.text || data.name || "",
      data.notes || "",
      data.link || ""
    )
  }

  static fromArray(items: any[]): BankComparisonItem[] {
    if (!items) {
      return []
    }
    return items.map(item => {
      if (typeof item === "string") {
        return BankComparisonItem.fromString(item)
      }
      return BankComparisonItem.fromData(item)
    })
  }
}
