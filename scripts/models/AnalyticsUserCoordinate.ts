import { Coordinate } from "./Coordinate"

export class AnalyticsUserCoordinate {
  name: string = ""
  phone: string = ""
  email: string = ""
  gender: string = ""
  isAShareholder: boolean = false
  companiesAsShareholder: string[] = []
  isADirector: boolean = false
  companiesAsDirector: string[] = []
  isMalaysian: boolean = false
  citizenship: string | null = null
  age: number | null = null
  race: string | null = null
  address: string = ""
  coordinate = new Coordinate()

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AnalyticsUserCoordinate) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.name = data.name
    this.phone = data.phone
    this.email = data.email
    this.gender = data.gender
    this.isAShareholder = data.is_a_shareholder ?? false
    this.companiesAsShareholder = data.companies_as_shareholder ?? []
    this.isADirector = data.is_a_director ?? false
    this.companiesAsDirector = data.companies_as_director ?? []
    this.isMalaysian = data.is_malaysian
    this.citizenship = data.citizenship
    this.age = data.age
    this.race = data.race
    this.address = data.address
    this.coordinate = new Coordinate(data.coordinates ?? null)
  }

  clone(data: AnalyticsUserCoordinate): void {
    this.name = data.name
    this.phone = data.phone
    this.email = data.email
    this.gender = data.gender
    this.isAShareholder = data.isAShareholder
    this.companiesAsShareholder = data.companiesAsShareholder
    this.isADirector = data.isADirector
    this.companiesAsDirector = data.companiesAsDirector
    this.isMalaysian = data.isMalaysian
    this.citizenship = data.citizenship
    this.age = data.age
    this.race = data.race
    this.address = data.address
    this.coordinate = new Coordinate(data.coordinate)
  }
}
