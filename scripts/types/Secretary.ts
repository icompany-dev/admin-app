import { Location } from "../models/Location"

export class Secretary {
  name: string = ""
  nric: string = ""
  license: string = ""
  certificate: string = ""
  phone: string = ""
  email: string = ""
  firmName: string = ""
  firmPhone: string = ""
  firmFax: string = ""
  address: Location = new Location()
  signatureUrl: string = ""

  constructor(
    name: string,
    nric: string,
    license: string,
    certificate: string,
    phone: string,
    email: string,
    firmName: string,
    firmPhone: string,
    firmFax: string,
    address: Location,
    signatureUrl: string
  ) {
    this.name = name
    this.nric = nric
    this.license = license
    this.certificate = certificate
    this.phone = phone
    this.email = email
    this.firmName = firmName
    this.firmPhone = firmPhone
    this.firmFax = firmFax
    this.address = address
    this.signatureUrl = signatureUrl
  }
}
