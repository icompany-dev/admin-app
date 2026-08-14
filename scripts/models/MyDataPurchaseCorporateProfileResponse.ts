export class MyDataPurchaseCorporateProfileResponse {
  orderNumber: string = ""
  invoiceNumber: string = ""
  errorMessage: string = ""
  successCode: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof MyDataPurchaseCorporateProfileResponse) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.orderNumber = data.orderNumber
    this.invoiceNumber = data.invoiceNumber
    this.errorMessage = data.errorMessage
    this.successCode = data.successCode
  }

  clone(data: MyDataPurchaseCorporateProfileResponse): void {
    this.orderNumber = data.orderNumber
    this.invoiceNumber = data.invoiceNumber
    this.errorMessage = data.errorMessage
    this.successCode = data.successCode
  }
}
