import { StringUtil } from "../utils/String"
import type { IModel } from "./IModel"

export class BillingInfo implements IModel<BillingInfo> {
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

    if (data instanceof BillingInfo) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.name = data.billing_name ?? null
    this.email = data.billing_email ?? null
    this.phone = data.billing_phone ?? null
    this.addressLine1 = data.billing_address_line_1 ?? null
    this.addressLine2 = data.billing_address_line_2 ?? null
    this.addressPostcode = data.billing_address_postcode ?? null
    this.addressCity = data.billing_address_city ?? null
    this.addressState = data.billing_address_state ?? null
    this.addressCountry = data.billing_address_country ?? null
  }

  clone(data: BillingInfo): void {
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
      billing_name: this.name,
      billing_email: this.email,
      billing_phone: this.phone,
      billing_address_line_1: this.addressLine1,
      billing_address_line_2: this.addressLine2,
      billing_address_postcode: this.addressPostcode,
      billing_address_city: this.addressCity,
      billing_address_state: this.addressState,
      billing_address_country: this.addressCountry,
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

  getAddressString(): string {
    let addressParts: string[] = [
      this.addressLine1 ?? "",
      this.addressLine2 ?? "",
      `${this.addressPostcode} ${this.addressCity}`,
      `${this.addressState} ${this.addressCountry}`,
    ]

    return addressParts
      .filter((ap: string) => {
        return !StringUtil.isNullOrEmpty(ap)
      })
      .join("<br>")
  }
}
