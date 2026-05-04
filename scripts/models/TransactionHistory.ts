import type { IReadOnly } from "./IReadOnly"

export class TransactionHistory implements IReadOnly<TransactionHistory> {
  id: string = ""
  refNo: string = ""
  services: string[] = []
  payee: string = ""
  paymentDate: string = ""
  isOrder: boolean = true // this is for receipt purposes

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof TransactionHistory) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.refNo = data.ref_no ?? ""
    this.services = data.service_description
    this.payee = data.payee
    this.paymentDate = data.payment_date
    this.isOrder = data.is_order
  }

  clone(data: TransactionHistory): void {
    this.id = data.id
    this.refNo = data.refNo
    this.services = data.services
    this.payee = data.payee
    this.paymentDate = data.paymentDate
    this.isOrder = data.isOrder
  }
}
