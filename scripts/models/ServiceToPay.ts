export class ServiceToPay {
  id: string = ""
  name: string = ""
  companyName: string = ""
  companyId: string = ""
  target: string = ""
  targetId: string = ""
  priceBreakdown: ServiceToPayPriceBreakDown[] = []
  status: string = ""
  billFor: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServiceToPay) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.companyName = data.company_name
    this.companyId = data.company_id
    this.target = data.target
    this.targetId = data.target_id
    this.priceBreakdown =
      data.price_breakdown && Array.isArray(data.price_breakdown)
        ? data.price_breakdown.map((pb: any) => {
            return new ServiceToPayPriceBreakDown(pb)
          })
        : []
    this.status = data.status
    this.billFor = data.bill_for
  }

  clone(data: ServiceToPay): void {
    this.id = data.id
    this.name = data.name
    this.companyName = data.companyName
    this.companyId = data.companyId
    this.target = data.target
    this.targetId = data.targetId
    this.priceBreakdown = data.priceBreakdown.map((pb: ServiceToPayPriceBreakDown) => {
      return new ServiceToPayPriceBreakDown(pb)
    })
    this.status = data.status
    this.billFor = data.billFor
  }
}

export class ServiceToPayPriceBreakDown {
  price: number = 0.0
  productName: string = ""
  quantity: number = 1

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServiceToPayPriceBreakDown) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.price = data.price
    this.productName = data.product_name
    this.quantity = data.quantity
  }

  clone(data: ServiceToPayPriceBreakDown): void {
    this.price = data.price
    this.productName = data.productName
    this.quantity = data.quantity
  }
}
