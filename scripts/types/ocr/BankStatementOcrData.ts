import { OcrData } from "./OcrData"

export class BankStatementOcrData extends OcrData {
  balance = 0.0
  transactions = []

  time = useLocalTime()

  constructor(jsonObject: any) {
    super(jsonObject)

    this.bankName = jsonObject.bank_name ?? "Unknown"
    this.openingBalance = jsonObject.opening_balance ?? 0.0
    this.balance = jsonObject.total ?? 0.0
    this.transactions = jsonObject.transactions ?? []
  }

  override getObjectPropertyValues(): any {
    return [
      {
        id: "Document Date",
        value: this.time.formatDateOnlyFull(this.documentDate),
      },
      {
        id: "Bank",
        value: this.bankName,
      },
      {
        id: "Opening Balance",
        value: this.openingBalance,
      },
      {
        id: "Balance",
        value: this.balance,
      },
    ]
  }

  override getItemValues(): any {
    return this.transactions.map((i: any) => {
      return {
        name: i.transaction_name ?? "Unknown",
        credit: i.credit ?? null,
        debit: i.debit ?? null,
      }
    })
  }
}
