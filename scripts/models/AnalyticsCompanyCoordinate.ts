import { Coordinate } from "./Coordinate"
import { MsicCode } from "./MsicCode"
import _ from "lodash"

export class AnalyticsCompanyCoordinate {
  companyId: string = ""
  name: string = ""
  registrationNumberOld: string = ""
  registrationNumberNew: string = ""
  address: string = ""
  msicCodes: MsicCode[] = []
  coordinate = new Coordinate()
  annualReturnCompliance: any = null // need to set the type here
  numberOfDirectors: number = 1
  numberOfShareholders: number = 1
  totalShares: number = 0
  incorporatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AnalyticsCompanyCoordinate) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.companyId = data.company_id ?? ""
    this.name = data.name
    this.registrationNumberOld = data.registration_number_old
    this.registrationNumberNew = data.registration_number_new
    this.address = data.address
    this.msicCodes =
      data.msic_codes && Array.isArray(data.msic_codes)
        ? data.msic_codes.map((msicCode: any) => {
            return new MsicCode(msicCode)
          })
        : []
    this.coordinate = new Coordinate(data.coordinates ?? null)
    this.annualReturnCompliance = data.annual_return_compliance ? _.cloneDeep(data.annual_return_compliance) : null
    this.numberOfDirectors = data.number_of_directors
    this.numberOfShareholders = data.number_of_shareholders
    this.totalShares = data.total_shares ?? 100
    this.incorporatedAt = data.incorporated_at
  }

  clone(data: AnalyticsCompanyCoordinate): void {
    this.companyId = data.companyId
    this.name = data.name
    this.registrationNumberOld = data.registrationNumberOld
    this.registrationNumberNew = data.registrationNumberNew
    this.address = data.address
    this.msicCodes = data.msicCodes.map((msicCode) => {
      return new MsicCode(msicCode)
    })
    this.coordinate = new Coordinate(data.coordinate)
    this.annualReturnCompliance = data.annualReturnCompliance ? _.cloneDeep(data.annualReturnCompliance) : null
    this.numberOfDirectors = data.numberOfDirectors
    this.numberOfShareholders = data.numberOfShareholders
    this.totalShares = data.totalShares
    this.incorporatedAt = data.incorporatedAt
  }
}
