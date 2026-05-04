import type { IModel } from "./IModel"
import { OrderSummary } from "./Order"

export class ReceiptData implements IModel<ReceiptData> {
  referenceNumber: string = ""
  orderId: string = ""
  date: string = ""
  biller: ReceiptDataBiller = new ReceiptDataBiller()
  items: ReceiptDataItem[] = []
  delivery: ReceiptDataItem | null = null
  discount: ReceiptDataDiscount | null = null
  orderSummary: OrderSummary = new OrderSummary()
  paymentMethod: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ReceiptData) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.referenceNumber = data.reference_number
    this.orderId = data.order_id
    this.date = data.date
    this.biller = new ReceiptDataBiller(data.biller)
    this.items =
      data.items && Array.isArray(data.items)
        ? data.items.map((item: any) => {
            return new ReceiptDataItem(item)
          })
        : []
    this.delivery = data.delivery ? new ReceiptDataItem(data.delivery) : null
    this.discount = data.discount ? new ReceiptDataDiscount(data.discount) : null
    this.orderSummary = new OrderSummary(data.order_summary)
    this.paymentMethod = data.payment_method
  }

  clone(data: ReceiptData): void {
    this.referenceNumber = data.referenceNumber
    this.orderId = data.orderId
    this.date = data.date
    this.biller = new ReceiptDataBiller(data.biller)
    this.items = data.items.map((item: ReceiptDataItem) => {
      return new ReceiptDataItem(item)
    })
    this.delivery = data.delivery ? new ReceiptDataItem(data.delivery) : null
    this.discount = data.discount ? new ReceiptDataDiscount(data.discount) : null
    this.orderSummary = new OrderSummary(data.orderSummary)
    this.paymentMethod = data.paymentMethod
  }

  getRequestBody(): object {
    return {}
  }
}

export class ReceiptDataBiller {
  name: string = ""
  nameType: string = ""
  registrationNumberNew: string = ""
  registrationNumberOld: string = ""
  email: string = ""
  phone: string = ""
  attentionTo: string = ""
  address: ReceiptDataBillerAddress = new ReceiptDataBillerAddress()

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ReceiptDataBiller) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.name = data.name
    this.nameType = data.name_type
    this.registrationNumberNew = data.registration_number_new
    this.registrationNumberOld = data.registration_number_old
    this.email = data.email
    this.phone = data.phone
    this.attentionTo = data.attention_to
    this.address = new ReceiptDataBillerAddress(data.address)
  }

  clone(data: ReceiptDataBiller): void {
    this.name = data.name
    this.nameType = data.nameType
    this.registrationNumberNew = data.registrationNumberNew
    this.registrationNumberOld = data.registrationNumberOld
    this.email = data.email
    this.phone = data.phone
    this.attentionTo = data.attentionTo
    this.address = new ReceiptDataBillerAddress(data.address)
  }
}

export class ReceiptDataBillerAddress {
  line1: string = ""
  line2: string = ""
  city: string = ""
  state: string = ""
  postcode: string = ""
  country: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ReceiptDataBillerAddress) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.line1 = data.line_1
    this.line2 = data.line_2
    this.city = data.city
    this.state = data.state
    this.postcode = data.postcode
    this.country = data.country
  }

  clone(data: ReceiptDataBillerAddress): void {
    this.line1 = data.line1
    this.line2 = data.line2
    this.city = data.city
    this.state = data.state
    this.postcode = data.postcode
    this.country = data.country
  }
}

export class ReceiptDataItem {
  name: string = ""
  altName: string = ""
  description: string = ""
  quantity: string = ""
  price: string = ""
  detailItems: string[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ReceiptDataItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.name = data.name
    this.altName = data.alt_name
    this.description = data.description
    this.quantity = data.quantity
    this.price = data.price
    this.detailItems = data.detail_items
  }

  clone(data: ReceiptDataItem): void {
    this.name = data.name
    this.altName = data.altName
    this.description = data.description
    this.quantity = data.quantity
    this.price = data.price
    this.detailItems = data.detailItems
  }
}

export class ReceiptDataDiscount {
  service: string = ""
  amount: number = 0.0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ReceiptDataDiscount) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.service = data.service
    this.amount = data.amount
  }

  clone(data: ReceiptDataDiscount): void {
    this.service = data.service
    this.amount = data.amount
  }
}
