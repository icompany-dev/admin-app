import { Coordinate } from "./Coordinate"
import { File } from "./File"

export class AnalyticsUserCoordinate {
  name: string = ""
  phone: string = ""
  email: string = ""
  gender: string = ""
  image: File | null = null
  isAShareholder: boolean = false
  companiesAsShareholder: string[] = []
  shareholdings: any[] = []
  isADirector: boolean = false
  companiesAsDirector: string[] = []
  directorships: any[] = []
  isMalaysian: boolean = false
  citizenship: string | null = null
  age: number | null = null
  race: string | null = null
  address: string = ""
  coordinate = new Coordinate()
  lastLogin: string = ""

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
    this.image = data.image ? new File(data.image) : null
    this.isAShareholder = data.is_a_shareholder ?? false
    this.companiesAsShareholder = data.companies_as_shareholder ?? []
    this.shareholdings = Object.values(data.shareholdings)
    this.isADirector = data.is_a_director ?? false
    this.companiesAsDirector = data.companies_as_director ?? []
    this.directorships = Object.values(data.directorships)
    this.isMalaysian = data.is_malaysian
    this.citizenship = data.citizenship
    this.age = data.age
    this.race = data.race
    this.address = data.address
    this.coordinate = new Coordinate(data.coordinates ?? null)
    this.lastLogin = data.last_login
  }

  clone(data: AnalyticsUserCoordinate): void {
    this.name = data.name
    this.phone = data.phone
    this.email = data.email
    this.gender = data.gender
    this.image = data.image ? new File(data.image) : null
    this.isAShareholder = data.isAShareholder
    this.companiesAsShareholder = data.companiesAsShareholder
    this.shareholdings = data.shareholdings
    this.isADirector = data.isADirector
    this.companiesAsDirector = data.companiesAsDirector
    this.directorships = data.directorships
    this.isMalaysian = data.isMalaysian
    this.citizenship = data.citizenship
    this.age = data.age
    this.race = data.race
    this.address = data.address
    this.coordinate = new Coordinate(data.coordinate)
    this.lastLogin = data.lastLogin
  }
}
