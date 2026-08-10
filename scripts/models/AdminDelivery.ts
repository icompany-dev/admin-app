export class AdminDelivery {
  name: string = ""
  email: string = ""
  phone: string = ""
  addressLine1: string = ""
  addressLine2: string = ""
  addressPostcode: string = ""
  addressCity: string = ""
  addressState: string = ""
  addressCountry: string = ""
  deliveryMethod: string = ""
  amountPaid: string = ""
  paidAt: string = ""
  paymentFor: string = ""
  mandatoryItems: string[] = []
  additionalItems: string[] = []
  isCtcRequired: boolean = false
  ctcBy: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AdminDelivery) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.name = data.name ?? ""
    this.email = data.email ?? ""
    this.phone = data.phone ?? ""
    this.addressLine1 = data.address_line_1 ?? ""
    this.addressLine2 = data.address_line_2 ?? ""
    this.addressPostcode = data.address_postcode ?? ""
    this.addressCity = data.address_city ?? ""
    this.addressState = data.address_state ?? ""
    this.addressCountry = data.address_country ?? ""
    this.deliveryMethod = data.delivery_method ?? ""
    this.amountPaid = data.amount_paid ?? ""
    this.paidAt = data.paid_at ?? ""
    this.paymentFor = data.payment_for ?? ""
    this.mandatoryItems = data.mandatory_items ?? []
    this.additionalItems = data.additional_items ?? []
    this.isCtcRequired = data.is_ctc_required ?? false
    this.ctcBy = data.ctc_by ?? ""
  }

  clone(data: AdminDelivery): void {
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.addressLine1 = data.addressLine1
    this.addressLine2 = data.addressLine2
    this.addressPostcode = data.addressPostcode
    this.addressCity = data.addressCity
    this.addressState = data.addressState
    this.addressCountry = data.addressCountry
    this.deliveryMethod = data.deliveryMethod
    this.amountPaid = data.amountPaid
    this.paidAt = data.paidAt
    this.paymentFor = data.paymentFor
    this.mandatoryItems = data.mandatoryItems
    this.additionalItems = data.additionalItems
    this.isCtcRequired = data.isCtcRequired
    this.ctcBy = data.ctcBy
  }
}
