export class CompanySecretary {
  name: string = ""
  nric: string = ""
  license: string = ""
  certificate: string = ""
  phone: string = ""
  email: string = ""
  firmName: string = ""
  firmPhone: string = ""
  firmFax: string = ""
  addressLine1: string = ""
  addressLine2: string = ""
  addressPostcode: string = ""
  addressCity: string = ""
  addressState: string = ""
  addressCountry: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanySecretary) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.name = data.name
    this.nric = data.nric
    this.license = data.license
    this.certificate = data.certificate
    this.phone = data.phone
    this.email = data.email
    this.firmName = data.firm_name
    this.firmPhone = data.firm_phone
    this.firmFax = data.firm_fax
    this.addressLine1 = data.address_line1
    this.addressLine2 = data.address_line2
    this.addressPostcode = data.address_postcode
    this.addressCity = data.address_city
    this.addressState = data.address_state
    this.addressCountry = data.address_country
  }

  clone(data: CompanySecretary): void {
    this.name = data.name
    this.nric = data.nric
    this.license = data.license
    this.certificate = data.certificate
    this.phone = data.phone
    this.email = data.email
    this.firmName = data.firmName
    this.firmPhone = data.firmPhone
    this.firmFax = data.firmFax
    this.addressLine1 = data.addressLine1
    this.addressLine2 = data.addressLine2
    this.addressPostcode = data.addressPostcode
    this.addressCity = data.addressCity
    this.addressState = data.addressState
    this.addressCountry = data.addressCountry
  }
}
