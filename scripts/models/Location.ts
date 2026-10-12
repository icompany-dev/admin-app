import { StringUtil } from "../utils/String"

export class Location {
  id: string = ""
  addressLine1: string = ""
  addressLine2: string | null = ""
  addressLine3: string | null = ""
  postcode: string = ""
  city: City | null = null
  otherCity: string | null = null
  state: State | null = null
  otherState: string | null = null
  country: Country | null = null
  otherCountry: string | null = null
  latitude: number | null = null
  longitude: number | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any = null) {
    if (data) {
      if (data instanceof Location) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  convertFromResponse(data: any) {
    this.id = data.id || ""
    this.addressLine1 = data.address_line_1 || ""
    this.addressLine2 = data.address_line_2 || ""
    this.addressLine3 = data.address_line_3 || ""
    this.postcode = data.postcode || ""
    this.city = new City(data.city || null)
    this.otherCity = data.other_city || null
    this.state = new State(data.state || null)
    this.otherState = data.other_state || null
    this.country = new Country(data.country || null)
    this.otherCountry = data.other_country || null
    this.latitude = data.latitude || null
    this.longitude = data.longitude || null
    this.createdAt = data.created_at || null
    this.updatedAt = data.updated_at || null
  }

  clone(data: Location) {
    this.id = data.id || ""
    this.addressLine1 = data.addressLine1 || ""
    this.addressLine2 = data.addressLine2 || ""
    this.addressLine3 = data.addressLine3 || ""
    this.postcode = data.postcode || ""
    this.city = new City(data.city || null)
    this.otherCity = data.otherCity
    this.state = new State(data.state || null)
    this.otherState = data.otherState
    this.country = new Country(data.country || null)
    this.otherCountry = data.otherCountry
    this.latitude = data.latitude || null
    this.longitude = data.longitude || null
    this.createdAt = data.createdAt || null
    this.updatedAt = data.updatedAt || null
  }

  getOnelineAddress(): string {
    if (this.addressLine1 === "") {
      return "-"
    }

    return `${this.addressLine1.toUpperCase()}, 
      ${this.addressLine2 ? this.addressLine2.toUpperCase() + ", " : ""}
      ${this.addressLine3 ? this.addressLine3.toUpperCase() + ", " : ""}
      ${this.postcode} ${this.cityName.toUpperCase()}, 
      ${this.stateName.toUpperCase()} ${this.countryName.toUpperCase()}`
  }

  getMultilineAddress(): string {
    if (this.addressLine1 === "") {
      return "-"
    }

    return `${this.addressLine1.toUpperCase()}<br>
      ${this.addressLine2 ? this.addressLine2.toUpperCase() + "<br>" : ""}
      ${this.addressLine3 ? this.addressLine3.toUpperCase() + "<br>" : ""}
      ${this.postcode} ${this.cityName.toUpperCase()}<br>
      ${this.stateName.toUpperCase()} ${this.countryName.toUpperCase()}`
  }

  getRequestBody() {
    return {
      address_line_1: this.addressLine1,
      address_line_2: this.addressLine2,
      address_line_3: this.addressLine3,
      postcode: this.postcode,
      city_id: this.city?.id,
      other_city: this.otherCity,
      state_id: this.state?.id,
      other_state: this.otherState,
      country_id: this.country?.id,
      other_country: this.otherCountry,
      latitude: this.latitude,
      longitude: this.longitude,
    }
  }

  canCreate(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.addressLine1) &&
      !StringUtil.isNullOrEmpty(this.postcode) &&
      this.city !== null &&
      this.city.id > 0 &&
      this.state !== null &&
      this.state.id > 0 &&
      this.country !== null &&
      this.country.id > 0
    )
  }

  get cityName(): string {
    if (!this.city) {
      return ""
    }

    if (StringUtil.isEqual(this.city.name, "others")) {
      return this.otherCity ?? ""
    }

    return this.city.name
  }

  get stateName(): string {
    if (!this.state) {
      return ""
    }

    if (StringUtil.isEqual(this.state.name, "others")) {
      return this.otherState ?? ""
    }

    return this.state.name
  }

  get countryName(): string {
    if (!this.country) {
      return ""
    }

    if (StringUtil.isEqual(this.country.name, "others")) {
      return this.otherCountry ?? ""
    }

    return this.country.name
  }
}

export class City {
  id: number = 0
  name: string = ""
  fullName: string = ""
  code: string = ""
  stateId: number = 0

  constructor(data: any = null) {
    if (data) {
      if (data instanceof City) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  convertFromResponse(data: any) {
    this.id = data.id || 0
    this.name = data.name || ""
    this.fullName = data.full_name || ""
    this.code = data.code || ""
    this.stateId = data.state_id || ""
  }

  clone(data: City) {
    this.id = data.id
    this.name = data.name
    this.fullName = data.fullName
    this.code = data.code
    this.stateId = data.stateId
  }
}

export class State {
  id: number = 0
  name: string = ""
  fullName: string = ""
  code: string = ""

  constructor(data: any = null) {
    if (data) {
      if (data instanceof State) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  convertFromResponse(data: any) {
    this.id = data.id || 0
    this.name = data.name || ""
    this.fullName = data.full_name || ""
    this.code = data.code || ""
  }

  clone(data: State) {
    this.id = data.id
    this.name = data.name
    this.fullName = data.fullName
    this.code = data.code
  }
}

export class Country {
  id: number = 87
  name: string = ""
  code: string = ""
  codeAlpha3: string = ""

  constructor(data: any = null) {
    if (data) {
      if (data instanceof Country) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  convertFromResponse(data: any) {
    this.id = data.id || 0
    this.name = data.name || ""
    this.code = data.code || ""
    this.codeAlpha3 = data.code_alpha3 || ""
  }

  clone(data: Country) {
    if (!(data instanceof Country)) {
      return
    }
    this.id = data.id
    this.name = data.name
    this.code = data.code
    this.codeAlpha3 = data.codeAlpha3
  }
}

export class PostcodeMapping {
  id: number = 0
  postcode: string = ""
  areaName: string = ""
  postOffice: string = ""
  stateId: number = 0
  cityId: number | null = null

  constructor(data: any = null) {
    if (data) {
      if (data instanceof PostcodeMapping) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.postcode = data.postcode
    this.areaName = data.area_name ?? ""
    this.postOffice = data.post_office ?? ""
    this.stateId = parseInt(data.state_code) ?? 0
    this.cityId = data.city_id ? parseInt(data.city_id) : null
  }

  clone(data: PostcodeMapping): void {
    this.id = data.id
    this.postcode = data.postcode
    this.areaName = data.areaName
    this.postOffice = data.postOffice
    this.stateId = data.stateId
    this.cityId = data.cityId
  }
}
