export class CompanyStrikingOffUser {
  id: string = ""
  name: string = ""
  email: string = ""
  phone: string = ""
  identification: string = ""
  identificationType: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyStrikingOffUser) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.identification = data.identification
    this.identificationType = data.identification_type
  }

  clone(data: CompanyStrikingOffUser): void {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.identification = data.identification
    this.identificationType = data.identificationType
  }
}
