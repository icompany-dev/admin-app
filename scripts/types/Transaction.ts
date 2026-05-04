export class Transaction {
  referenceNumber: string = ""
  paymentFor: string[] = []
  name: string = ""
  paymentDate: string = ""
  isSelected: boolean = false

  constructor(
    referenceNumber: string,
    paymentFor: string[],
    name: string,
    paymentDate: string,
    isSelected: boolean
  ) {
    this.referenceNumber = referenceNumber
    this.paymentFor = paymentFor
    this.name = name
    this.paymentDate = paymentDate
    this.isSelected = isSelected
  }
}
