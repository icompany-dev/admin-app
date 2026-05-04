import { StringUtil } from "../utils/String"
import type { IModel } from "./IModel"

export class DeliveryInfo implements IModel<DeliveryInfo> {
  name: string | null = ""
  email: string | null = ""
  phone: string | null = ""
  addressLine1: string | null = ""
  addressLine2: string | null = ""
  addressPostcode: string | null = ""
  addressCity: string | null = ""
  addressState: string | null = ""
  addressCountry: string | null = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof DeliveryInfo) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.name = data.delivery_name ?? null
    this.email = data.delivery_email ?? null
    this.phone = data.delivery_phone ?? null
    this.addressLine1 = data.delivery_address_line_1 ?? null
    this.addressLine2 = data.delivery_address_line_2 ?? null
    this.addressPostcode = data.delivery_address_postcode ?? null
    this.addressCity = data.delivery_address_city ?? null
    this.addressState = data.delivery_address_state ?? null
    this.addressCountry = data.delivery_address_country ?? null
  }

  clone(data: DeliveryInfo): void {
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.addressLine1 = data.addressLine1
    this.addressLine2 = data.addressLine2
    this.addressPostcode = data.addressPostcode
    this.addressCity = data.addressCity
    this.addressState = data.addressState
    this.addressCountry = data.addressCountry
  }

  getRequestBody(): object {
    return {
      recipient_name: this.name,
      recipient_email: this.email,
      recipient_phone: this.phone,
      address_line_1: this.addressLine1,
      address_line_2: this.addressLine2,
      address_postcode: this.addressPostcode,
      address_city: this.addressCity,
      address_state: this.addressState,
      address_country: this.addressCountry,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.name) &&
      !StringUtil.isNullOrEmpty(this.email) &&
      !StringUtil.isNullOrEmpty(this.phone) &&
      !StringUtil.isNullOrEmpty(this.addressLine1) &&
      !StringUtil.isNullOrEmpty(this.addressPostcode) &&
      !StringUtil.isNullOrEmpty(this.addressCity) &&
      !StringUtil.isNullOrEmpty(this.addressState) &&
      !StringUtil.isNullOrEmpty(this.addressCountry)
    )
  }
}
