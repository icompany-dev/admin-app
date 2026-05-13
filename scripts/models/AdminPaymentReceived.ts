export class AdminPaymentReceived {
  payee: string = ""
  paymentFor: string = ""
  amount: number = 0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AdminPaymentReceived) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.payee = data.payee
    this.paymentFor = data.payment_for
    this.amount = data.amount
  }

  clone(data: AdminPaymentReceived): void {
    this.payee = data.payee
    this.paymentFor = data.paymentFor
    this.amount = data.amount
  }
}
