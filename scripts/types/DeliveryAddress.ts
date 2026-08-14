export class DeliveryAddress {
  name: string = ""
  email: string | null = null
  phone: string | null = null
  addressLine1: string = ""
  addressLine2: string | null = null
  city: string = ""
  state: string = ""
  postcode: string = ""
  country: string = ""

  constructor(data: Partial<DeliveryAddress> = {}) {
    Object.assign(this, data)
  }

  getJson(): {} {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      address_line_1: this.addressLine1,
      address_line_2: this.addressLine2,
      city: this.city,
      state: this.state,
      postcode: this.postcode,
      country: this.country,
    }
  }
}
