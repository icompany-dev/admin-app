import { Location } from "./Location"

export class AuditorPartner {
  id: string = ""
  idNumber: string = ""
  name: string = ""
  title: string = ""
  image: string = ""
  companyName: string = ""
  companyType: string = ""
  license: string = ""
  companyEmail: string = ""
  companyPhone: string = ""
  companyLocation: Location = new Location()
  preferred: string = ""
  companyId: string = ""
  metaData: string = ""
  updatedAt: string = ""
  createdAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AuditorPartner) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.idNumber = data.id_number
    this.name = data.name
    this.title = data.title
    this.image = data.image
    this.companyName = data.company_name
    this.companyType = data.company_type
    this.license = data.license
    this.companyEmail = data.company_email
    this.companyPhone = data.company_phone
    this.companyLocation = new Location(data.company_location)
    this.preferred = data.preferred
    this.companyId = data.company_id
    this.metaData = data.meta_data
    this.updatedAt = data.updated_at
    this.createdAt = data.created_at
  }

  clone(data: AuditorPartner): void {
    this.id = data.id
    this.idNumber = data.idNumber
    this.name = data.name
    this.title = data.title
    this.image = data.image
    this.companyName = data.companyName
    this.companyType = data.companyType
    this.license = data.license
    this.companyEmail = data.companyEmail
    this.companyPhone = data.companyPhone
    this.companyLocation = new Location(data.companyLocation)
    this.preferred = data.preferred
    this.companyId = data.companyId
    this.metaData = data.metaData
    this.updatedAt = data.updatedAt
    this.createdAt = data.createdAt
  }
}
